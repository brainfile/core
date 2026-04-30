"use strict";
/**
 * Brainfile Discovery Module
 *
 * Provides utilities for discovering brainfiles in a workspace/directory.
 * Used by CLI, VSCode extension, and other tools.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXCLUDE_DIRS = exports.BRAINFILE_GLOBS = exports.BRAINFILE_PATTERNS = void 0;
exports.isBrainfileName = isBrainfileName;
exports.extractBrainfileSuffix = extractBrainfileSuffix;
exports.discover = discover;
exports.findPrimaryBrainfile = findPrimaryBrainfile;
exports.findNearestBrainfile = findNearestBrainfile;
exports.watchBrainfiles = watchBrainfiles;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const parser_1 = require("./parser");
const query_1 = require("./query");
/**
 * Patterns for finding brainfiles (in priority order)
 */
exports.BRAINFILE_PATTERNS = [
    // Standard names
    'brainfile.md',
    '.brainfile.md',
    '.bb.md',
    // Suffixed variants (brainfile.private.md, brainfile.work.md, etc.)
    'brainfile.*.md',
];
/**
 * Glob patterns for recursive discovery
 */
exports.BRAINFILE_GLOBS = [
    // Root level
    'brainfile.md',
    '.brainfile.md',
    '.bb.md',
    'brainfile.*.md',
    // Nested (subfolders)
    '**/brainfile.md',
    '**/.brainfile.md',
    '**/.bb.md',
    '**/brainfile.*.md',
];
/**
 * Directories to exclude from discovery
 */
exports.EXCLUDE_DIRS = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'out',
    '.vscode-test',
    'coverage',
    '.next',
    '.nuxt',
    'vendor',
];
/**
 * Check if a filename matches brainfile patterns
 */
function isBrainfileName(filename) {
    const name = path.basename(filename).toLowerCase();
    // Exact matches
    if (name === 'brainfile.md' || name === '.brainfile.md' || name === '.bb.md') {
        return true;
    }
    // Suffixed pattern: brainfile.*.md
    if (name.startsWith('brainfile.') && name.endsWith('.md') && name !== 'brainfile.md') {
        return true;
    }
    return false;
}
/**
 * Check if a path should be excluded
 */
function shouldExclude(filePath, excludeDirs) {
    const parts = filePath.split(path.sep);
    return parts.some(part => excludeDirs.includes(part));
}
/**
 * Extract suffix from brainfile name (e.g., "private" from "brainfile.private.md")
 */
function extractBrainfileSuffix(filename) {
    const name = path.basename(filename).toLowerCase();
    if (name.startsWith('brainfile.') && name.endsWith('.md') && name !== 'brainfile.md') {
        // Extract middle part: brainfile.SUFFIX.md
        const withoutPrefix = name.slice('brainfile.'.length);
        const suffix = withoutPrefix.slice(0, -'.md'.length);
        return suffix || null;
    }
    return null;
}
/**
 * Determine if a file is considered private
 */
function isPrivateFile(filename, relativePath) {
    const suffix = extractBrainfileSuffix(filename);
    // Check for private suffix
    if (suffix === 'private' || suffix === 'local' || suffix === 'personal') {
        return true;
    }
    // Hidden files in hidden directories are often private
    if (relativePath.includes('/.') || relativePath.startsWith('.')) {
        return true;
    }
    return false;
}
/**
 * Parse a brainfile and extract metadata
 */
function parseFileMetadata(absolutePath, relativePath) {
    try {
        const content = fs.readFileSync(absolutePath, 'utf-8');
        const board = parser_1.BrainfileParser.parse(content);
        const stats = fs.statSync(absolutePath);
        const filename = path.basename(absolutePath);
        const isHidden = filename.startsWith('.');
        if (board) {
            return {
                absolutePath,
                relativePath,
                name: board.title || filename.replace(/\.md$/, ''),
                type: board.type || 'board',
                isHidden,
                isPrivate: isPrivateFile(filename, relativePath),
                itemCount: (0, query_1.getTotalTaskCount)(board),
                modifiedAt: stats.mtime,
            };
        }
        // File exists but failed to parse - still include it
        return {
            absolutePath,
            relativePath,
            name: filename.replace(/\.md$/, ''),
            type: 'unknown',
            isHidden,
            isPrivate: isPrivateFile(filename, relativePath),
            itemCount: 0,
            modifiedAt: stats.mtime,
        };
    }
    catch {
        return null;
    }
}
/**
 * Recursively find brainfiles in a directory
 */
function findBrainfilesRecursive(dir, rootDir, options, currentDepth = 0) {
    const results = [];
    if (currentDepth > options.maxDepth) {
        return results;
    }
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(rootDir, fullPath);
            if (entry.isDirectory()) {
                // Skip excluded directories
                if (shouldExclude(entry.name, options.excludeDirs)) {
                    continue;
                }
                // Recurse into subdirectories
                if (options.recursive) {
                    results.push(...findBrainfilesRecursive(fullPath, rootDir, options, currentDepth + 1));
                }
            }
            else if (entry.isFile()) {
                // Check if this is a brainfile
                if (!isBrainfileName(entry.name)) {
                    continue;
                }
                // Skip hidden files if not included
                if (entry.name.startsWith('.') && !options.includeHidden) {
                    continue;
                }
                const metadata = parseFileMetadata(fullPath, relativePath);
                if (metadata) {
                    results.push(metadata);
                }
            }
        }
    }
    catch {
        // Directory not readable, skip it
    }
    return results;
}
/**
 * Discover all brainfiles in a workspace directory
 *
 * @param rootDir - The root directory to search
 * @param options - Discovery options
 * @returns Discovery result with all found files
 *
 * @example
 * ```typescript
 * const result = discover('/path/to/project');
 * console.log(`Found ${result.files.length} brainfiles`);
 *
 * for (const file of result.files) {
 *   console.log(`${file.name}: ${file.itemCount} items`);
 * }
 * ```
 */
function discover(rootDir, options = {}) {
    const opts = {
        recursive: options.recursive ?? true,
        includeHidden: options.includeHidden ?? true,
        maxDepth: options.maxDepth ?? 10,
        excludeDirs: options.excludeDirs ?? [...exports.EXCLUDE_DIRS],
    };
    const absoluteRoot = path.resolve(rootDir);
    const files = findBrainfilesRecursive(absoluteRoot, absoluteRoot, opts);
    // Sort by path (root files first, then alphabetically)
    files.sort((a, b) => {
        const aDepth = a.relativePath.split(path.sep).length;
        const bDepth = b.relativePath.split(path.sep).length;
        if (aDepth !== bDepth) {
            return aDepth - bDepth;
        }
        return a.relativePath.localeCompare(b.relativePath);
    });
    return {
        root: absoluteRoot,
        files,
        totalItems: files.reduce((sum, f) => sum + f.itemCount, 0),
        discoveredAt: new Date(),
    };
}
/**
 * Find the primary brainfile in a directory
 * Returns the first match in priority order:
 * `.brainfile/brainfile.md` > `brainfile.md` > `.brainfile.md` > `.bb.md`
 *
 * @param rootDir - The directory to search
 * @returns The primary brainfile or null if none found
 */
function findPrimaryBrainfile(rootDir) {
    const absoluteRoot = path.resolve(rootDir);
    // Preferred location: .brainfile/brainfile.md
    const preferred = path.join(absoluteRoot, '.brainfile', 'brainfile.md');
    if (fs.existsSync(preferred)) {
        const metadata = parseFileMetadata(preferred, path.join('.brainfile', 'brainfile.md'));
        if (metadata)
            return metadata;
    }
    // Check in priority order
    const priorityNames = ['brainfile.md', '.brainfile.md', '.bb.md'];
    for (const name of priorityNames) {
        const fullPath = path.join(absoluteRoot, name);
        if (fs.existsSync(fullPath)) {
            const metadata = parseFileMetadata(fullPath, name);
            if (metadata) {
                return metadata;
            }
        }
    }
    // Fall back to any brainfile.*.md
    try {
        const entries = fs.readdirSync(absoluteRoot);
        for (const entry of entries) {
            if (isBrainfileName(entry) && !priorityNames.includes(entry.toLowerCase())) {
                const fullPath = path.join(absoluteRoot, entry);
                const stats = fs.statSync(fullPath);
                if (stats.isFile()) {
                    const metadata = parseFileMetadata(fullPath, entry);
                    if (metadata) {
                        return metadata;
                    }
                }
            }
        }
    }
    catch {
        // Directory not readable
    }
    return null;
}
/**
 * Find the nearest brainfile by walking up the directory tree from a starting point.
 * Similar to how git finds .git by walking up from cwd.
 *
 * @param startDir - The directory to start searching from (default: process.cwd())
 * @returns The nearest brainfile or null if none found up to filesystem root
 *
 * @example
 * ```typescript
 * // From /home/user/projects/myapp/src
 * // Will find /home/user/projects/myapp/brainfile.md if it exists
 * const brainfile = findNearestBrainfile();
 * if (brainfile) {
 *   console.log(`Found: ${brainfile.absolutePath}`);
 * }
 * ```
 */
function findNearestBrainfile(startDir) {
    let currentDir = path.resolve(startDir || process.cwd());
    const root = path.parse(currentDir).root;
    while (currentDir !== root) {
        const found = findPrimaryBrainfile(currentDir);
        if (found) {
            return found;
        }
        // Move up to parent directory
        const parentDir = path.dirname(currentDir);
        // Safety check: if we can't go up anymore, stop
        if (parentDir === currentDir) {
            break;
        }
        currentDir = parentDir;
    }
    // Check root directory as well
    const foundInRoot = findPrimaryBrainfile(root);
    if (foundInRoot) {
        return foundInRoot;
    }
    return null;
}
/**
 * Watch a directory for brainfile changes
 *
 * IMPORTANT: Always call the returned `stop()` function when done to prevent
 * resource leaks. The watcher holds file descriptors that must be released.
 *
 * @param rootDir - The directory to watch
 * @param callback - Called when files change
 * @param onError - Optional callback for runtime errors (e.g., watched dir deleted)
 * @returns WatchResult with stop function and status
 *
 * @example
 * ```typescript
 * const result = watchBrainfiles('/path/to/project', (event, file) => {
 *   console.log(`${event}: ${typeof file === 'string' ? file : file.name}`);
 * });
 *
 * if (!result.success) {
 *   console.error(`Watch failed: ${result.error?.message}`);
 * }
 *
 * // Later, when done watching:
 * result.stop();
 * ```
 */
function watchBrainfiles(rootDir, callback, onError) {
    const absoluteRoot = path.resolve(rootDir);
    let watcher = null;
    let active = false;
    // Validate directory exists and is accessible
    try {
        const stats = fs.statSync(absoluteRoot);
        if (!stats.isDirectory()) {
            return {
                success: false,
                stop: () => { },
                isActive: () => false,
                error: {
                    code: 'ENOTDIR',
                    message: `Path is not a directory: ${absoluteRoot}`,
                    path: absoluteRoot,
                },
            };
        }
    }
    catch (err) {
        const code = err.code === 'ENOENT' ? 'ENOENT'
            : err.code === 'EACCES' ? 'EACCES'
                : 'UNKNOWN';
        return {
            success: false,
            stop: () => { },
            isActive: () => false,
            error: {
                code,
                message: code === 'ENOENT'
                    ? `Directory does not exist: ${absoluteRoot}`
                    : code === 'EACCES'
                        ? `Permission denied: ${absoluteRoot}`
                        : `Cannot access directory: ${err.message}`,
                path: absoluteRoot,
            },
        };
    }
    // Create the watcher
    try {
        watcher = fs.watch(absoluteRoot, (eventType, filename) => {
            if (!active || !filename || !isBrainfileName(filename))
                return;
            const fullPath = path.join(absoluteRoot, filename);
            try {
                if (eventType === 'rename') {
                    if (fs.existsSync(fullPath)) {
                        const metadata = parseFileMetadata(fullPath, filename);
                        if (metadata) {
                            callback('add', metadata);
                        }
                    }
                    else {
                        callback('unlink', fullPath);
                    }
                }
                else if (eventType === 'change') {
                    const metadata = parseFileMetadata(fullPath, filename);
                    if (metadata) {
                        callback('change', metadata);
                    }
                }
            }
            catch (err) {
                // File operation failed during callback - non-fatal
                onError?.({
                    code: 'UNKNOWN',
                    message: `Error processing file event: ${err.message}`,
                    path: fullPath,
                });
            }
        });
        // Handle watcher errors (e.g., directory deleted while watching)
        watcher.on('error', (err) => {
            const watchError = {
                code: err.code === 'ENOENT' ? 'ENOENT' : 'UNKNOWN',
                message: `Watcher error: ${err.message}`,
                path: absoluteRoot,
            };
            onError?.(watchError);
            // Auto-cleanup on fatal watcher error
            if (watcher) {
                active = false;
                watcher.close();
                watcher = null;
            }
        });
        active = true;
    }
    catch (err) {
        const code = err.code === 'EMFILE' ? 'EMFILE'
            : err.code === 'EACCES' ? 'EACCES'
                : 'UNKNOWN';
        return {
            success: false,
            stop: () => { },
            isActive: () => false,
            error: {
                code,
                message: code === 'EMFILE'
                    ? 'Too many open files - close some watchers first'
                    : code === 'EACCES'
                        ? `Permission denied watching: ${absoluteRoot}`
                        : `Failed to watch directory: ${err.message}`,
                path: absoluteRoot,
            },
        };
    }
    // Return result with cleanup function
    return {
        success: true,
        stop: () => {
            if (watcher && active) {
                active = false;
                watcher.close();
                watcher = null;
            }
        },
        isActive: () => active,
    };
}
//# sourceMappingURL=discovery.js.map
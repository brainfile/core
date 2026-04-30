/**
 * Brainfile Discovery Module
 *
 * Provides utilities for discovering brainfiles in a workspace/directory.
 * Used by CLI, VSCode extension, and other tools.
 */
/**
 * Patterns for finding brainfiles (in priority order)
 */
export declare const BRAINFILE_PATTERNS: readonly ["brainfile.md", ".brainfile.md", ".bb.md", "brainfile.*.md"];
/**
 * Glob patterns for recursive discovery
 */
export declare const BRAINFILE_GLOBS: readonly ["brainfile.md", ".brainfile.md", ".bb.md", "brainfile.*.md", "**/brainfile.md", "**/.brainfile.md", "**/.bb.md", "**/brainfile.*.md"];
/**
 * Directories to exclude from discovery
 */
export declare const EXCLUDE_DIRS: readonly ["node_modules", ".git", "dist", "build", "out", ".vscode-test", "coverage", ".next", ".nuxt", "vendor"];
/**
 * Represents a discovered brainfile
 */
export interface DiscoveredFile {
    /** Absolute path to the file */
    absolutePath: string;
    /** Path relative to the workspace root */
    relativePath: string;
    /** Display name (from board title or filename) */
    name: string;
    /** Brainfile type (board, journal, etc.) */
    type: string;
    /** Whether this is a hidden file (.brainfile.md, .bb.md) */
    isHidden: boolean;
    /** Whether this file appears to be private (contains .private or in .gitignore) */
    isPrivate: boolean;
    /** Number of items (tasks for boards, entries for journals, etc.) */
    itemCount: number;
    /** File modification time */
    modifiedAt: Date;
}
/**
 * Options for discovery
 */
export interface DiscoveryOptions {
    /** Include nested directories (default: true) */
    recursive?: boolean;
    /** Include hidden files like .brainfile.md (default: true) */
    includeHidden?: boolean;
    /** Maximum directory depth for recursive search (default: 10) */
    maxDepth?: number;
    /** Custom exclude patterns */
    excludeDirs?: string[];
}
/**
 * Result of workspace discovery
 */
export interface DiscoveryResult {
    /** Root directory that was searched */
    root: string;
    /** All discovered brainfiles */
    files: DiscoveredFile[];
    /** Total item count across all files */
    totalItems: number;
    /** Discovery timestamp */
    discoveredAt: Date;
}
/**
 * Check if a filename matches brainfile patterns
 */
export declare function isBrainfileName(filename: string): boolean;
/**
 * Extract suffix from brainfile name (e.g., "private" from "brainfile.private.md")
 */
export declare function extractBrainfileSuffix(filename: string): string | null;
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
export declare function discover(rootDir: string, options?: DiscoveryOptions): DiscoveryResult;
/**
 * Find the primary brainfile in a directory
 * Returns the first match in priority order:
 * `.brainfile/brainfile.md` > `brainfile.md` > `.brainfile.md` > `.bb.md`
 *
 * @param rootDir - The directory to search
 * @returns The primary brainfile or null if none found
 */
export declare function findPrimaryBrainfile(rootDir: string): DiscoveredFile | null;
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
export declare function findNearestBrainfile(startDir?: string): DiscoveredFile | null;
/**
 * Error types for watch operations
 */
export interface WatchError {
    code: 'ENOENT' | 'EACCES' | 'ENOTDIR' | 'EMFILE' | 'UNKNOWN';
    message: string;
    path: string;
}
/**
 * Result of starting a watch operation
 */
export interface WatchResult {
    success: boolean;
    /** Cleanup function to stop watching - always call this when done */
    stop: () => void;
    /** Error if watch failed to start */
    error?: WatchError;
    /** Whether the watcher is currently active */
    isActive: () => boolean;
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
export declare function watchBrainfiles(rootDir: string, callback: (event: 'add' | 'change' | 'unlink', file: DiscoveredFile | string) => void, onError?: (error: WatchError) => void): WatchResult;
//# sourceMappingURL=discovery.d.ts.map
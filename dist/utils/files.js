"use strict";
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
exports.DOT_BRAINFILE_GITIGNORE_BASENAME = exports.BRAINFILE_STATE_BASENAME = exports.BRAINFILE_BASENAME = exports.DOT_BRAINFILE_DIRNAME = void 0;
exports.findBrainfile = findBrainfile;
exports.resolveBrainfilePath = resolveBrainfilePath;
exports.getBrainfileStateDir = getBrainfileStateDir;
exports.getBrainfileStatePath = getBrainfileStatePath;
exports.getDotBrainfileGitignorePath = getDotBrainfileGitignorePath;
exports.ensureDotBrainfileDir = ensureDotBrainfileDir;
exports.ensureDotBrainfileGitignore = ensureDotBrainfileGitignore;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.DOT_BRAINFILE_DIRNAME = '.brainfile';
exports.BRAINFILE_BASENAME = 'brainfile.md';
/** @deprecated state.json is no longer used by Brainfile. */
exports.BRAINFILE_STATE_BASENAME = 'state.json';
exports.DOT_BRAINFILE_GITIGNORE_BASENAME = '.gitignore';
function toAbsolute(p) {
    return path.isAbsolute(p) ? p : path.resolve(p);
}
function existsFile(p) {
    try {
        return fs.statSync(p).isFile();
    }
    catch {
        return false;
    }
}
/**
 * Find a brainfile by walking up from a starting directory.
 *
 * Resolution priority (per directory):
 * 1) `.brainfile/brainfile.md` (preferred)
 * 2) `brainfile.md` (legacy)
 * 3) `.brainfile.md` (legacy hidden)
 * 4) `.bb.md` (legacy)
 */
function findBrainfile(startDir = process.cwd()) {
    let currentDir = path.resolve(startDir);
    const root = path.parse(currentDir).root;
    while (true) {
        const preferred = path.join(currentDir, exports.DOT_BRAINFILE_DIRNAME, exports.BRAINFILE_BASENAME);
        if (existsFile(preferred)) {
            return { absolutePath: preferred, projectRoot: currentDir, kind: 'dotdir' };
        }
        const legacy = path.join(currentDir, exports.BRAINFILE_BASENAME);
        if (existsFile(legacy)) {
            return { absolutePath: legacy, projectRoot: currentDir, kind: 'root' };
        }
        const hiddenLegacy = path.join(currentDir, '.brainfile.md');
        if (existsFile(hiddenLegacy)) {
            return { absolutePath: hiddenLegacy, projectRoot: currentDir, kind: 'hidden' };
        }
        const bbLegacy = path.join(currentDir, '.bb.md');
        if (existsFile(bbLegacy)) {
            return { absolutePath: bbLegacy, projectRoot: currentDir, kind: 'bb' };
        }
        if (currentDir === root)
            break;
        const parent = path.dirname(currentDir);
        if (parent === currentDir)
            break;
        currentDir = parent;
    }
    return null;
}
/**
 * Resolve a brainfile path for CLI/MCP usage.
 *
 * - If `filePath` is omitted (or is the default `brainfile.md`), attempts auto-discovery.
 * - If discovery fails, falls back to resolving `filePath` relative to `startDir`/cwd.
 */
function resolveBrainfilePath(options = {}) {
    const startDir = options.startDir ? path.resolve(options.startDir) : process.cwd();
    const filePath = options.filePath;
    const isDefaultPlaceholder = filePath === undefined ||
        filePath === exports.BRAINFILE_BASENAME ||
        filePath === `./${exports.BRAINFILE_BASENAME}`;
    if (isDefaultPlaceholder) {
        const found = findBrainfile(startDir);
        if (found)
            return found.absolutePath;
        return toAbsolute(filePath ?? exports.BRAINFILE_BASENAME);
    }
    return toAbsolute(path.isAbsolute(filePath) ? filePath : path.resolve(startDir, filePath));
}
/**
 * Return the `.brainfile/` directory for a given brainfile.
 *
 * - If the brainfile itself is inside `.brainfile/`, returns that directory.
 * - Otherwise returns `<brainfileDir>/.brainfile/`.
 */
function getBrainfileStateDir(brainfilePath) {
    const abs = toAbsolute(brainfilePath);
    const dir = path.dirname(abs);
    if (path.basename(dir) === exports.DOT_BRAINFILE_DIRNAME)
        return dir;
    return path.join(dir, exports.DOT_BRAINFILE_DIRNAME);
}
/**
 * @deprecated state.json is no longer used by Brainfile.
 */
function getBrainfileStatePath(brainfilePath) {
    return path.join(getBrainfileStateDir(brainfilePath), exports.BRAINFILE_STATE_BASENAME);
}
function getDotBrainfileGitignorePath(brainfilePath) {
    return path.join(getBrainfileStateDir(brainfilePath), exports.DOT_BRAINFILE_GITIGNORE_BASENAME);
}
function ensureDotBrainfileDir(brainfilePath) {
    const dir = getBrainfileStateDir(brainfilePath);
    fs.mkdirSync(dir, { recursive: true });
    return dir;
}
/**
 * Ensure `.brainfile/.gitignore` exists.
 *
 * Note: Brainfile no longer writes `state.json`, so no state entry is added.
 */
function ensureDotBrainfileGitignore(brainfilePath) {
    ensureDotBrainfileDir(brainfilePath);
    const gitignorePath = getDotBrainfileGitignorePath(brainfilePath);
    if (!fs.existsSync(gitignorePath)) {
        fs.writeFileSync(gitignorePath, '', 'utf-8');
    }
}
//# sourceMappingURL=files.js.map
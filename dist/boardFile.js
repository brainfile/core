"use strict";
/**
 * Board config file reader/writer.
 *
 * Provides parse, serialize, read, and write operations for the board
 * configuration file (`.brainfile/brainfile.md`), matching the pattern
 * established by `taskFile.ts` for per-task files.
 *
 * The board config file uses YAML frontmatter + markdown body:
 *
 * ```markdown
 * ---
 * title: My Board
 * columns:
 *   - id: todo
 *     title: To Do
 *   - id: done
 *     title: Done
 * agent:
 *   instructions:
 *     - Always write tests
 *   identity: You are a senior engineer
 * ---
 *
 * ## Notes
 * Project-level notes here.
 * ```
 *
 * @packageDocumentation
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
exports.serializeBoardConfig = exports.parseBoardConfig = void 0;
exports.readBoardConfig = readBoardConfig;
exports.writeBoardConfig = writeBoardConfig;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const boardContent_1 = require("./boardContent");
var boardContent_2 = require("./boardContent");
Object.defineProperty(exports, "parseBoardConfig", { enumerable: true, get: function () { return boardContent_2.parseBoardConfig; } });
Object.defineProperty(exports, "serializeBoardConfig", { enumerable: true, get: function () { return boardContent_2.serializeBoardConfig; } });
/**
 * Read and parse a board config file from disk.
 *
 * @param filePath - Absolute path to the board config `.md` file
 * @returns Parsed config, body, and filePath; or null if file is invalid
 */
function readBoardConfig(filePath) {
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf-8');
    }
    catch {
        return null;
    }
    const parsed = (0, boardContent_1.parseBoardConfig)(content);
    if (!parsed) {
        return null;
    }
    return {
        config: parsed.config,
        body: parsed.body,
        filePath: path.resolve(filePath),
    };
}
/**
 * Write a board config to disk.
 *
 * @param filePath - Absolute path to write the board config file
 * @param config - Board configuration (YAML frontmatter)
 * @param body - Markdown body content
 */
function writeBoardConfig(filePath, config, body = '') {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    const content = (0, boardContent_1.serializeBoardConfig)(config, body);
    fs.writeFileSync(filePath, content, 'utf-8');
}
//# sourceMappingURL=boardFile.js.map
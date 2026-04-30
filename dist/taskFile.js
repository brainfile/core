"use strict";
/**
 * Task file reader/writer for per-task file architecture (v2).
 *
 * Each task is a standalone `.md` file with YAML frontmatter + markdown body:
 *
 * ```markdown
 * ---
 * id: task-1
 * title: Implement feature
 * column: todo
 * ...
 * ---
 *
 * ## Description
 * Markdown body here...
 *
 * ## Log
 * - 2025-12-17T10:00:00Z: Started work
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
exports.serializeTaskContent = exports.parseTaskContent = void 0;
exports.readTaskFile = readTaskFile;
exports.writeTaskFile = writeTaskFile;
exports.readTasksDir = readTasksDir;
exports.taskFileName = taskFileName;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const taskContent_1 = require("./taskContent");
var taskContent_2 = require("./taskContent");
Object.defineProperty(exports, "parseTaskContent", { enumerable: true, get: function () { return taskContent_2.parseTaskContent; } });
Object.defineProperty(exports, "serializeTaskContent", { enumerable: true, get: function () { return taskContent_2.serializeTaskContent; } });
/**
 * Validate task IDs before using them as path components.
 * Rejects path traversal and path separator characters.
 */
function isUnsafeTaskId(taskId) {
    if (!taskId || taskId.trim() === '') {
        return true;
    }
    const trimmed = taskId.trim();
    if (trimmed.includes('/') || trimmed.includes('\\') || trimmed.includes('..')) {
        return true;
    }
    if (path.isAbsolute(trimmed)) {
        return true;
    }
    return path.basename(trimmed) !== trimmed;
}
/**
 * Read and parse a single task file from disk.
 *
 * @param filePath - Absolute path to the task `.md` file
 * @returns TaskDocument with metadata, body, and filePath; or null if file is invalid
 */
function readTaskFile(filePath) {
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf-8');
    }
    catch {
        return null;
    }
    const parsed = (0, taskContent_1.parseTaskContent)(content);
    if (!parsed) {
        return null;
    }
    return {
        task: parsed.task,
        body: parsed.body,
        filePath: path.resolve(filePath),
    };
}
/**
 * Write a task document to disk.
 *
 * @param filePath - Absolute path to write the task file
 * @param task - Task metadata (YAML frontmatter)
 * @param body - Markdown body content
 */
function writeTaskFile(filePath, task, body = '') {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    const content = (0, taskContent_1.serializeTaskContent)(task, body);
    fs.writeFileSync(filePath, content, 'utf-8');
}
/**
 * Read all task files from a directory.
 *
 * Scans for `.md` files, parses each as a task document, and returns
 * all successfully parsed tasks. Files that fail to parse are silently skipped.
 *
 * @param dirPath - Absolute path to the tasks directory
 * @returns Array of TaskDocument objects
 */
function readTasksDir(dirPath) {
    let entries;
    try {
        entries = fs.readdirSync(dirPath, { withFileTypes: true });
    }
    catch {
        return [];
    }
    const docs = [];
    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.md')) {
            continue;
        }
        const filePath = path.join(dirPath, entry.name);
        const doc = readTaskFile(filePath);
        if (doc) {
            docs.push(doc);
        }
    }
    return docs;
}
/**
 * Get the expected filename for a task ID.
 * Convention: `{task-id}.md` (e.g., `task-42.md`)
 */
function taskFileName(taskId) {
    if (isUnsafeTaskId(taskId)) {
        throw new Error(`Invalid task ID: ${taskId}`);
    }
    return `${taskId.trim()}.md`;
}
//# sourceMappingURL=taskFile.js.map
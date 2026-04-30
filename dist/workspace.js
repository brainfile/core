"use strict";
/**
 * V2 workspace detection, path resolution, and body helpers.
 *
 * These helpers provide the directory/layout layer for v2 brainfiles
 * where config lives in `.brainfile/brainfile.md` and tasks live in
 * `.brainfile/board/` and `.brainfile/logs/`.
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
exports.getV2Dirs = getV2Dirs;
exports.isV2 = isV2;
exports.ensureV2Dirs = ensureV2Dirs;
exports.getTaskFilePath = getTaskFilePath;
exports.getLogFilePath = getLogFilePath;
exports.findV2Task = findV2Task;
exports.extractDescription = extractDescription;
exports.extractLog = extractLog;
exports.composeBody = composeBody;
exports.readV2BoardConfig = readV2BoardConfig;
exports.buildBoardFromV2 = buildBoardFromV2;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const parser_1 = require("./parser");
const taskFile_1 = require("./taskFile");
/**
 * Get the v2 directory structure paths from a brainfile path.
 */
function getV2Dirs(brainfilePath) {
    const resolvedPath = path.resolve(brainfilePath);
    const dotDir = path.dirname(resolvedPath);
    return {
        dotDir,
        boardDir: path.join(dotDir, 'board'),
        logsDir: path.join(dotDir, 'logs'),
        brainfilePath: resolvedPath,
    };
}
/**
 * Check if a brainfile is using v2 per-task file architecture.
 * V2 is detected by the presence of a board/ directory in .brainfile/.
 */
function isV2(brainfilePath) {
    const { boardDir } = getV2Dirs(brainfilePath);
    return fs.existsSync(boardDir);
}
/**
 * Ensure the v2 directory structure exists.
 */
function ensureV2Dirs(brainfilePath) {
    const dirs = getV2Dirs(brainfilePath);
    fs.mkdirSync(dirs.boardDir, { recursive: true });
    fs.mkdirSync(dirs.logsDir, { recursive: true });
    return dirs;
}
/**
 * Get the file path for a task in the board/ directory.
 */
function getTaskFilePath(boardDir, taskId) {
    return path.join(boardDir, (0, taskFile_1.taskFileName)(taskId));
}
/**
 * Get the file path for a completed task in the logs/ directory.
 */
function getLogFilePath(logsDir, taskId) {
    return path.join(logsDir, (0, taskFile_1.taskFileName)(taskId));
}
/**
 * Find a task by ID across active tasks and optionally logs.
 * Returns the TaskDocument, its file path, and whether it's in logs.
 */
function findV2Task(dirs, taskId, searchLogs = false) {
    // Fast path: convention-based filename in board/
    const taskPath = getTaskFilePath(dirs.boardDir, taskId);
    const taskDoc = (0, taskFile_1.readTaskFile)(taskPath);
    if (taskDoc && taskDoc.task.id === taskId) {
        return { doc: taskDoc, filePath: taskPath, isLog: false };
    }
    // Fast path: convention-based filename in logs/
    if (searchLogs) {
        const logPath = getLogFilePath(dirs.logsDir, taskId);
        const logDoc = (0, taskFile_1.readTaskFile)(logPath);
        if (logDoc && logDoc.task.id === taskId) {
            return { doc: logDoc, filePath: logPath, isLog: true };
        }
    }
    // Slow path: scan board/ directory for non-standard file names
    const boardDocs = (0, taskFile_1.readTasksDir)(dirs.boardDir);
    const boardMatch = boardDocs.find((d) => d.task.id === taskId);
    if (boardMatch) {
        return {
            doc: boardMatch,
            filePath: boardMatch.filePath || taskPath,
            isLog: false,
        };
    }
    if (searchLogs) {
        const logDocs = (0, taskFile_1.readTasksDir)(dirs.logsDir);
        const logMatch = logDocs.find((d) => d.task.id === taskId);
        if (logMatch) {
            return {
                doc: logMatch,
                filePath: logMatch.filePath || getLogFilePath(dirs.logsDir, taskId),
                isLog: true,
            };
        }
    }
    return null;
}
/**
 * Extract the description section from a task document body.
 */
function extractDescription(body) {
    const match = body.match(/## Description\n([\s\S]*?)(?=\n## |\n*$)/);
    return match ? match[1].trim() || undefined : undefined;
}
/**
 * Extract the log section from a task document body.
 */
function extractLog(body) {
    const match = body.match(/## Log\n([\s\S]*?)(?=\n## |\n*$)/);
    return match ? match[1].trim() || undefined : undefined;
}
/**
 * Compose a markdown body from separate description and log sections.
 */
function composeBody(description, log) {
    const sections = [];
    if (description && description.trim()) {
        sections.push(`## Description\n${description.trim()}`);
    }
    if (log && log.trim()) {
        sections.push(`## Log\n${log.trim()}`);
    }
    if (sections.length === 0)
        return '';
    return `${sections.join('\n\n')}\n`;
}
/**
 * Read the v2 board config (config-only brainfile without embedded tasks).
 */
function readV2BoardConfig(brainfilePath) {
    const content = fs.readFileSync(brainfilePath, 'utf-8');
    const result = parser_1.BrainfileParser.parseWithErrors(content);
    if (!result.board) {
        throw new Error(`Failed to parse brainfile: ${result.error}`);
    }
    const board = result.board;
    for (const col of board.columns) {
        if (!col.tasks)
            col.tasks = [];
    }
    return board;
}
/**
 * Build a full v1-compatible Board from v2 per-task files.
 * Reads the board config and populates column tasks from the board/ directory.
 */
function buildBoardFromV2(brainfilePath) {
    const dirs = getV2Dirs(brainfilePath);
    const board = readV2BoardConfig(brainfilePath);
    const taskDocs = (0, taskFile_1.readTasksDir)(dirs.boardDir);
    const tasksByColumn = new Map();
    for (const doc of taskDocs) {
        const colId = doc.task.column || 'todo';
        if (!tasksByColumn.has(colId)) {
            tasksByColumn.set(colId, []);
        }
        tasksByColumn.get(colId).push(doc);
    }
    for (const col of board.columns) {
        const colTasks = tasksByColumn.get(col.id) || [];
        colTasks.sort((a, b) => {
            const posA = a.task.position ?? Number.MAX_SAFE_INTEGER;
            const posB = b.task.position ?? Number.MAX_SAFE_INTEGER;
            if (posA !== posB)
                return posA - posB;
            return a.task.id.localeCompare(b.task.id);
        });
        col.tasks = colTasks.map((doc) => {
            const task = { ...doc.task };
            if (!task.description) {
                const description = extractDescription(doc.body);
                if (description)
                    task.description = description;
            }
            return task;
        });
    }
    return board;
}
//# sourceMappingURL=workspace.js.map
"use strict";
/**
 * File-based task operations for per-task file architecture (v2).
 *
 * These functions operate on individual task files in `.brainfile/board/`
 * and `.brainfile/logs/`. Unlike the v1 board operations (operations.ts),
 * these have filesystem side effects (reading/writing/moving files).
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
exports.DEFAULT_CONTRACT_COLUMN_MAP = void 0;
exports.generateNextFileTaskId = generateNextFileTaskId;
exports.addTaskFile = addTaskFile;
exports.moveTaskFile = moveTaskFile;
exports.completeTaskFile = completeTaskFile;
exports.deleteTaskFile = deleteTaskFile;
exports.appendLog = appendLog;
exports.listTasks = listTasks;
exports.findTask = findTask;
exports.searchTaskFiles = searchTaskFiles;
exports.searchLogs = searchLogs;
exports.pickupTaskContract = pickupTaskContract;
exports.deliverTaskContract = deliverTaskContract;
exports.completeTaskContract = completeTaskContract;
exports.failTaskContract = failTaskContract;
exports.getEffectiveState = getEffectiveState;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const taskFile_1 = require("./taskFile");
const ledger_1 = require("./ledger");
const ledger_2 = require("./ledger");
function normalizeTaskDependencyIds(values) {
    if (!Array.isArray(values)) {
        return undefined;
    }
    const deps = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
    return deps.length > 0 ? deps : undefined;
}
function appendBodySection(body, section) {
    const trimmed = body.trimEnd();
    if (!trimmed) {
        return `${section}\n`;
    }
    return `${trimmed}\n\n${section}\n`;
}
function extractEpicChildTaskIds(task) {
    const rawSubtasks = task.subtasks;
    if (!Array.isArray(rawSubtasks)) {
        return [];
    }
    const childIds = [];
    for (const subtask of rawSubtasks) {
        if (typeof subtask === 'string' && subtask.trim() !== '') {
            childIds.push(subtask.trim());
            continue;
        }
        if (subtask && typeof subtask === 'object') {
            const candidateId = subtask.id;
            if (typeof candidateId === 'string' && candidateId.trim() !== '') {
                childIds.push(candidateId.trim());
            }
        }
    }
    return [...new Set(childIds)];
}
function resolveChildTasks(epicId, childIds, boardDir, logsDir) {
    const docs = [...(0, taskFile_1.readTasksDir)(boardDir), ...(0, taskFile_1.readTasksDir)(logsDir)];
    // Prefer first-class parentId links when present.
    const linked = docs.filter((doc) => doc.task.parentId === epicId);
    if (linked.length > 0) {
        return linked.map((doc) => ({ id: doc.task.id, title: doc.task.title }));
    }
    if (childIds.length === 0) {
        return [];
    }
    const titleById = new Map();
    for (const doc of docs) {
        if (!titleById.has(doc.task.id)) {
            titleById.set(doc.task.id, doc.task.title);
        }
    }
    const childTasks = [];
    for (const childId of childIds) {
        const title = titleById.get(childId);
        if (title) {
            childTasks.push({ id: childId, title });
        }
    }
    return childTasks;
}
function buildChildTasksSection(childTasks) {
    if (childTasks.length === 0) {
        return '## Child Tasks\nNo child tasks recorded.';
    }
    const lines = childTasks.map((child) => `- ${child.id}: ${child.title}`);
    return `## Child Tasks\n${lines.join('\n')}`;
}
function writeTaskFileExclusive(filePath, task, body) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    const content = (0, taskFile_1.serializeTaskContent)(task, body);
    fs.writeFileSync(filePath, content, { encoding: 'utf-8', flag: 'wx' });
}
function rollbackLedgerAppend(logsDir, appendedRecord) {
    const ledgerPath = path.join(logsDir, 'ledger.jsonl');
    const appendedLine = `${JSON.stringify(appendedRecord)}\n`;
    const appendedBytes = Buffer.byteLength(appendedLine, 'utf-8');
    try {
        const stat = fs.statSync(ledgerPath);
        const newSize = stat.size - appendedBytes;
        if (newSize >= 0) {
            fs.truncateSync(ledgerPath, newSize);
        }
    }
    catch {
        // Best effort rollback only.
    }
}
function completeTaskFileLegacy(taskPath, logsDir, doc, completedTask) {
    const baseName = path.basename(taskPath);
    const destPath = path.join(logsDir, baseName);
    let completedBody = doc.body;
    if (doc.task.type === 'epic') {
        const boardDir = path.dirname(taskPath);
        const childIds = extractEpicChildTaskIds(doc.task);
        const childTasks = resolveChildTasks(doc.task.id, childIds, boardDir, logsDir);
        const childTasksSection = buildChildTasksSection(childTasks);
        completedBody = appendBodySection(doc.body, childTasksSection);
    }
    if (fs.existsSync(destPath)) {
        return { success: false, error: `Task already exists in logs: ${doc.task.id}` };
    }
    try {
        fs.mkdirSync(logsDir, { recursive: true });
        writeTaskFileExclusive(destPath, completedTask, completedBody);
    }
    catch (err) {
        return { success: false, error: `Failed to complete task: ${err}` };
    }
    try {
        fs.unlinkSync(taskPath);
        return { success: true, task: completedTask, filePath: destPath };
    }
    catch (err) {
        // Roll back the new log file to avoid duplicated active/completed copies.
        try {
            fs.unlinkSync(destPath);
        }
        catch {
            // Best effort rollback.
        }
        return { success: false, error: `Failed to finalize completion: ${err}` };
    }
}
/**
 * Generate the next task ID by scanning an existing tasks directory.
 *
 * When `typePrefix` is provided (e.g., "epic"), generates IDs like `epic-1`
 * and only scans for IDs matching that prefix. Defaults to "task".
 *
 * @param boardDir - Path to the tasks directory
 * @param logsDir - Optional path to the logs directory (also scanned for used IDs)
 * @param typePrefix - Optional ID prefix (default: "task"). E.g., "epic" produces "epic-1".
 * @returns Next available ID (e.g., `task-42` or `epic-1`)
 */
function generateNextFileTaskId(boardDir, logsDir, typePrefix = 'task') {
    let maxNum = 0;
    const escaped = typePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`^${escaped}-(\\d+)$`);
    const scanDir = (dir) => {
        const docs = (0, taskFile_1.readTasksDir)(dir);
        for (const doc of docs) {
            const match = doc.task.id.match(pattern);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum)
                    maxNum = num;
            }
        }
    };
    scanDir(boardDir);
    if (logsDir) {
        scanDir(logsDir);
        // Also scan ledger.jsonl — tasks completed via the non-legacy path
        // only exist there, not as .md files in logs/.
        try {
            for (const record of (0, ledger_1.readLedger)(logsDir)) {
                const match = record.id.match(pattern);
                if (match) {
                    const num = parseInt(match[1], 10);
                    if (num > maxNum)
                        maxNum = num;
                }
            }
        }
        catch {
            // Ledger may not exist yet
        }
    }
    return `${typePrefix}-${maxNum + 1}`;
}
/**
 * Add a new task file to the tasks directory.
 *
 * @param boardDir - Absolute path to `.brainfile/board/`
 * @param input - Task creation input
 * @param body - Optional markdown body content
 * @param logsDir - Optional logs directory to scan for used IDs
 * @returns TaskOperationResult with the created task
 */
function addTaskFile(boardDir, input, body = '', logsDir) {
    if (!input.title || input.title.trim() === '') {
        return { success: false, error: 'Task title is required' };
    }
    if (!input.column || input.column.trim() === '') {
        return { success: false, error: 'Task column is required' };
    }
    const typePrefix = input.type || 'task';
    const maxAttempts = input.id ? 1 : 25;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const taskId = input.id || generateNextFileTaskId(boardDir, logsDir, typePrefix);
        const now = new Date().toISOString();
        // Build subtasks if provided
        const subtasks = input.subtasks?.map((title, index) => ({
            id: `${taskId}-${index + 1}`,
            title: title.trim(),
            completed: false,
        }));
        const task = {
            id: taskId,
            title: input.title.trim(),
            ...(input.type && { type: input.type }),
            column: input.column.trim(),
            ...(input.position !== undefined && { position: input.position }),
            ...(input.description && { description: input.description.trim() }),
            ...(input.priority && { priority: input.priority }),
            ...(input.tags && input.tags.length > 0 && { tags: input.tags }),
            ...(input.assignee && { assignee: input.assignee }),
            ...(input.dueDate && { dueDate: input.dueDate }),
            ...(input.relatedFiles && input.relatedFiles.length > 0 && { relatedFiles: input.relatedFiles }),
            ...(input.template && { template: input.template }),
            ...(input.parentId && input.parentId.trim().length > 0 && { parentId: input.parentId.trim() }),
            ...(normalizeTaskDependencyIds(input.dependsOn) && { dependsOn: normalizeTaskDependencyIds(input.dependsOn) }),
            ...(subtasks && subtasks.length > 0 && { subtasks }),
            createdAt: now,
        };
        let filePath;
        try {
            filePath = path.join(boardDir, (0, taskFile_1.taskFileName)(taskId));
        }
        catch (err) {
            return { success: false, error: err.message };
        }
        try {
            writeTaskFileExclusive(filePath, task, body);
            return { success: true, task, filePath };
        }
        catch (err) {
            if (err?.code === 'EEXIST' && !input.id) {
                continue; // retry with next generated ID if we raced
            }
            if (err?.code === 'EEXIST') {
                return { success: false, error: `Task already exists: ${taskId}` };
            }
            return { success: false, error: `Failed to write task file: ${err}` };
        }
    }
    return { success: false, error: 'Failed to allocate unique task ID' };
}
/**
 * Move a task to a different column by updating its frontmatter.
 *
 * @param taskPath - Absolute path to the task file
 * @param newColumn - New column ID
 * @param newPosition - Optional new position within the column
 * @returns TaskOperationResult
 */
function moveTaskFile(taskPath, newColumn, newPosition) {
    const doc = (0, taskFile_1.readTaskFile)(taskPath);
    if (!doc) {
        return { success: false, error: `Failed to read task file: ${taskPath}` };
    }
    const updatedTask = {
        ...doc.task,
        column: newColumn,
        updatedAt: new Date().toISOString(),
    };
    if (newPosition !== undefined) {
        updatedTask.position = newPosition;
    }
    try {
        (0, taskFile_1.writeTaskFile)(taskPath, updatedTask, doc.body);
        return { success: true, task: updatedTask, filePath: taskPath };
    }
    catch (err) {
        return { success: false, error: `Failed to write task file: ${err}` };
    }
}
/**
 * Complete a task by appending to `logs/ledger.jsonl` and removing board file.
 * Legacy mode can still move markdown files into logs/.
 *
 * @param taskPath - Absolute path to the task file in board/
 * @param logsDir - Absolute path to the logs directory
 * @param options - Optional completion behavior and ledger details
 * @returns TaskOperationResult with the completed task
 */
function completeTaskFile(taskPath, logsDir, options = {}) {
    const doc = (0, taskFile_1.readTaskFile)(taskPath);
    if (!doc) {
        return { success: false, error: `Failed to read task file: ${taskPath}` };
    }
    const now = new Date().toISOString();
    // Remove column and position, add completedAt
    const { column: _column, position: _position, ...rest } = doc.task;
    const completedTask = {
        ...rest,
        completedAt: now,
        updatedAt: now,
    };
    if (options.legacyMode) {
        return completeTaskFileLegacy(taskPath, logsDir, doc, completedTask);
    }
    const record = (0, ledger_2.buildLedgerRecord)(completedTask, doc.body, {
        summary: options.summary,
        filesChanged: options.filesChanged,
        completedAt: now,
        columnHistory: options.columnHistory,
        validationAttempts: options.validationAttempts,
    });
    let ledgerPath;
    try {
        ledgerPath = (0, ledger_2.appendLedgerRecord)(logsDir, record);
    }
    catch (err) {
        return { success: false, error: `Failed to append ledger record: ${err}` };
    }
    try {
        fs.unlinkSync(taskPath);
        return { success: true, task: completedTask, filePath: ledgerPath };
    }
    catch (err) {
        rollbackLedgerAppend(logsDir, record);
        return { success: false, error: `Failed to finalize completion: ${err}` };
    }
}
/**
 * Delete a task file from disk.
 *
 * @param taskPath - Absolute path to the task file
 * @returns TaskOperationResult
 */
function deleteTaskFile(taskPath) {
    const doc = (0, taskFile_1.readTaskFile)(taskPath);
    if (!doc) {
        return { success: false, error: `Failed to read task file: ${taskPath}` };
    }
    try {
        fs.unlinkSync(taskPath);
        return { success: true, task: doc.task };
    }
    catch (err) {
        return { success: false, error: `Failed to delete task file: ${err}` };
    }
}
/**
 * Append a timestamped log entry to a task file's ## Log section.
 *
 * If the `## Log` section does not exist, it is created at the end of the body.
 *
 * @param taskPath - Absolute path to the task file
 * @param entry - Log entry text
 * @param agent - Optional agent attribution
 * @returns TaskOperationResult
 */
function appendLog(taskPath, entry, agent) {
    const doc = (0, taskFile_1.readTaskFile)(taskPath);
    if (!doc) {
        return { success: false, error: `Failed to read task file: ${taskPath}` };
    }
    const now = new Date().toISOString();
    const attribution = agent ? ` [${agent}]` : '';
    const logLine = `- ${now}${attribution}: ${entry}`;
    let body = doc.body;
    // Find the ## Log section
    const logSectionRegex = /^## Log\s*$/m;
    const match = logSectionRegex.exec(body);
    if (match) {
        // Insert the log entry after the ## Log header
        const insertPos = match.index + match[0].length;
        body = body.slice(0, insertPos) + '\n' + logLine + body.slice(insertPos);
    }
    else {
        // Create the section at the end
        if (body.length > 0 && !body.endsWith('\n')) {
            body += '\n';
        }
        if (body.length > 0) {
            body += '\n';
        }
        body += '## Log\n' + logLine + '\n';
    }
    const updatedTask = {
        ...doc.task,
        updatedAt: now,
    };
    try {
        (0, taskFile_1.writeTaskFile)(taskPath, updatedTask, body);
        return { success: true, task: updatedTask, filePath: taskPath };
    }
    catch (err) {
        return { success: false, error: `Failed to append log: ${err}` };
    }
}
/**
 * List tasks from a directory, with optional filters.
 * Results are grouped by column and sorted by position.
 *
 * @param boardDir - Absolute path to the tasks directory
 * @param filters - Optional filters to apply
 * @returns Array of TaskDocument objects, sorted by column and position
 */
function listTasks(boardDir, filters) {
    let docs = (0, taskFile_1.readTasksDir)(boardDir);
    if (filters) {
        if (filters.column) {
            docs = docs.filter((d) => d.task.column === filters.column);
        }
        if (filters.tag) {
            docs = docs.filter((d) => d.task.tags?.includes(filters.tag));
        }
        if (filters.priority) {
            docs = docs.filter((d) => d.task.priority === filters.priority);
        }
        if (filters.assignee) {
            docs = docs.filter((d) => d.task.assignee === filters.assignee);
        }
        if (filters.parentId) {
            docs = docs.filter((d) => d.task.parentId === filters.parentId);
        }
    }
    // Sort: by column alphabetically, then by position within column
    docs.sort((a, b) => {
        const colA = a.task.column || '';
        const colB = b.task.column || '';
        if (colA !== colB)
            return colA.localeCompare(colB);
        const posA = a.task.position ?? Number.MAX_SAFE_INTEGER;
        const posB = b.task.position ?? Number.MAX_SAFE_INTEGER;
        return posA - posB;
    });
    return docs;
}
/**
 * Find a task by ID in a directory.
 *
 * First attempts direct file lookup by convention (`{taskId}.md`),
 * then falls back to scanning all files.
 *
 * @param boardDir - Absolute path to the tasks directory
 * @param taskId - Task ID to find
 * @returns TaskDocument or null if not found
 */
function findTask(boardDir, taskId) {
    // Fast path: try convention-based filename
    try {
        const directPath = path.join(boardDir, (0, taskFile_1.taskFileName)(taskId));
        const directDoc = (0, taskFile_1.readTaskFile)(directPath);
        if (directDoc && directDoc.task.id === taskId) {
            return directDoc;
        }
    }
    catch {
        // Fall through to full scan for malformed IDs.
    }
    // Slow path: scan all files
    const docs = (0, taskFile_1.readTasksDir)(boardDir);
    return docs.find((d) => d.task.id === taskId) || null;
}
/**
 * Search tasks by query string across title, description, and body.
 *
 * @param boardDir - Absolute path to the tasks directory
 * @param query - Search query (case-insensitive substring match)
 * @returns Array of matching TaskDocument objects
 */
function searchTaskFiles(boardDir, query) {
    const normalizedQuery = query.toLowerCase();
    const docs = (0, taskFile_1.readTasksDir)(boardDir);
    return docs.filter((doc) => {
        const titleMatch = doc.task.title.toLowerCase().includes(normalizedQuery);
        const descMatch = doc.task.description?.toLowerCase().includes(normalizedQuery);
        const bodyMatch = doc.body.toLowerCase().includes(normalizedQuery);
        const tagMatch = doc.task.tags?.some((t) => t.toLowerCase().includes(normalizedQuery));
        return titleMatch || descMatch || bodyMatch || tagMatch;
    });
}
/**
 * Search completed task logs by query string.
 *
 * @param logsDir - Absolute path to the logs directory
 * @param query - Search query (case-insensitive substring match)
 * @returns Array of matching TaskDocument objects
 */
function searchLogs(logsDir, query) {
    return searchTaskFiles(logsDir, query);
}
// ============================================================================
// Compound contract + column operations
// ============================================================================
/**
 * Default mapping from contract status to column ID.
 * Pass `column` option to override per-call, or `false` to skip column sync.
 */
exports.DEFAULT_CONTRACT_COLUMN_MAP = {
    in_progress: 'in-progress',
    delivered: 'review',
    blocked: 'blocked',
};
function resolveColumn(contractStatus, options) {
    if (options?.column === false)
        return undefined;
    if (typeof options?.column === 'string')
        return options.column;
    return exports.DEFAULT_CONTRACT_COLUMN_MAP[contractStatus];
}
function applyPickupMetrics(contract, now) {
    const metrics = { ...(contract.metrics ?? {}) };
    metrics.pickedUpAt = now;
    if (typeof metrics.reworkCount === 'number' && Number.isFinite(metrics.reworkCount)) {
        metrics.reworkCount = Math.max(0, Math.round(metrics.reworkCount)) + 1;
    }
    else {
        metrics.reworkCount = 0;
    }
    contract.metrics = metrics;
}
function applyDeliverMetrics(contract, now) {
    const metrics = { ...(contract.metrics ?? {}) };
    metrics.deliveredAt = now;
    if (typeof metrics.pickedUpAt === 'string') {
        const pickedUpMs = Date.parse(metrics.pickedUpAt);
        const deliveredMs = Date.parse(now);
        if (Number.isFinite(pickedUpMs) && Number.isFinite(deliveredMs)) {
            metrics.duration = Math.max(0, Math.round((deliveredMs - pickedUpMs) / 1000));
        }
    }
    contract.metrics = metrics;
}
/**
 * Pickup a contract: set status to `in_progress`, apply pickup metrics,
 * and move the task column to `in-progress` (default) or a custom column.
 *
 * @param taskPath - Absolute path to the task file
 * @param options - Optional column override or `false` to skip column sync
 */
function pickupTaskContract(taskPath, options) {
    const doc = (0, taskFile_1.readTaskFile)(taskPath);
    if (!doc) {
        return { success: false, error: `Failed to read task file: ${taskPath}` };
    }
    if (!doc.task.contract) {
        return { success: false, error: `Task ${doc.task.id} has no contract` };
    }
    const now = new Date().toISOString();
    const contract = { ...doc.task.contract, status: 'in_progress' };
    applyPickupMetrics(contract, now);
    const targetColumn = resolveColumn('in_progress', options);
    const updatedTask = {
        ...doc.task,
        contract,
        ...(targetColumn !== undefined && { column: targetColumn }),
        updatedAt: now,
    };
    try {
        (0, taskFile_1.writeTaskFile)(taskPath, updatedTask, doc.body);
        return { success: true, task: updatedTask, filePath: taskPath };
    }
    catch (err) {
        return { success: false, error: `Failed to write task file: ${err}` };
    }
}
/**
 * Deliver a contract: set status to `delivered`, apply deliver metrics,
 * and move the task column to `review` (default) or a custom column.
 *
 * @param taskPath - Absolute path to the task file
 * @param options - Optional column override or `false` to skip column sync
 */
function deliverTaskContract(taskPath, options) {
    const doc = (0, taskFile_1.readTaskFile)(taskPath);
    if (!doc) {
        return { success: false, error: `Failed to read task file: ${taskPath}` };
    }
    if (!doc.task.contract) {
        return { success: false, error: `Task ${doc.task.id} has no contract` };
    }
    const now = new Date().toISOString();
    const contract = { ...doc.task.contract, status: 'delivered' };
    applyDeliverMetrics(contract, now);
    const targetColumn = resolveColumn('delivered', options);
    const updatedTask = {
        ...doc.task,
        contract,
        ...(targetColumn !== undefined && { column: targetColumn }),
        updatedAt: now,
    };
    try {
        (0, taskFile_1.writeTaskFile)(taskPath, updatedTask, doc.body);
        return { success: true, task: updatedTask, filePath: taskPath };
    }
    catch (err) {
        return { success: false, error: `Failed to write task file: ${err}` };
    }
}
/**
 * Complete a contract: set status to `done`, then archive the task to logs via
 * `completeTaskFile()`. The task is removed from `board/` and recorded in the ledger.
 *
 * @param taskPath - Absolute path to the task file in board/
 * @param logsDir - Absolute path to the logs directory
 * @param options - Optional completion behavior and ledger details
 */
function completeTaskContract(taskPath, logsDir, options = {}) {
    const doc = (0, taskFile_1.readTaskFile)(taskPath);
    if (!doc) {
        return { success: false, error: `Failed to read task file: ${taskPath}` };
    }
    if (!doc.task.contract) {
        return { success: false, error: `Task ${doc.task.id} has no contract` };
    }
    const now = new Date().toISOString();
    const metrics = { ...(doc.task.contract.metrics ?? {}) };
    if (!metrics.deliveredAt) {
        metrics.deliveredAt = now;
    }
    if (typeof metrics.pickedUpAt === 'string') {
        const pickedUpMs = Date.parse(metrics.pickedUpAt);
        const deliveredMs = Date.parse(metrics.deliveredAt);
        if (Number.isFinite(pickedUpMs) && Number.isFinite(deliveredMs)) {
            metrics.duration = Math.max(0, Math.round((deliveredMs - pickedUpMs) / 1000));
        }
    }
    // Write contract.status = 'done' + metrics before completing,
    // so the archived record captures the final contract state.
    const updatedTask = {
        ...doc.task,
        contract: { ...doc.task.contract, status: 'done', metrics },
        updatedAt: now,
    };
    try {
        (0, taskFile_1.writeTaskFile)(taskPath, updatedTask, doc.body);
    }
    catch (err) {
        return { success: false, error: `Failed to update contract status: ${err}` };
    }
    // Now archive via the standard completion flow (ledger + unlink)
    const { column: _col, ...completeOpts } = options;
    return completeTaskFile(taskPath, logsDir, completeOpts);
}
/**
 * Fail a contract: set status to `failed`, add feedback,
 * and optionally move column to `blocked` or a custom column.
 *
 * @param taskPath - Absolute path to the task file
 * @param feedback - Failure reason / feedback for the agent
 * @param options - Optional column override or `false` to skip column sync
 */
function failTaskContract(taskPath, feedback, options) {
    const doc = (0, taskFile_1.readTaskFile)(taskPath);
    if (!doc) {
        return { success: false, error: `Failed to read task file: ${taskPath}` };
    }
    if (!doc.task.contract) {
        return { success: false, error: `Task ${doc.task.id} has no contract` };
    }
    const now = new Date().toISOString();
    const contract = {
        ...doc.task.contract,
        status: 'failed',
        feedback: feedback.trim() || undefined,
    };
    const targetColumn = resolveColumn('failed', options);
    const updatedTask = {
        ...doc.task,
        contract,
        ...(targetColumn !== undefined && { column: targetColumn }),
        updatedAt: now,
    };
    try {
        (0, taskFile_1.writeTaskFile)(taskPath, updatedTask, doc.body);
        return { success: true, task: updatedTask, filePath: taskPath };
    }
    catch (err) {
        return { success: false, error: `Failed to write task file: ${err}` };
    }
}
/**
 * Returns the most relevant user-facing state for a task.
 * When a contract exists, its status takes priority over the column.
 */
function getEffectiveState(task) {
    if (task.contract)
        return task.contract.status;
    if (task.completedAt)
        return 'completed';
    return task.column ?? 'unknown';
}
//# sourceMappingURL=taskOperations.js.map
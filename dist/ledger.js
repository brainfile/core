"use strict";
/**
 * Ledger utilities for append-only task completion history (`logs/ledger.jsonl`).
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
exports.normalizePathValue = normalizePathValue;
exports.isLedgerContractStatus = isLedgerContractStatus;
exports.buildLedgerRecord = buildLedgerRecord;
exports.appendLedgerRecord = appendLedgerRecord;
exports.readLedger = readLedger;
exports.queryLedger = queryLedger;
exports.getFileHistory = getFileHistory;
exports.getTaskContext = getTaskContext;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const taskFile_1 = require("./taskFile");
const ledger_1 = require("./types/ledger");
const LEDGER_FILE_NAME = 'ledger.jsonl';
const LEGACY_WARNING_TRACKER = new Set();
function getLedgerPath(logsDir) {
    return path.join(logsDir, LEDGER_FILE_NAME);
}
function normalizePathValue(value) {
    return value.replace(/\\/g, '/').replace(/^\.\//, '').trim();
}
function toUniqueStrings(values) {
    if (!values) {
        return [];
    }
    const unique = new Set();
    const result = [];
    for (const value of values) {
        const trimmed = value.trim();
        if (!trimmed || unique.has(trimmed)) {
            continue;
        }
        unique.add(trimmed);
        result.push(trimmed);
    }
    return result;
}
function toUniquePaths(values) {
    if (!values) {
        return [];
    }
    const unique = new Set();
    const result = [];
    for (const value of values) {
        const trimmed = value.trim();
        if (!trimmed) {
            continue;
        }
        const normalized = normalizePathValue(trimmed);
        if (unique.has(normalized)) {
            continue;
        }
        unique.add(normalized);
        result.push(normalized);
    }
    return result;
}
function parseTimestamp(value) {
    if (!value) {
        return null;
    }
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
}
function timestampOr(value, fallback) {
    const parsed = parseTimestamp(value);
    return parsed === null ? fallback : parsed;
}
function matchesDateRange(completedAt, dateRange) {
    if (!dateRange) {
        return true;
    }
    const completedMs = parseTimestamp(completedAt);
    if (completedMs === null) {
        return false;
    }
    const fromMs = dateRange.from ? parseTimestamp(dateRange.from) : null;
    const toMs = dateRange.to ? parseTimestamp(dateRange.to) : null;
    if (fromMs !== null && completedMs < fromMs) {
        return false;
    }
    if (toMs !== null && completedMs > toMs) {
        return false;
    }
    return true;
}
function isLedgerType(value) {
    return value === 'task' || value === 'epic' || value === 'adr';
}
function normalizeLedgerType(task) {
    if (isLedgerType(task.type)) {
        return task.type;
    }
    if (task.id.startsWith('epic-')) {
        return 'epic';
    }
    if (task.id.startsWith('adr-')) {
        return 'adr';
    }
    return 'task';
}
function isLedgerContractStatus(value) {
    return ledger_1.LEDGER_CONTRACT_STATUSES.includes(value);
}
function extractDeliverablePaths(deliverables) {
    if (!deliverables) {
        return [];
    }
    return toUniquePaths(deliverables.map((deliverable) => deliverable.path));
}
function isTaskDocument(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'task' in value &&
        typeof value.task === 'object' &&
        value.task !== null);
}
function normalizeTaskInput(taskOrDocument) {
    if (isTaskDocument(taskOrDocument)) {
        return taskOrDocument.task;
    }
    return taskOrDocument;
}
function deriveSummary(body, fallbackTitle) {
    const lines = body.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }
        return trimmed;
    }
    return `Completed: ${fallbackTitle}`;
}
function defaultFilesChanged(task) {
    const deliverablePaths = extractDeliverablePaths(task.contract?.deliverables);
    if (deliverablePaths.length > 0) {
        return deliverablePaths;
    }
    const relatedFiles = toUniquePaths(task.relatedFiles);
    if (relatedFiles.length > 0) {
        return relatedFiles;
    }
    return [`${task.id}.md`];
}
function computeCycleTimeHours(createdAt, completedAt) {
    const createdMs = parseTimestamp(createdAt);
    const completedMs = parseTimestamp(completedAt);
    if (createdMs === null || completedMs === null) {
        return 0;
    }
    const elapsedHours = (completedMs - createdMs) / (1000 * 60 * 60);
    if (!Number.isFinite(elapsedHours) || elapsedHours < 0) {
        return 0;
    }
    return Number(elapsedHours.toFixed(3));
}
function normalizeValidationAttempts(value) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        return undefined;
    }
    return Math.floor(value);
}
function countSubtasks(task) {
    if (!task.subtasks || !Array.isArray(task.subtasks)) {
        return { total: 0, completed: 0, hasSubtasks: false };
    }
    let completed = 0;
    for (const subtask of task.subtasks) {
        if (subtask.completed) {
            completed += 1;
        }
    }
    return {
        total: task.subtasks.length,
        completed,
        hasSubtasks: true,
    };
}
function normalizeContractStatus(task) {
    const status = task.contract?.status;
    return typeof status === 'string' && isLedgerContractStatus(status) ? status : undefined;
}
function pathMatches(left, right) {
    const normalizedLeft = normalizePathValue(left);
    const normalizedRight = normalizePathValue(right);
    if (!normalizedLeft || !normalizedRight) {
        return false;
    }
    return (normalizedLeft === normalizedRight ||
        normalizedLeft.endsWith(`/${normalizedRight}`) ||
        normalizedRight.endsWith(`/${normalizedLeft}`));
}
function collectRecordFiles(record) {
    return toUniquePaths([
        ...(record.filesChanged || []),
        ...(record.relatedFiles || []),
        ...(record.deliverables || []),
    ]);
}
function collectDeliverableInputPaths(deliverables) {
    if (!deliverables) {
        return [];
    }
    const paths = [];
    for (const deliverable of deliverables) {
        if (typeof deliverable === 'string') {
            paths.push(deliverable);
            continue;
        }
        if (deliverable && typeof deliverable.path === 'string') {
            paths.push(deliverable.path);
        }
    }
    return toUniquePaths(paths);
}
function matchedFilesForScope(scopeFiles, recordFiles) {
    const matched = [];
    for (const scopeFile of scopeFiles) {
        if (recordFiles.some((recordFile) => pathMatches(recordFile, scopeFile))) {
            matched.push(scopeFile);
        }
    }
    return matched;
}
function parseLedgerLine(line, lineNumber, ledgerPath) {
    let parsed;
    try {
        parsed = JSON.parse(line);
    }
    catch (error) {
        console.warn(`[brainfile/core] Failed to parse ledger line ${lineNumber} in ${ledgerPath}: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        console.warn(`[brainfile/core] Ignoring invalid ledger line ${lineNumber} in ${ledgerPath}`);
        return null;
    }
    return parsed;
}
function shouldWarnLegacyFallback(logsDir) {
    const key = path.resolve(logsDir);
    if (LEGACY_WARNING_TRACKER.has(key)) {
        return false;
    }
    LEGACY_WARNING_TRACKER.add(key);
    return true;
}
function readLegacyMarkdownLedger(logsDir) {
    const docs = (0, taskFile_1.readTasksDir)(logsDir);
    if (docs.length === 0) {
        return [];
    }
    if (shouldWarnLegacyFallback(logsDir)) {
        console.warn(`[brainfile/core] ledger.jsonl not found in ${logsDir}; falling back to legacy markdown logs.`);
    }
    return docs.map((doc) => {
        const completedAt = doc.task.completedAt || doc.task.updatedAt || doc.task.createdAt || new Date(0).toISOString();
        return buildLedgerRecord(doc.task, doc.body, { completedAt });
    });
}
/**
 * Build a single ledger record from task metadata + markdown body.
 */
function buildLedgerRecord(taskOrDocument, body, options = {}) {
    const task = normalizeTaskInput(taskOrDocument);
    const completedAt = options.completedAt || task.completedAt || new Date().toISOString();
    const createdAt = task.createdAt || completedAt;
    const filesChanged = toUniquePaths(options.filesChanged);
    const effectiveFilesChanged = filesChanged.length > 0 ? filesChanged : defaultFilesChanged(task);
    const summary = options.summary?.trim() || deriveSummary(body, task.title);
    const deliverables = extractDeliverablePaths(task.contract?.deliverables);
    const tags = toUniqueStrings(task.tags);
    const relatedFiles = toUniquePaths(task.relatedFiles);
    const constraints = toUniqueStrings(task.contract?.constraints);
    const columnHistory = toUniqueStrings(options.columnHistory ?? (task.column ? [task.column] : undefined));
    const contractStatus = normalizeContractStatus(task);
    const validationAttempts = normalizeValidationAttempts(options.validationAttempts ?? task.contract?.metrics?.reworkCount);
    const subtaskCounts = countSubtasks(task);
    const record = {
        id: task.id,
        type: normalizeLedgerType(task),
        title: task.title,
        filesChanged: effectiveFilesChanged,
        createdAt,
        completedAt,
        cycleTimeHours: computeCycleTimeHours(createdAt, completedAt),
        summary,
    };
    if (columnHistory.length > 0) {
        record.columnHistory = columnHistory;
    }
    if (task.assignee) {
        record.assignee = task.assignee;
    }
    if (task.priority) {
        record.priority = task.priority;
    }
    if (tags.length > 0) {
        record.tags = tags;
    }
    if (task.parentId) {
        record.parentId = task.parentId;
    }
    if (relatedFiles.length > 0) {
        record.relatedFiles = relatedFiles;
    }
    if (deliverables.length > 0) {
        record.deliverables = deliverables;
    }
    if (contractStatus) {
        record.contractStatus = contractStatus;
    }
    if (validationAttempts !== undefined) {
        record.validationAttempts = validationAttempts;
    }
    if (constraints.length > 0) {
        record.constraints = constraints;
    }
    if (subtaskCounts.hasSubtasks) {
        record.subtasksCompleted = subtaskCounts.completed;
        record.subtasksTotal = subtaskCounts.total;
    }
    const dependsOn = toUniqueStrings(task.dependsOn);
    if (dependsOn.length > 0) {
        record.dependsOn = dependsOn;
    }
    return record;
}
/**
 * Append a single record to `logs/ledger.jsonl`.
 *
 * @returns Absolute path to the ledger file.
 */
function appendLedgerRecord(logsDir, record) {
    fs.mkdirSync(logsDir, { recursive: true });
    const ledgerPath = getLedgerPath(logsDir);
    fs.appendFileSync(ledgerPath, `${JSON.stringify(record)}\n`, 'utf-8');
    return ledgerPath;
}
/**
 * Read all ledger records.
 *
 * Backward compatibility: if `ledger.jsonl` is missing but legacy markdown logs
 * exist, they are converted on read with a warning.
 */
function readLedger(logsDir) {
    const ledgerPath = getLedgerPath(logsDir);
    if (!fs.existsSync(ledgerPath)) {
        return readLegacyMarkdownLedger(logsDir);
    }
    const content = fs.readFileSync(ledgerPath, 'utf-8');
    const lines = content.split('\n');
    const records = [];
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index].trim();
        if (!line) {
            continue;
        }
        const parsed = parseLedgerLine(line, index + 1, ledgerPath);
        if (parsed) {
            records.push(parsed);
        }
    }
    return records;
}
/**
 * Query ledger records using simple indexed filters.
 */
function queryLedger(logsDir, filters = {}) {
    const all = readLedger(logsDir);
    // Pre-compute filter values once
    const queryTags = filters.tags?.length ? filters.tags.map((t) => t.toLowerCase()) : null;
    const statusSet = filters.contractStatus
        ? new Set(Array.isArray(filters.contractStatus) ? filters.contractStatus : [filters.contractStatus])
        : null;
    const queryFiles = filters.files?.length ? toUniquePaths(filters.files) : null;
    return all.filter((record) => {
        if (filters.assignee && record.assignee !== filters.assignee)
            return false;
        if (queryTags) {
            const tags = (record.tags || []).map((t) => t.toLowerCase());
            if (!queryTags.some((t) => tags.includes(t)))
                return false;
        }
        if (filters.dateRange && !matchesDateRange(record.completedAt, filters.dateRange))
            return false;
        if (statusSet && (!record.contractStatus || !statusSet.has(record.contractStatus)))
            return false;
        if (queryFiles) {
            const recordFiles = collectRecordFiles(record);
            if (!queryFiles.some((qf) => recordFiles.some((rf) => pathMatches(rf, qf))))
                return false;
        }
        return true;
    });
}
/**
 * Get file history from records whose `filesChanged` include the target path.
 */
function getFileHistory(logsDir, filePath, options = {}) {
    const normalizedTarget = normalizePathValue(filePath);
    if (!normalizedTarget) {
        return [];
    }
    let records = readLedger(logsDir).filter((record) => (record.filesChanged || []).some((changedFile) => pathMatches(changedFile, normalizedTarget)));
    if (options.dateRange) {
        records = records.filter((record) => matchesDateRange(record.completedAt, options.dateRange));
    }
    records.sort((a, b) => timestampOr(b.completedAt, 0) - timestampOr(a.completedAt, 0));
    if (options.limit !== undefined && options.limit > 0) {
        return records.slice(0, options.limit);
    }
    return records;
}
/**
 * Build recent task context by intersecting task-scoped files with ledger history.
 */
function getTaskContext(logsDir, relatedFiles, deliverables, options = {}) {
    const scopeFiles = toUniquePaths([
        ...relatedFiles,
        ...collectDeliverableInputPaths(deliverables),
    ]);
    if (scopeFiles.length === 0) {
        return [];
    }
    let entries = readLedger(logsDir)
        .filter((record) => matchesDateRange(record.completedAt, options.dateRange))
        .map((record) => {
        const matchedFiles = matchedFilesForScope(scopeFiles, collectRecordFiles(record));
        return { record, matchedFiles };
    })
        .filter((entry) => entry.matchedFiles.length > 0);
    entries.sort((a, b) => timestampOr(b.record.completedAt, 0) - timestampOr(a.record.completedAt, 0));
    if (options.limit !== undefined && options.limit > 0) {
        entries = entries.slice(0, options.limit);
    }
    return entries;
}
//# sourceMappingURL=ledger.js.map
/**
 * Ledger utilities for append-only task completion history (`logs/ledger.jsonl`).
 * @packageDocumentation
 */
import type { FileHistoryOptions, BuildLedgerRecordOptions, LedgerContractStatus, LedgerQueryFilters, LedgerRecord, Task, TaskContextDeliverable, TaskContextEntry, TaskContextOptions, TaskDocument } from './types';
export declare function normalizePathValue(value: string): string;
export declare function isLedgerContractStatus(value: string | undefined): value is LedgerContractStatus;
/**
 * Build a single ledger record from task metadata + markdown body.
 */
export declare function buildLedgerRecord(taskOrDocument: TaskDocument | Task, body: string, options?: BuildLedgerRecordOptions): LedgerRecord;
/**
 * Append a single record to `logs/ledger.jsonl`.
 *
 * @returns Absolute path to the ledger file.
 */
export declare function appendLedgerRecord(logsDir: string, record: LedgerRecord): string;
/**
 * Read all ledger records.
 *
 * Backward compatibility: if `ledger.jsonl` is missing but legacy markdown logs
 * exist, they are converted on read with a warning.
 */
export declare function readLedger(logsDir: string): LedgerRecord[];
/**
 * Query ledger records using simple indexed filters.
 */
export declare function queryLedger(logsDir: string, filters?: LedgerQueryFilters): LedgerRecord[];
/**
 * Get file history from records whose `filesChanged` include the target path.
 */
export declare function getFileHistory(logsDir: string, filePath: string, options?: FileHistoryOptions): LedgerRecord[];
/**
 * Build recent task context by intersecting task-scoped files with ledger history.
 */
export declare function getTaskContext(logsDir: string, relatedFiles: string[], deliverables?: TaskContextDeliverable[], options?: TaskContextOptions): TaskContextEntry[];
//# sourceMappingURL=ledger.d.ts.map
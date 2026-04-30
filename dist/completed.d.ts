/**
 * Conversion functions for CompletedTaskRef.
 *
 * Provides `taskToCompletedRef()` and `ledgerRecordToCompletedRef()` so
 * consumers can work with a single interface regardless of whether the
 * completed task came from a .md file or from ledger.jsonl.
 *
 * @packageDocumentation
 */
import type { Task } from './types/base';
import type { LedgerRecord } from './types/ledger';
import type { CompletedTaskRef } from './types/completed';
/**
 * Project a full Task (from board .md or log .md) into a CompletedTaskRef.
 */
export declare function taskToCompletedRef(task: Task): CompletedTaskRef;
/**
 * Project a LedgerRecord (from ledger.jsonl) into a CompletedTaskRef.
 */
export declare function ledgerRecordToCompletedRef(record: LedgerRecord): CompletedTaskRef;
//# sourceMappingURL=completed.d.ts.map
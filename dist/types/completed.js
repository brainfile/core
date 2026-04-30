"use strict";
/**
 * CompletedTaskRef — a lightweight reference to a completed task.
 *
 * Both `Task` (from board/log .md files) and `LedgerRecord` (from ledger.jsonl)
 * can be projected into this shape. Downstream consumers (e.g. the supervisor's
 * dependency resolution and upstream summary builder) work against this interface
 * instead of reconstructing fake `Task` objects from ledger records.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=completed.js.map
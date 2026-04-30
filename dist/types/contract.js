"use strict";
/**
 * Contract types for PM-to-agent workflows.
 *
 * Contracts are an OPTIONAL extension on `Task` that provide structured
 * deliverables, validation commands, constraints, and status tracking.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTRACT_STATUSES = void 0;
/**
 * Allowed contract lifecycle statuses.
 */
exports.CONTRACT_STATUSES = {
    DRAFT: 'draft',
    READY: 'ready',
    IN_PROGRESS: 'in_progress',
    DELIVERED: 'delivered',
    DONE: 'done',
    FAILED: 'failed',
    REWORKING: 'reworking',
    BLOCKED: 'blocked',
    CANCELLED: 'cancelled',
};
//# sourceMappingURL=contract.js.map
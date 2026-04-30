/**
 * Contract types for PM-to-agent workflows.
 *
 * Contracts are an OPTIONAL extension on `Task` that provide structured
 * deliverables, validation commands, constraints, and status tracking.
 *
 * @packageDocumentation
 */
/**
 * Allowed contract lifecycle statuses.
 */
export declare const CONTRACT_STATUSES: {
    readonly DRAFT: "draft";
    readonly READY: "ready";
    readonly IN_PROGRESS: "in_progress";
    readonly DELIVERED: "delivered";
    readonly DONE: "done";
    readonly FAILED: "failed";
    readonly REWORKING: "reworking";
    readonly BLOCKED: "blocked";
    readonly CANCELLED: "cancelled";
};
export type ContractStatus = typeof CONTRACT_STATUSES[keyof typeof CONTRACT_STATUSES];
/**
 * Deliverable type. The type system is intentionally open (any string is valid),
 * but common values are provided for convenience.
 */
export type DeliverableType = 'file' | 'test' | 'doc' | 'link' | 'other' | (string & {});
/**
 * A single deliverable required by a contract.
 */
export interface Deliverable {
    /** Deliverable category (e.g. "file", "test") */
    type: DeliverableType;
    /** Path or identifier for the deliverable */
    path: string;
    /** Optional human-readable description */
    description?: string;
}
/**
 * Validation configuration (stored only; execution is out of scope).
 */
export interface ValidationConfig {
    /** Shell commands to run to validate deliverables */
    commands?: string[];
}
/**
 * Additional context for the contract.
 */
export interface ContractContext {
    background?: string;
    relevantFiles?: string[];
    outOfScope?: string[];
}
/**
 * A contract attached to a task.
 */
export interface ContractMetrics {
    pickedUpAt?: string;
    deliveredAt?: string;
    duration?: number;
    reworkCount?: number;
}
export interface Contract {
    status: ContractStatus;
    deliverables?: Deliverable[];
    validation?: ValidationConfig;
    constraints?: string[];
    context?: ContractContext;
    metrics?: ContractMetrics;
    /** Optional agent feedback from failed validation/review loops */
    feedback?: string;
    /** Maximum automatic validation retry attempts before failing */
    maxRetries?: number;
}
//# sourceMappingURL=contract.d.ts.map
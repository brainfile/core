/**
 * Contract operations for PM-to-agent workflows.
 *
 * These are pure board mutation operations, following the same patterns as
 * `operations.ts`: no side effects, no in-place mutation, and returning a
 * `BoardOperationResult`.
 *
 * @packageDocumentation
 */
import type { Board } from './types';
import type { Contract, ContractContext, ContractStatus, Deliverable, ValidationConfig } from './types/contract';
import type { BoardOperationResult } from './operations';
/**
 * Patch input for updating an existing task contract.
 *
 * - `undefined` fields are ignored (no change)
 * - `null` removes the field from the contract
 */
export interface ContractPatch {
    status?: ContractStatus;
    deliverables?: Deliverable[] | null;
    validation?: ValidationConfig | null;
    constraints?: string[] | null;
    context?: ContractContext | null;
}
/**
 * Set (create or replace) the contract on a task.
 */
export declare function setTaskContract(board: Board, taskId: string, contract: Contract): BoardOperationResult;
/**
 * Remove a contract from a task.
 */
export declare function clearTaskContract(board: Board, taskId: string): BoardOperationResult;
/**
 * Update only the contract status.
 */
export declare function setTaskContractStatus(board: Board, taskId: string, status: ContractStatus): BoardOperationResult;
/**
 * Patch a task's existing contract.
 */
export declare function patchTaskContract(board: Board, taskId: string, patch: ContractPatch): BoardOperationResult;
/**
 * Add a deliverable to a task's contract.
 */
export declare function addTaskContractDeliverable(board: Board, taskId: string, deliverable: Deliverable): BoardOperationResult;
/**
 * Remove a deliverable from a task's contract (by path).
 */
export declare function removeTaskContractDeliverable(board: Board, taskId: string, deliverablePath: string): BoardOperationResult;
/**
 * Add a validation command to a task's contract.
 */
export declare function addTaskContractValidationCommand(board: Board, taskId: string, command: string): BoardOperationResult;
/**
 * Remove a validation command from a task's contract.
 */
export declare function removeTaskContractValidationCommand(board: Board, taskId: string, command: string): BoardOperationResult;
/**
 * Add a constraint to a task's contract.
 */
export declare function addTaskContractConstraint(board: Board, taskId: string, constraint: string): BoardOperationResult;
/**
 * Remove a constraint from a task's contract.
 */
export declare function removeTaskContractConstraint(board: Board, taskId: string, constraint: string): BoardOperationResult;
//# sourceMappingURL=contract.d.ts.map
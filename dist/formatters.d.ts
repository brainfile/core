/**
 * Formatters for external service payloads
 *
 * Pure transformation functions that convert Brainfile tasks into
 * payloads suitable for GitHub Issues, Linear, and other services.
 *
 * These functions have no I/O or dependencies - CLI handles the actual API calls.
 *
 * @packageDocumentation
 */
import type { Task } from './types/base';
/**
 * Payload for creating a GitHub Issue
 */
export interface GitHubIssuePayload {
    /** Issue title */
    title: string;
    /** Issue body in markdown */
    body: string;
    /** Labels to apply */
    labels?: string[];
    /** Issue state - archived tasks are created as closed */
    state?: 'open' | 'closed';
}
/**
 * Options for formatting a task for GitHub
 */
export interface GitHubFormatOptions {
    /** Include task metadata (priority, dates, etc.) in body */
    includeMeta?: boolean;
    /** Include subtasks as checklist in body */
    includeSubtasks?: boolean;
    /** Include related files section */
    includeRelatedFiles?: boolean;
    /** Commit SHA or URL that resolved this task */
    resolvedBy?: string;
    /** PR number or URL that resolved this task */
    resolvedByPR?: string;
    /** Column the task was in when archived */
    fromColumn?: string;
    /** Board title for context */
    boardTitle?: string;
    /** Extra labels to add (in addition to tags) */
    extraLabels?: string[];
    /** Prefix for task ID in title (default: true) */
    includeTaskId?: boolean;
}
/**
 * Payload for creating a Linear Issue
 */
export interface LinearIssuePayload {
    /** Issue title */
    title: string;
    /** Issue description in markdown */
    description: string;
    /** Priority (1=urgent, 2=high, 3=normal, 4=low, 0=none) */
    priority?: number;
    /** Label names to apply */
    labelNames?: string[];
    /** State name (e.g., "Done", "Canceled") */
    stateName?: string;
}
/**
 * Options for formatting a task for Linear
 */
export interface LinearFormatOptions {
    /** Include task metadata in description */
    includeMeta?: boolean;
    /** Include subtasks as checklist */
    includeSubtasks?: boolean;
    /** Include related files section */
    includeRelatedFiles?: boolean;
    /** Commit SHA or URL that resolved this task */
    resolvedBy?: string;
    /** PR number or URL that resolved this task */
    resolvedByPR?: string;
    /** Column the task was in when archived */
    fromColumn?: string;
    /** Board title for context */
    boardTitle?: string;
    /** State to set (default: "Done") */
    stateName?: string;
    /** Prefix for task ID in title (default: false for Linear) */
    includeTaskId?: boolean;
}
/**
 * Format a Brainfile task as a GitHub Issue payload
 *
 * @param task - The task to format
 * @param options - Formatting options
 * @returns GitHub Issue payload ready for octokit
 *
 * @example
 * ```typescript
 * const payload = formatTaskForGitHub(task, {
 *   includeMeta: true,
 *   resolvedByPR: '#123'
 * });
 * await octokit.issues.create({ owner, repo, ...payload });
 * ```
 */
export declare function formatTaskForGitHub(task: Task, options?: GitHubFormatOptions): GitHubIssuePayload;
/**
 * Format a Brainfile task as a Linear Issue payload
 *
 * @param task - The task to format
 * @param options - Formatting options
 * @returns Linear Issue payload ready for @linear/sdk
 *
 * @example
 * ```typescript
 * const payload = formatTaskForLinear(task, {
 *   includeMeta: true,
 *   stateName: 'Done'
 * });
 * await linearClient.createIssue({ teamId, ...payload });
 * ```
 */
export declare function formatTaskForLinear(task: Task, options?: LinearFormatOptions): LinearIssuePayload;
//# sourceMappingURL=formatters.d.ts.map
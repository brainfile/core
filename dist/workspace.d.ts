/**
 * V2 workspace detection, path resolution, and body helpers.
 *
 * These helpers provide the directory/layout layer for v2 brainfiles
 * where config lives in `.brainfile/brainfile.md` and tasks live in
 * `.brainfile/board/` and `.brainfile/logs/`.
 *
 * @packageDocumentation
 */
import type { Board, TaskDocument } from './types';
export interface V2Dirs {
    dotDir: string;
    boardDir: string;
    logsDir: string;
    brainfilePath: string;
}
/**
 * Get the v2 directory structure paths from a brainfile path.
 */
export declare function getV2Dirs(brainfilePath: string): V2Dirs;
/**
 * Check if a brainfile is using v2 per-task file architecture.
 * V2 is detected by the presence of a board/ directory in .brainfile/.
 */
export declare function isV2(brainfilePath: string): boolean;
/**
 * Ensure the v2 directory structure exists.
 */
export declare function ensureV2Dirs(brainfilePath: string): V2Dirs;
/**
 * Get the file path for a task in the board/ directory.
 */
export declare function getTaskFilePath(boardDir: string, taskId: string): string;
/**
 * Get the file path for a completed task in the logs/ directory.
 */
export declare function getLogFilePath(logsDir: string, taskId: string): string;
/**
 * Find a task by ID across active tasks and optionally logs.
 * Returns the TaskDocument, its file path, and whether it's in logs.
 */
export declare function findV2Task(dirs: V2Dirs, taskId: string, searchLogs?: boolean): {
    doc: TaskDocument;
    filePath: string;
    isLog: boolean;
} | null;
/**
 * Extract the description section from a task document body.
 */
export declare function extractDescription(body: string): string | undefined;
/**
 * Extract the log section from a task document body.
 */
export declare function extractLog(body: string): string | undefined;
/**
 * Compose a markdown body from separate description and log sections.
 */
export declare function composeBody(description?: string, log?: string): string;
/**
 * Read the v2 board config (config-only brainfile without embedded tasks).
 */
export declare function readV2BoardConfig(brainfilePath: string): Board;
/**
 * Build a full v1-compatible Board from v2 per-task files.
 * Reads the board config and populates column tasks from the board/ directory.
 */
export declare function buildBoardFromV2(brainfilePath: string): Board;
//# sourceMappingURL=workspace.d.ts.map
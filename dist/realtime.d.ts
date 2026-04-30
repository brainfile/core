import { Board } from './types';
export { diffBoards } from './realtimeDiff';
export type { BoardDiff, ColumnDiff, TaskDiff } from './realtimeDiff';
/**
  * Generate a stable hash for raw Brainfile content.
  * Uses SHA-256 for collision resistance and cross-process consistency.
  */
export declare function hashBoardContent(content: string): string;
/**
  * Generate a stable hash for a Board by serializing with BrainfileSerializer.
  */
export declare function hashBoard(board: Board): string;
//# sourceMappingURL=realtime.d.ts.map
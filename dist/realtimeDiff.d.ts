import { Board, Column, Task } from './types';
export interface ColumnDiff {
    columnId: string;
    before?: Column;
    after?: Column;
    fromIndex?: number;
    toIndex?: number;
    changedFields?: string[];
}
export interface TaskDiff {
    taskId: string;
    before?: Task;
    after?: Task;
    fromColumnId?: string;
    toColumnId?: string;
    fromIndex?: number;
    toIndex?: number;
    changedFields?: string[];
}
export interface BoardDiff {
    metadataChanged: boolean;
    columnsAdded: ColumnDiff[];
    columnsRemoved: ColumnDiff[];
    columnsUpdated: ColumnDiff[];
    columnsMoved: ColumnDiff[];
    tasksAdded: TaskDiff[];
    tasksRemoved: TaskDiff[];
    tasksUpdated: TaskDiff[];
    tasksMoved: TaskDiff[];
}
/**
  * Compute a structural diff between two Board objects.
  */
export declare function diffBoards(previous: Board, next: Board): BoardDiff;
//# sourceMappingURL=realtimeDiff.d.ts.map
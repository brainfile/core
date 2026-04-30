import type { BoardConfig, TypesConfig } from "./types";
export interface BoardValidationResult {
    valid: boolean;
    error?: string;
}
/**
 * Returns the board's type configuration map, or an empty map when absent.
 */
export declare function getBoardTypes(board: BoardConfig): TypesConfig;
/**
 * Validates a type name against board config strict mode.
 */
export declare function validateType(board: BoardConfig, typeName: string): BoardValidationResult;
/**
 * Validates a column ID against board config strict mode.
 */
export declare function validateColumn(board: BoardConfig, columnId: string): BoardValidationResult;
//# sourceMappingURL=boardValidation.d.ts.map
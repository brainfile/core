/**
 * Validator for Brainfile Board objects
 * @packageDocumentation
 */
export interface ValidationError {
    path: string;
    message: string;
}
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}
export declare class BrainfileValidator {
    /**
     * Validate a Board object
     * @param board - The board to validate
     * @returns ValidationResult with any errors found
     */
    static validate(board: any): ValidationResult;
    /**
     * Validate a Column object
     * @param column - The column to validate
     * @param path - The path for error reporting
     * @returns Array of validation errors
     */
    static validateColumn(column: any, path: string): ValidationError[];
    /**
     * Validate a Task object
     * @param task - The task to validate
     * @param path - The path for error reporting
     * @returns Array of validation errors
     */
    static validateTask(task: any, path: string): ValidationError[];
    /**
     * Validate a Subtask object
     * @param subtask - The subtask to validate
     * @param path - The path for error reporting
     * @returns Array of validation errors
     */
    static validateSubtask(subtask: any, path: string): ValidationError[];
    /**
     * Validate Rules object
     * @param rules - The rules to validate
     * @param path - The path for error reporting
     * @returns Array of validation errors
     */
    static validateRules(rules: any, path: string): ValidationError[];
    /**
     * Validate a Rule object
     * @param rule - The rule to validate
     * @param path - The path for error reporting
     * @returns Array of validation errors
     */
    static validateRule(rule: any, path: string): ValidationError[];
}
//# sourceMappingURL=validator.d.ts.map
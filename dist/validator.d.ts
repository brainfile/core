/**
 * Validator for Brainfile objects (all types)
 * @packageDocumentation
 */
export interface ValidationError {
    path: string;
    message: string;
}
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    type?: string;
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
    /**
     * Validate any brainfile object with type detection
     * @param data - The brainfile data to validate
     * @param filename - Optional filename for type inference
     * @returns ValidationResult with type and any errors found
     */
    static validateBrainfile(data: any, filename?: string): ValidationResult;
    /**
     * Validate a Journal object
     * @param journal - The journal to validate
     * @returns ValidationResult with any errors found
     */
    static validateJournal(journal: any): ValidationResult;
    /**
     * Validate a JournalEntry object
     * @param entry - The entry to validate
     * @param path - The path for error reporting
     * @returns Array of validation errors
     */
    static validateJournalEntry(entry: any, path: string): ValidationError[];
}
//# sourceMappingURL=validator.d.ts.map
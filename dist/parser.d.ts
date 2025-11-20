/**
 * Parser for Brainfile markdown files with YAML frontmatter
 * @packageDocumentation
 */
import { Board } from "./types";
export interface ParseResult {
    board: Board | null;
    error?: string;
}
export declare class BrainfileParser {
    /**
     * Parse a brainfile.md file content into a Board object
     * @param content - The markdown content with YAML frontmatter
     * @returns Parsed Board object or null if parsing fails
     */
    static parse(content: string): Board | null;
    /**
     * Parse with detailed error reporting
     * @param content - The markdown content with YAML frontmatter
     * @returns ParseResult with board or error message
     */
    static parseWithErrors(content: string): ParseResult;
    /**
     * Find the line number of a task in the file
     * @param content - The markdown content
     * @param taskId - The task ID to find
     * @returns Line and column location or null if not found
     */
    static findTaskLocation(content: string, taskId: string): {
        line: number;
        column: number;
    } | null;
    /**
     * Find the line number of a rule in the YAML frontmatter
     * @param content - The markdown content
     * @param ruleId - The rule ID to find
     * @param ruleType - The type of rule (always, never, prefer, context)
     * @returns Line and column location or null if not found
     */
    static findRuleLocation(content: string, ruleId: number, ruleType: "always" | "never" | "prefer" | "context"): {
        line: number;
        column: number;
    } | null;
}
//# sourceMappingURL=parser.d.ts.map
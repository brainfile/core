/**
 * Parser for Brainfile markdown files with YAML frontmatter
 * @packageDocumentation
 */
import { Board, Brainfile, RendererType } from "./types";
import { SchemaHints } from "./inference";
export interface ParseResult {
    /** Parsed brainfile data (type depends on detected type) */
    data: Brainfile | null;
    /** Detected brainfile type */
    type?: string;
    /** Inferred renderer type */
    renderer?: RendererType;
    /** Legacy board accessor (deprecated, use data instead) */
    board?: Board | null;
    /** Error message if parsing failed */
    error?: string;
    /** Warning messages from parser */
    warnings?: string[];
}
export declare class BrainfileParser {
    /**
     * Consolidate duplicate columns by merging their tasks
     * @param columns - Array of columns that may contain duplicates
     * @returns Deduplicated array of columns with merged tasks
     */
    private static consolidateDuplicateColumns;
    /**
     * Parse a brainfile.md file content
     * @param content - The markdown content with YAML frontmatter
     * @returns Parsed brainfile data or null if parsing fails
     * @deprecated Use parseWithErrors() for type detection and error details
     */
    static parse(content: string): any | null;
    /**
     * Parse with detailed error reporting, warnings, and type detection
     * @param content - The markdown content with YAML frontmatter
     * @param filename - Optional filename for type inference
     * @param schemaHints - Optional schema hints for renderer inference
     * @returns ParseResult with data, type, renderer, error message, and any warnings
     */
    static parseWithErrors(content: string, filename?: string, schemaHints?: SchemaHints): ParseResult;
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
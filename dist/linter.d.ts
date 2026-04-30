/**
 * Linter for Brainfile markdown files with YAML frontmatter
 * @packageDocumentation
 */
import { Board } from "./types";
export interface LintIssue {
    type: "error" | "warning";
    message: string;
    line?: number;
    column?: number;
    fixable?: boolean;
    code?: string;
}
export interface LintResult {
    valid: boolean;
    issues: LintIssue[];
    fixedContent?: string;
    board?: Board;
}
export interface LintOptions {
    autoFix?: boolean;
    strictMode?: boolean;
}
export declare class BrainfileLinter {
    /**
     * Lint a brainfile.md content string
     * @param content - The markdown content with YAML frontmatter
     * @param options - Linting options
     * @returns LintResult with issues and optionally fixed content
     */
    static lint(content: string, options?: LintOptions): LintResult;
    /**
     * Check YAML syntax by attempting to parse
     */
    private static checkYAMLSyntax;
    /**
     * Find strings with colons that should be quoted
     */
    private static findUnquotedStringsWithColons;
    /**
     * Fix unquoted strings by adding quotes
     */
    private static fixUnquotedStrings;
    /**
     * Get a human-readable summary of lint results
     */
    static getSummary(result: LintResult): string;
    /**
     * Get issues grouped by type
     */
    static groupIssues(result: LintResult): {
        errors: LintIssue[];
        warnings: LintIssue[];
        fixable: LintIssue[];
    };
}
//# sourceMappingURL=linter.d.ts.map
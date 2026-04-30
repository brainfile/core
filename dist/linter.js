"use strict";
/**
 * Linter for Brainfile markdown files with YAML frontmatter
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrainfileLinter = void 0;
const yaml = __importStar(require("js-yaml"));
const parser_1 = require("./parser");
const validator_1 = require("./validator");
class BrainfileLinter {
    /**
     * Lint a brainfile.md content string
     * @param content - The markdown content with YAML frontmatter
     * @param options - Linting options
     * @returns LintResult with issues and optionally fixed content
     */
    static lint(content, options = {}) {
        const issues = [];
        let fixedContent = content;
        let board = null;
        // Step 1: Check for fixable YAML issues (unquoted strings with colons)
        const quotableStrings = this.findUnquotedStringsWithColons(content);
        if (quotableStrings.length > 0) {
            quotableStrings.forEach(({ line, text }) => {
                issues.push({
                    type: "warning",
                    message: `Unquoted string with colon: "${text}"`,
                    line,
                    fixable: true,
                    code: "UNQUOTED_STRING"
                });
            });
            if (options.autoFix) {
                fixedContent = this.fixUnquotedStrings(content, quotableStrings);
            }
        }
        // Step 2: Check YAML syntax
        const contentToValidate = options.autoFix && fixedContent !== content ? fixedContent : content;
        const yamlIssues = this.checkYAMLSyntax(contentToValidate);
        // If we applied fixes, check if the issues still exist
        if (options.autoFix && fixedContent !== content) {
            const remainingYamlIssues = this.checkYAMLSyntax(fixedContent);
            issues.push(...remainingYamlIssues);
        }
        else {
            issues.push(...yamlIssues);
        }
        // Step 3: Validate board structure (if YAML is valid)
        const finalYamlIssues = options.autoFix ? this.checkYAMLSyntax(fixedContent) : yamlIssues;
        if (finalYamlIssues.length === 0) {
            const result = parser_1.BrainfileParser.parseWithErrors(options.autoFix ? fixedContent : content);
            if (result.board) {
                board = result.board;
                // Check for duplicate column IDs (informational - already handled by parser)
                if (result.warnings && result.warnings.length > 0) {
                    result.warnings.forEach(warning => {
                        // Match both the header and individual warnings
                        if (warning.includes("Duplicate column")) {
                            // Skip the header line, only process actual duplicate messages
                            if (!warning.includes("Duplicate columns detected:")) {
                                const cleanMessage = warning
                                    .replace("[Brainfile Parser]", "")
                                    .replace(/^\s*-\s*/, "")
                                    .trim();
                                if (cleanMessage) {
                                    issues.push({
                                        type: "warning",
                                        message: cleanMessage,
                                        fixable: false,
                                        code: "DUPLICATE_COLUMN"
                                    });
                                }
                            }
                        }
                    });
                }
                // Run structural validation
                const validation = validator_1.BrainfileValidator.validate(result.board);
                if (!validation.valid) {
                    validation.errors.forEach(err => {
                        issues.push({
                            type: "error",
                            message: `${err.path}: ${err.message}`,
                            fixable: false,
                            code: "VALIDATION_ERROR"
                        });
                    });
                }
            }
            else if (result.error) {
                issues.push({
                    type: "error",
                    message: `Parse error: ${result.error}`,
                    fixable: false,
                    code: "PARSE_ERROR"
                });
            }
        }
        // Determine if valid (no errors, or only warnings in non-strict mode)
        const hasErrors = issues.some(i => i.type === "error");
        const hasWarnings = issues.some(i => i.type === "warning");
        const valid = options.strictMode ? !hasErrors && !hasWarnings : !hasErrors;
        return {
            valid,
            issues,
            fixedContent: options.autoFix && fixedContent !== content ? fixedContent : undefined,
            board: board || undefined
        };
    }
    /**
     * Check YAML syntax by attempting to parse
     */
    static checkYAMLSyntax(content) {
        const issues = [];
        try {
            const lines = content.split("\n");
            // Find frontmatter boundaries
            if (!lines[0].trim().startsWith("---")) {
                issues.push({
                    type: "error",
                    message: "Missing YAML frontmatter opening (---)",
                    line: 1,
                    fixable: false,
                    code: "MISSING_FRONTMATTER_START"
                });
                return issues;
            }
            let endIndex = -1;
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === "---") {
                    endIndex = i;
                    break;
                }
            }
            if (endIndex === -1) {
                issues.push({
                    type: "error",
                    message: "Missing YAML frontmatter closing (---)",
                    fixable: false,
                    code: "MISSING_FRONTMATTER_END"
                });
                return issues;
            }
            // Extract and parse YAML
            const yamlContent = lines.slice(1, endIndex).join("\n");
            yaml.load(yamlContent);
        }
        catch (error) {
            if (error.mark) {
                issues.push({
                    type: "error",
                    message: `YAML syntax error: ${error.reason || error.message}`,
                    line: error.mark.line + 2, // Adjust for frontmatter offset
                    column: error.mark.column,
                    fixable: false,
                    code: "YAML_SYNTAX_ERROR"
                });
            }
            else {
                issues.push({
                    type: "error",
                    message: `YAML error: ${error.message}`,
                    fixable: false,
                    code: "YAML_ERROR"
                });
            }
        }
        return issues;
    }
    /**
     * Find strings with colons that should be quoted
     */
    static findUnquotedStringsWithColons(content) {
        const results = [];
        const lines = content.split("\n");
        // Look for title: or rule: fields with unquoted strings containing colons
        const titlePattern = /^(\s+)(title|rule|description):\s+([^"'][^"\n]*:\s*[^"\n]+)$/;
        lines.forEach((line, index) => {
            const match = line.match(titlePattern);
            if (match) {
                const text = match[3].trim();
                // Check if it contains a colon followed by space (YAML separator)
                if (text.includes(": ")) {
                    results.push({
                        line: index + 1,
                        text,
                        fullLine: line
                    });
                }
            }
        });
        return results;
    }
    /**
     * Fix unquoted strings by adding quotes
     */
    static fixUnquotedStrings(content, issues) {
        const lines = content.split("\n");
        issues.forEach(issue => {
            const lineIndex = issue.line - 1;
            const line = lines[lineIndex];
            // Match the pattern and replace with quoted version
            const match = line.match(/^(\s+)(title|rule|description):\s+(.+)$/);
            if (match) {
                const indent = match[1];
                const key = match[2];
                const value = match[3].trim();
                // Only quote if not already quoted
                if (!value.startsWith('"') && !value.startsWith("'")) {
                    lines[lineIndex] = `${indent}${key}: "${value}"`;
                }
            }
        });
        return lines.join("\n");
    }
    /**
     * Get a human-readable summary of lint results
     */
    static getSummary(result) {
        if (result.valid && result.issues.length === 0) {
            return "✓ No issues found";
        }
        const errors = result.issues.filter(i => i.type === "error");
        const warnings = result.issues.filter(i => i.type === "warning");
        const fixable = result.issues.filter(i => i.fixable);
        const parts = [];
        if (errors.length > 0) {
            parts.push(`${errors.length} error${errors.length > 1 ? "s" : ""}`);
        }
        if (warnings.length > 0) {
            parts.push(`${warnings.length} warning${warnings.length > 1 ? "s" : ""}`);
        }
        if (fixable.length > 0) {
            parts.push(`${fixable.length} fixable`);
        }
        return parts.join(", ");
    }
    /**
     * Get issues grouped by type
     */
    static groupIssues(result) {
        return {
            errors: result.issues.filter(i => i.type === "error"),
            warnings: result.issues.filter(i => i.type === "warning"),
            fixable: result.issues.filter(i => i.fixable)
        };
    }
}
exports.BrainfileLinter = BrainfileLinter;
//# sourceMappingURL=linter.js.map
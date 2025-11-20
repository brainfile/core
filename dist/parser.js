"use strict";
/**
 * Parser for Brainfile markdown files with YAML frontmatter
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
exports.BrainfileParser = void 0;
const yaml = __importStar(require("js-yaml"));
class BrainfileParser {
    /**
     * Parse a brainfile.md file content into a Board object
     * @param content - The markdown content with YAML frontmatter
     * @returns Parsed Board object or null if parsing fails
     */
    static parse(content) {
        try {
            // Extract YAML frontmatter
            const lines = content.split("\n");
            // Check for frontmatter start
            if (!lines[0].trim().startsWith("---")) {
                return null;
            }
            // Find frontmatter end
            let endIndex = -1;
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === "---") {
                    endIndex = i;
                    break;
                }
            }
            if (endIndex === -1) {
                return null;
            }
            // Extract YAML content
            const yamlContent = lines.slice(1, endIndex).join("\n");
            // Parse YAML
            const board = yaml.load(yamlContent);
            return board;
        }
        catch (error) {
            console.error("Error parsing brainfile.md:", error);
            return null;
        }
    }
    /**
     * Parse with detailed error reporting
     * @param content - The markdown content with YAML frontmatter
     * @returns ParseResult with board or error message
     */
    static parseWithErrors(content) {
        try {
            const board = this.parse(content);
            if (!board) {
                return {
                    board: null,
                    error: "Failed to parse YAML frontmatter"
                };
            }
            return { board };
        }
        catch (error) {
            return {
                board: null,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }
    /**
     * Find the line number of a task in the file
     * @param content - The markdown content
     * @param taskId - The task ID to find
     * @returns Line and column location or null if not found
     */
    static findTaskLocation(content, taskId) {
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            // Look for lines that contain the task ID
            if (lines[i].includes(`id: ${taskId}`)) {
                // Check if this line starts with a dash followed by id (standard format: - id: task-N)
                if (lines[i].match(/^\s*-\s+id:\s+/)) {
                    return { line: i + 1, column: 0 }; // +1 because editors are typically 1-indexed
                }
                // Check if the id is on the next line after a dash (alternative format)
                if (i > 0 && lines[i - 1].match(/^\s*-\s*$/)) {
                    return { line: i, column: 0 }; // Return the dash line
                }
                // Default to the line with the id
                return { line: i + 1, column: 0 };
            }
        }
        return null;
    }
    /**
     * Find the line number of a rule in the YAML frontmatter
     * @param content - The markdown content
     * @param ruleId - The rule ID to find
     * @param ruleType - The type of rule (always, never, prefer, context)
     * @returns Line and column location or null if not found
     */
    static findRuleLocation(content, ruleId, ruleType) {
        const lines = content.split("\n");
        let inFrontmatter = false;
        let inRulesSection = false;
        let inRuleTypeSection = false;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            // Check for frontmatter boundaries
            if (trimmedLine === "---") {
                if (!inFrontmatter) {
                    inFrontmatter = true;
                    continue;
                }
                else {
                    // End of frontmatter
                    break;
                }
            }
            if (!inFrontmatter)
                continue;
            // Check if we're in the rules section
            if (trimmedLine === "rules:") {
                inRulesSection = true;
                continue;
            }
            // Check if we're in the specific rule type section
            if (inRulesSection && trimmedLine === `${ruleType}:`) {
                inRuleTypeSection = true;
                continue;
            }
            // If we hit another top-level key, we've left the rules section
            if (inRulesSection && line.match(/^[a-z]+:/) && !line.match(/^\s/)) {
                inRulesSection = false;
                inRuleTypeSection = false;
            }
            // If we're in the rule type section, look for the rule with the matching ID
            if (inRuleTypeSection) {
                // Check if this is a new rule type section within rules
                if (line.match(/^\s{2}[a-z]+:/) && !line.includes(`${ruleType}:`)) {
                    inRuleTypeSection = false;
                    continue;
                }
                // Look for the rule ID
                if (line.includes(`id: ${ruleId}`)) {
                    // Check if this line starts with a dash followed by id (compact format: - id: N)
                    if (line.match(/^\s*-\s+id:\s+/)) {
                        return { line: i + 1, column: 0 }; // +1 because editors are typically 1-indexed
                    }
                    // Check if the id is on the next line after a dash (expanded format)
                    if (i > 0 && lines[i - 1].match(/^\s*-\s*$/)) {
                        return { line: i, column: 0 }; // Return the dash line
                    }
                    // Default to the line with the id
                    return { line: i + 1, column: 0 };
                }
            }
        }
        return null;
    }
}
exports.BrainfileParser = BrainfileParser;
//# sourceMappingURL=parser.js.map
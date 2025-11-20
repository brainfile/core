"use strict";
/**
 * @brainfile/core - Core library for the Brainfile task management protocol
 *
 * This library provides parsing, serialization, validation, and template management
 * for Brainfile markdown files with YAML frontmatter.
 *
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brainfile = exports.getAllTemplateIds = exports.getTemplateById = exports.processTemplate = exports.generateSubtaskId = exports.generateTaskId = exports.BUILT_IN_TEMPLATES = exports.BrainfileValidator = exports.BrainfileSerializer = exports.BrainfileParser = void 0;
// Export types
__exportStar(require("./types"), exports);
// Export parser
var parser_1 = require("./parser");
Object.defineProperty(exports, "BrainfileParser", { enumerable: true, get: function () { return parser_1.BrainfileParser; } });
// Export serializer
var serializer_1 = require("./serializer");
Object.defineProperty(exports, "BrainfileSerializer", { enumerable: true, get: function () { return serializer_1.BrainfileSerializer; } });
// Export validator
var validator_1 = require("./validator");
Object.defineProperty(exports, "BrainfileValidator", { enumerable: true, get: function () { return validator_1.BrainfileValidator; } });
// Export templates
var templates_1 = require("./templates");
Object.defineProperty(exports, "BUILT_IN_TEMPLATES", { enumerable: true, get: function () { return templates_1.BUILT_IN_TEMPLATES; } });
Object.defineProperty(exports, "generateTaskId", { enumerable: true, get: function () { return templates_1.generateTaskId; } });
Object.defineProperty(exports, "generateSubtaskId", { enumerable: true, get: function () { return templates_1.generateSubtaskId; } });
Object.defineProperty(exports, "processTemplate", { enumerable: true, get: function () { return templates_1.processTemplate; } });
Object.defineProperty(exports, "getTemplateById", { enumerable: true, get: function () { return templates_1.getTemplateById; } });
Object.defineProperty(exports, "getAllTemplateIds", { enumerable: true, get: function () { return templates_1.getAllTemplateIds; } });
/**
 * Main Brainfile class providing a high-level API
 */
class Brainfile {
    /**
     * Parse a brainfile.md file content
     * @param content - The markdown content with YAML frontmatter
     * @returns Parsed Board object or null if parsing fails
     */
    static parse(content) {
        return parser_2.BrainfileParser.parse(content);
    }
    /**
     * Parse with detailed error reporting
     * @param content - The markdown content with YAML frontmatter
     * @returns ParseResult with board or error message
     */
    static parseWithErrors(content) {
        return parser_2.BrainfileParser.parseWithErrors(content);
    }
    /**
     * Serialize a Board object back to brainfile.md format
     * @param board - The Board object to serialize
     * @param options - Optional serialization options
     * @returns Markdown string with YAML frontmatter
     */
    static serialize(board, options) {
        return serializer_2.BrainfileSerializer.serialize(board, options);
    }
    /**
     * Validate a Board object
     * @param board - The board to validate
     * @returns ValidationResult with any errors found
     */
    static validate(board) {
        return validator_2.BrainfileValidator.validate(board);
    }
    /**
     * Get all built-in templates
     * @returns Array of built-in templates
     */
    static getBuiltInTemplates() {
        return templates_2.BUILT_IN_TEMPLATES;
    }
    /**
     * Get a template by ID
     * @param id - The template ID
     * @returns The template or undefined if not found
     */
    static getTemplate(id) {
        return (0, templates_2.getTemplateById)(id);
    }
    /**
     * Create a task from a template
     * @param templateId - The template ID
     * @param values - Variable values to substitute
     * @returns A partial Task object
     */
    static createFromTemplate(templateId, values) {
        const template = (0, templates_2.getTemplateById)(templateId);
        if (!template) {
            throw new Error(`Template not found: ${templateId}`);
        }
        return (0, templates_2.processTemplate)(template, values);
    }
    /**
     * Find the location of a task in the file content
     * @param content - The markdown content
     * @param taskId - The task ID to find
     * @returns Line and column location or null if not found
     */
    static findTaskLocation(content, taskId) {
        return parser_2.BrainfileParser.findTaskLocation(content, taskId);
    }
    /**
     * Find the location of a rule in the file content
     * @param content - The markdown content
     * @param ruleId - The rule ID to find
     * @param ruleType - The type of rule
     * @returns Line and column location or null if not found
     */
    static findRuleLocation(content, ruleId, ruleType) {
        return parser_2.BrainfileParser.findRuleLocation(content, ruleId, ruleType);
    }
}
exports.Brainfile = Brainfile;
const parser_2 = require("./parser");
const serializer_2 = require("./serializer");
const validator_2 = require("./validator");
const templates_2 = require("./templates");
//# sourceMappingURL=index.js.map
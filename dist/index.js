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
exports.getOverdueTasks = exports.getTasksWithIncompleteSubtasks = exports.columnExists = exports.getTotalTaskCount = exports.getColumnTaskCount = exports.searchTasks = exports.getTasksByAssignee = exports.getTasksByPriority = exports.getTasksByTag = exports.getAllTasks = exports.taskIdExists = exports.findTaskById = exports.findColumnByName = exports.findColumnById = exports.archiveTasks = exports.deleteTasks = exports.patchTasks = exports.moveTasks = exports.setAllSubtasksCompleted = exports.setSubtasksCompleted = exports.updateSubtask = exports.deleteSubtask = exports.addSubtask = exports.patchTask = exports.restoreTask = exports.archiveTask = exports.updateStatsConfig = exports.updateBoardTitle = exports.toggleSubtask = exports.deleteTask = exports.updateTask = exports.addTask = exports.moveTask = exports.getAllTemplateIds = exports.getTemplateById = exports.processTemplate = exports.generateSubtaskId = exports.generateTaskId = exports.BUILT_IN_TEMPLATES = exports.hashBoardContent = exports.hashBoard = exports.diffBoards = exports.BrainfileLinter = exports.BrainfileValidator = exports.BrainfileSerializer = exports.loadSchemaHints = exports.parseSchemaHints = exports.inferRenderer = exports.inferType = exports.BrainfileParser = void 0;
exports.Brainfile = exports.EXCLUDE_DIRS = exports.BRAINFILE_GLOBS = exports.BRAINFILE_PATTERNS = exports.extractBrainfileSuffix = exports.isBrainfileName = exports.watchBrainfiles = exports.findPrimaryBrainfile = exports.discover = exports.getParentTaskId = exports.isValidSubtaskId = exports.isValidTaskId = exports.generateNextSubtaskId = exports.generateSubtaskIdFromIndex = exports.generateNextTaskId = exports.getMaxTaskIdNumber = exports.extractTaskIdNumber = void 0;
// Export types
__exportStar(require("./types"), exports);
// Export parser
var parser_1 = require("./parser");
Object.defineProperty(exports, "BrainfileParser", { enumerable: true, get: function () { return parser_1.BrainfileParser; } });
// Export inference functions
var inference_1 = require("./inference");
Object.defineProperty(exports, "inferType", { enumerable: true, get: function () { return inference_1.inferType; } });
Object.defineProperty(exports, "inferRenderer", { enumerable: true, get: function () { return inference_1.inferRenderer; } });
// Export schema hints parser
var schemaHints_1 = require("./schemaHints");
Object.defineProperty(exports, "parseSchemaHints", { enumerable: true, get: function () { return schemaHints_1.parseSchemaHints; } });
Object.defineProperty(exports, "loadSchemaHints", { enumerable: true, get: function () { return schemaHints_1.loadSchemaHints; } });
// Export serializer
var serializer_1 = require("./serializer");
Object.defineProperty(exports, "BrainfileSerializer", { enumerable: true, get: function () { return serializer_1.BrainfileSerializer; } });
// Export validator
var validator_1 = require("./validator");
Object.defineProperty(exports, "BrainfileValidator", { enumerable: true, get: function () { return validator_1.BrainfileValidator; } });
// Export linter
var linter_1 = require("./linter");
Object.defineProperty(exports, "BrainfileLinter", { enumerable: true, get: function () { return linter_1.BrainfileLinter; } });
// Export realtime helpers
var realtime_1 = require("./realtime");
Object.defineProperty(exports, "diffBoards", { enumerable: true, get: function () { return realtime_1.diffBoards; } });
Object.defineProperty(exports, "hashBoard", { enumerable: true, get: function () { return realtime_1.hashBoard; } });
Object.defineProperty(exports, "hashBoardContent", { enumerable: true, get: function () { return realtime_1.hashBoardContent; } });
// Export templates
var templates_1 = require("./templates");
Object.defineProperty(exports, "BUILT_IN_TEMPLATES", { enumerable: true, get: function () { return templates_1.BUILT_IN_TEMPLATES; } });
Object.defineProperty(exports, "generateTaskId", { enumerable: true, get: function () { return templates_1.generateTaskId; } });
Object.defineProperty(exports, "generateSubtaskId", { enumerable: true, get: function () { return templates_1.generateSubtaskId; } });
Object.defineProperty(exports, "processTemplate", { enumerable: true, get: function () { return templates_1.processTemplate; } });
Object.defineProperty(exports, "getTemplateById", { enumerable: true, get: function () { return templates_1.getTemplateById; } });
Object.defineProperty(exports, "getAllTemplateIds", { enumerable: true, get: function () { return templates_1.getAllTemplateIds; } });
// Export board operations
var operations_1 = require("./operations");
Object.defineProperty(exports, "moveTask", { enumerable: true, get: function () { return operations_1.moveTask; } });
Object.defineProperty(exports, "addTask", { enumerable: true, get: function () { return operations_1.addTask; } });
Object.defineProperty(exports, "updateTask", { enumerable: true, get: function () { return operations_1.updateTask; } });
Object.defineProperty(exports, "deleteTask", { enumerable: true, get: function () { return operations_1.deleteTask; } });
Object.defineProperty(exports, "toggleSubtask", { enumerable: true, get: function () { return operations_1.toggleSubtask; } });
Object.defineProperty(exports, "updateBoardTitle", { enumerable: true, get: function () { return operations_1.updateBoardTitle; } });
Object.defineProperty(exports, "updateStatsConfig", { enumerable: true, get: function () { return operations_1.updateStatsConfig; } });
Object.defineProperty(exports, "archiveTask", { enumerable: true, get: function () { return operations_1.archiveTask; } });
Object.defineProperty(exports, "restoreTask", { enumerable: true, get: function () { return operations_1.restoreTask; } });
Object.defineProperty(exports, "patchTask", { enumerable: true, get: function () { return operations_1.patchTask; } });
Object.defineProperty(exports, "addSubtask", { enumerable: true, get: function () { return operations_1.addSubtask; } });
Object.defineProperty(exports, "deleteSubtask", { enumerable: true, get: function () { return operations_1.deleteSubtask; } });
Object.defineProperty(exports, "updateSubtask", { enumerable: true, get: function () { return operations_1.updateSubtask; } });
Object.defineProperty(exports, "setSubtasksCompleted", { enumerable: true, get: function () { return operations_1.setSubtasksCompleted; } });
Object.defineProperty(exports, "setAllSubtasksCompleted", { enumerable: true, get: function () { return operations_1.setAllSubtasksCompleted; } });
// Bulk operations
Object.defineProperty(exports, "moveTasks", { enumerable: true, get: function () { return operations_1.moveTasks; } });
Object.defineProperty(exports, "patchTasks", { enumerable: true, get: function () { return operations_1.patchTasks; } });
Object.defineProperty(exports, "deleteTasks", { enumerable: true, get: function () { return operations_1.deleteTasks; } });
Object.defineProperty(exports, "archiveTasks", { enumerable: true, get: function () { return operations_1.archiveTasks; } });
// Export query functions
var query_1 = require("./query");
Object.defineProperty(exports, "findColumnById", { enumerable: true, get: function () { return query_1.findColumnById; } });
Object.defineProperty(exports, "findColumnByName", { enumerable: true, get: function () { return query_1.findColumnByName; } });
Object.defineProperty(exports, "findTaskById", { enumerable: true, get: function () { return query_1.findTaskById; } });
Object.defineProperty(exports, "taskIdExists", { enumerable: true, get: function () { return query_1.taskIdExists; } });
Object.defineProperty(exports, "getAllTasks", { enumerable: true, get: function () { return query_1.getAllTasks; } });
Object.defineProperty(exports, "getTasksByTag", { enumerable: true, get: function () { return query_1.getTasksByTag; } });
Object.defineProperty(exports, "getTasksByPriority", { enumerable: true, get: function () { return query_1.getTasksByPriority; } });
Object.defineProperty(exports, "getTasksByAssignee", { enumerable: true, get: function () { return query_1.getTasksByAssignee; } });
Object.defineProperty(exports, "searchTasks", { enumerable: true, get: function () { return query_1.searchTasks; } });
Object.defineProperty(exports, "getColumnTaskCount", { enumerable: true, get: function () { return query_1.getColumnTaskCount; } });
Object.defineProperty(exports, "getTotalTaskCount", { enumerable: true, get: function () { return query_1.getTotalTaskCount; } });
Object.defineProperty(exports, "columnExists", { enumerable: true, get: function () { return query_1.columnExists; } });
Object.defineProperty(exports, "getTasksWithIncompleteSubtasks", { enumerable: true, get: function () { return query_1.getTasksWithIncompleteSubtasks; } });
Object.defineProperty(exports, "getOverdueTasks", { enumerable: true, get: function () { return query_1.getOverdueTasks; } });
// Export ID generation utilities
var idGen_1 = require("./idGen");
Object.defineProperty(exports, "extractTaskIdNumber", { enumerable: true, get: function () { return idGen_1.extractTaskIdNumber; } });
Object.defineProperty(exports, "getMaxTaskIdNumber", { enumerable: true, get: function () { return idGen_1.getMaxTaskIdNumber; } });
Object.defineProperty(exports, "generateNextTaskId", { enumerable: true, get: function () { return idGen_1.generateNextTaskId; } });
Object.defineProperty(exports, "generateSubtaskIdFromIndex", { enumerable: true, get: function () { return idGen_1.generateSubtaskId; } });
Object.defineProperty(exports, "generateNextSubtaskId", { enumerable: true, get: function () { return idGen_1.generateNextSubtaskId; } });
Object.defineProperty(exports, "isValidTaskId", { enumerable: true, get: function () { return idGen_1.isValidTaskId; } });
Object.defineProperty(exports, "isValidSubtaskId", { enumerable: true, get: function () { return idGen_1.isValidSubtaskId; } });
Object.defineProperty(exports, "getParentTaskId", { enumerable: true, get: function () { return idGen_1.getParentTaskId; } });
// Export discovery utilities
var discovery_1 = require("./discovery");
Object.defineProperty(exports, "discover", { enumerable: true, get: function () { return discovery_1.discover; } });
Object.defineProperty(exports, "findPrimaryBrainfile", { enumerable: true, get: function () { return discovery_1.findPrimaryBrainfile; } });
Object.defineProperty(exports, "watchBrainfiles", { enumerable: true, get: function () { return discovery_1.watchBrainfiles; } });
Object.defineProperty(exports, "isBrainfileName", { enumerable: true, get: function () { return discovery_1.isBrainfileName; } });
Object.defineProperty(exports, "extractBrainfileSuffix", { enumerable: true, get: function () { return discovery_1.extractBrainfileSuffix; } });
Object.defineProperty(exports, "BRAINFILE_PATTERNS", { enumerable: true, get: function () { return discovery_1.BRAINFILE_PATTERNS; } });
Object.defineProperty(exports, "BRAINFILE_GLOBS", { enumerable: true, get: function () { return discovery_1.BRAINFILE_GLOBS; } });
Object.defineProperty(exports, "EXCLUDE_DIRS", { enumerable: true, get: function () { return discovery_1.EXCLUDE_DIRS; } });
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
     * Lint a brainfile.md content string
     * @param content - The markdown content with YAML frontmatter
     * @param options - Linting options
     * @returns LintResult with issues and optionally fixed content
     */
    static lint(content, options) {
        return linter_2.BrainfileLinter.lint(content, options);
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
const linter_2 = require("./linter");
const templates_2 = require("./templates");
//# sourceMappingURL=index.js.map
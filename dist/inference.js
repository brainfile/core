"use strict";
/**
 * Type and renderer inference logic
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferType = inferType;
exports.inferRenderer = inferRenderer;
const enums_1 = require("./types/enums");
/**
 * Infer brainfile type from various signals
 *
 * Priority order:
 * 1. Explicit type field in frontmatter
 * 2. Schema URL pattern (e.g., /v1/journal.json → journal)
 * 3. File name suffix (e.g., brainfile.journal.md → journal)
 * 4. Structure analysis (detect required fields)
 * 5. Default to 'board'
 *
 * @param data - Parsed frontmatter data
 * @param filename - Optional filename for suffix detection
 * @returns The inferred brainfile type
 */
function inferType(data, filename) {
    // 1. Explicit type field
    if (data.type && typeof data.type === 'string') {
        return data.type;
    }
    // 2. Schema URL pattern
    if (data.schema && typeof data.schema === 'string') {
        const schemaMatch = data.schema.match(/\/v1\/(\w+)\.json$/);
        if (schemaMatch) {
            return schemaMatch[1];
        }
    }
    // 3. File name suffix (brainfile.TYPE.md)
    if (filename) {
        const filenameMatch = filename.match(/brainfile\.(\w+)\.md$/);
        if (filenameMatch) {
            return filenameMatch[1];
        }
    }
    // 4. Structure analysis
    const detectedType = detectTypeFromStructure(data);
    if (detectedType) {
        return detectedType;
    }
    // 5. Default
    return enums_1.BrainfileType.BOARD;
}
/**
 * Detect brainfile type from data structure
 * Looks for type-specific required fields
 *
 * @param data - Parsed frontmatter data
 * @returns The detected type or null if unknown
 */
function detectTypeFromStructure(data) {
    // Check for journal structure (entries array)
    if (Array.isArray(data.entries)) {
        return enums_1.BrainfileType.JOURNAL;
    }
    // Check for board structure (columns array)
    if (Array.isArray(data.columns)) {
        return enums_1.BrainfileType.BOARD;
    }
    // Check for collection structure (categories array)
    if (Array.isArray(data.categories)) {
        return enums_1.BrainfileType.COLLECTION;
    }
    // Check for checklist structure (flat items array with completed)
    if (Array.isArray(data.items) && data.items.length > 0) {
        const hasCompleted = data.items.every((item) => typeof item.completed === 'boolean');
        if (hasCompleted) {
            return enums_1.BrainfileType.CHECKLIST;
        }
    }
    // Check for document structure (sections array)
    if (Array.isArray(data.sections)) {
        return enums_1.BrainfileType.DOCUMENT;
    }
    return null;
}
/**
 * Infer renderer type from brainfile data and schema hints
 *
 * Pure structural inference - no special treatment for official types.
 * Custom types with identical structure render identically.
 *
 * Priority order:
 * 1. Schema hint (x-brainfile-renderer in loaded schema) - explicit override
 * 2. Structural pattern matching - detect from data shape
 * 3. Fallback to tree view
 *
 * @param type - The brainfile type (informational only, not used for inference)
 * @param data - Parsed frontmatter data for structural analysis
 * @param schemaHints - Optional schema hints from loaded schema
 * @returns The inferred renderer type
 */
function inferRenderer(type, data, schemaHints) {
    // 1. Schema hint (explicit override)
    if (schemaHints?.renderer) {
        return schemaHints.renderer;
    }
    // 2. Structural pattern matching (universal code path)
    const rendererFromStructure = detectRendererFromStructure(data);
    if (rendererFromStructure) {
        return rendererFromStructure;
    }
    // 3. Fallback
    return enums_1.RendererType.TREE;
}
/**
 * Detect renderer from data structure patterns
 *
 * @param data - Parsed frontmatter data
 * @returns The detected renderer or null if unknown
 */
function detectRendererFromStructure(data) {
    // Columns with nested items → kanban
    if (Array.isArray(data.columns)) {
        return enums_1.RendererType.KANBAN;
    }
    // Entries with timestamps → timeline
    if (Array.isArray(data.entries) && data.entries.length > 0) {
        const hasTimestamps = data.entries.some((entry) => entry.createdAt || entry.timestamp);
        if (hasTimestamps) {
            return enums_1.RendererType.TIMELINE;
        }
    }
    // Items with completed boolean → checklist
    if (Array.isArray(data.items) && data.items.length > 0) {
        const hasCompleted = data.items.every((item) => typeof item.completed === 'boolean');
        if (hasCompleted) {
            return enums_1.RendererType.CHECKLIST;
        }
    }
    // Categories with nested items → grouped-list
    if (Array.isArray(data.categories)) {
        return enums_1.RendererType.GROUPED_LIST;
    }
    // Sections array → document
    if (Array.isArray(data.sections)) {
        return enums_1.RendererType.DOCUMENT;
    }
    return null;
}
//# sourceMappingURL=inference.js.map
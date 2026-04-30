"use strict";
/**
 * Type system enums for brainfile discrimination and rendering
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererType = exports.BrainfileType = void 0;
/**
 * Example brainfile type names
 *
 * IMPORTANT: The type system is OPEN - any string value is valid.
 * These are just reference examples from official schemas at brainfile.md/v1/*.json
 *
 * Custom types work identically:
 * - 'sprint-board' with columns[] → kanban renderer (same as 'board')
 * - 'dev-log' with entries[] → timeline renderer (same as 'journal')
 *
 * Type names are metadata only. Structure determines behavior.
 */
var BrainfileType;
(function (BrainfileType) {
    BrainfileType["BOARD"] = "board";
    BrainfileType["JOURNAL"] = "journal";
    BrainfileType["COLLECTION"] = "collection";
    BrainfileType["CHECKLIST"] = "checklist";
    BrainfileType["DOCUMENT"] = "document";
})(BrainfileType || (exports.BrainfileType = BrainfileType = {}));
/**
 * Renderer types for displaying brainfiles
 *
 * Renderers are selected by:
 * 1. Schema hints (x-brainfile-renderer) - explicit override
 * 2. Structural patterns - detect from data shape
 * 3. Fallback to tree view
 *
 * No special treatment for official types - everyone uses structural inference.
 */
var RendererType;
(function (RendererType) {
    /** Kanban board with columns and draggable cards */
    RendererType["KANBAN"] = "kanban";
    /** Timeline/chronological view with timestamps */
    RendererType["TIMELINE"] = "timeline";
    /** Simple flat checklist with completion tracking */
    RendererType["CHECKLIST"] = "checklist";
    /** Grouped list with categories */
    RendererType["GROUPED_LIST"] = "grouped-list";
    /** Document viewer for structured content */
    RendererType["DOCUMENT"] = "document";
    /** Generic tree view (fallback for unknown types) */
    RendererType["TREE"] = "tree";
})(RendererType || (exports.RendererType = RendererType = {}));
//# sourceMappingURL=enums.js.map
/**
 * Schema hints parser for x-brainfile-* extensions in JSON Schema
 * @packageDocumentation
 */
import { SchemaHints } from './inference';
/**
 * Parse x-brainfile-* extensions from a JSON Schema object
 *
 * Supported extensions:
 * - x-brainfile-renderer: Force specific renderer (kanban, timeline, checklist, tree)
 * - x-brainfile-columns-path: JSONPath to column-like array
 * - x-brainfile-items-path: JSONPath to item arrays
 * - x-brainfile-title-field: Field to use as item title
 * - x-brainfile-status-field: Field for status/completion
 * - x-brainfile-timestamp-field: Field for timestamps
 *
 * @param schema - JSON Schema object (can be loaded from URL or inline)
 * @returns Parsed schema hints
 */
export declare function parseSchemaHints(schema: any): SchemaHints;
/**
 * Load and parse schema hints from a schema URL
 *
 * @param schemaUrl - URL to JSON Schema
 * @returns Parsed schema hints or null on error
 */
export declare function loadSchemaHints(schemaUrl: string): Promise<SchemaHints | null>;
//# sourceMappingURL=schemaHints.d.ts.map
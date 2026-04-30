/**
 * Type and renderer inference logic
 * @packageDocumentation
 */
import { RendererType } from './types/enums';
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
export declare function inferType(data: any, filename?: string): string;
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
export declare function inferRenderer(type: string, data: any, schemaHints?: SchemaHints): RendererType;
/**
 * Schema hints extracted from JSON Schema x-brainfile-* extensions
 */
export interface SchemaHints {
    /** Preferred renderer */
    renderer?: string;
    /** JSONPath to columns array */
    columnsPath?: string;
    /** JSONPath to items arrays */
    itemsPath?: string;
    /** Field to use as item title */
    titleField?: string;
    /** Field to use for status/completion */
    statusField?: string;
    /** Field to use for timestamps */
    timestampField?: string;
}
//# sourceMappingURL=inference.d.ts.map
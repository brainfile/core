/**
 * Serializer for converting Brainfile objects (all types) to markdown format
 * @packageDocumentation
 */
import { Board, Brainfile } from "./types";
export interface SerializeOptions {
    /** YAML indentation (default: 2) */
    indent?: number;
    /** Maximum line width, -1 for unlimited (default: -1) */
    lineWidth?: number;
    /** Include trailing newline (default: true) */
    trailingNewline?: boolean;
}
export declare class BrainfileSerializer {
    /**
     * Serialize any Brainfile object (board, journal, etc.) to markdown format
     * The type field is automatically preserved if present in the data
     * @param data - The Brainfile object to serialize (Board, Journal, etc.)
     * @param options - Serialization options
     * @returns Markdown string with YAML frontmatter
     */
    static serialize(data: Brainfile | Board, options?: SerializeOptions): string;
    /**
     * Serialize any Brainfile object to YAML only (without markdown wrapper)
     * @param data - The Brainfile object to serialize
     * @param options - Serialization options
     * @returns YAML string
     */
    static serializeYamlOnly(data: Brainfile | Board, options?: SerializeOptions): string;
    /**
     * Pretty print any Brainfile object for debugging
     * @param data - The Brainfile object to print
     * @returns Pretty-printed JSON string
     */
    static prettyPrint(data: Brainfile | Board): string;
}
//# sourceMappingURL=serializer.d.ts.map
/**
 * Serializer for converting Board objects to Brainfile markdown format
 * @packageDocumentation
 */
import { Board } from "./types";
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
     * Serialize a Board object back to brainfile.md format
     * @param board - The Board object to serialize
     * @param options - Serialization options
     * @returns Markdown string with YAML frontmatter
     */
    static serialize(board: Board, options?: SerializeOptions): string;
    /**
     * Serialize a Board object to YAML only (without markdown wrapper)
     * @param board - The Board object to serialize
     * @param options - Serialization options
     * @returns YAML string
     */
    static serializeYamlOnly(board: Board, options?: SerializeOptions): string;
    /**
     * Pretty print a Board object for debugging
     * @param board - The Board object to print
     * @returns Pretty-printed JSON string
     */
    static prettyPrint(board: Board): string;
}
//# sourceMappingURL=serializer.d.ts.map
/**
 * Board config file reader/writer.
 *
 * Provides parse, serialize, read, and write operations for the board
 * configuration file (`.brainfile/brainfile.md`), matching the pattern
 * established by `taskFile.ts` for per-task files.
 *
 * The board config file uses YAML frontmatter + markdown body:
 *
 * ```markdown
 * ---
 * title: My Board
 * columns:
 *   - id: todo
 *     title: To Do
 *   - id: done
 *     title: Done
 * agent:
 *   instructions:
 *     - Always write tests
 *   identity: You are a senior engineer
 * ---
 *
 * ## Notes
 * Project-level notes here.
 * ```
 *
 * @packageDocumentation
 */
import type { BoardConfig } from './types';
export { parseBoardConfig, serializeBoardConfig } from './boardContent';
/**
 * Read and parse a board config file from disk.
 *
 * @param filePath - Absolute path to the board config `.md` file
 * @returns Parsed config, body, and filePath; or null if file is invalid
 */
export declare function readBoardConfig(filePath: string): {
    config: BoardConfig;
    body: string;
    filePath: string;
} | null;
/**
 * Write a board config to disk.
 *
 * @param filePath - Absolute path to write the board config file
 * @param config - Board configuration (YAML frontmatter)
 * @param body - Markdown body content
 */
export declare function writeBoardConfig(filePath: string, config: BoardConfig, body?: string): void;
//# sourceMappingURL=boardFile.d.ts.map
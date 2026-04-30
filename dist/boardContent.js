"use strict";
/**
 * Browser-safe board config content parser/serializer.
 *
 * These helpers operate on raw strings only. Disk-backed helpers live in
 * `boardFile.ts`.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBoardConfig = parseBoardConfig;
exports.serializeBoardConfig = serializeBoardConfig;
const frontmatter_1 = require("./frontmatter");
/**
 * Parse YAML frontmatter and markdown body from a board config file's content string.
 *
 * @param content - Raw file content (string)
 * @returns Parsed board config and body, or null if frontmatter is missing/invalid
 */
function parseBoardConfig(content) {
    const parsed = (0, frontmatter_1.parseFrontmatter)(content);
    if (!parsed) {
        return null;
    }
    return {
        config: parsed.data,
        body: parsed.body,
    };
}
/**
 * Serialize board config and body into a markdown string with YAML frontmatter.
 *
 * @param config - Board configuration (YAML frontmatter)
 * @param body - Markdown body content (can be empty string)
 * @returns Serialized file content
 */
function serializeBoardConfig(config, body = '') {
    return (0, frontmatter_1.serializeFrontmatter)(config, body);
}
//# sourceMappingURL=boardContent.js.map
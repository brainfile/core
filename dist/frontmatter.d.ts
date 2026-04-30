export interface FrontmatterDocument<T> {
    data: T;
    body: string;
}
/**
 * Parse YAML frontmatter and markdown body from raw file content.
 *
 * This helper is intentionally runtime-agnostic: it performs no filesystem
 * access and is safe to bundle for browsers.
 */
export declare function parseFrontmatter<T>(content: string): FrontmatterDocument<T> | null;
/**
 * Serialize YAML frontmatter plus optional markdown body.
 *
 * This helper is intentionally runtime-agnostic: it performs no filesystem
 * access and is safe to bundle for browsers.
 */
export declare function serializeFrontmatter<T>(data: T, body?: string): string;
//# sourceMappingURL=frontmatter.d.ts.map
export declare const DOT_BRAINFILE_DIRNAME = ".brainfile";
export declare const BRAINFILE_BASENAME = "brainfile.md";
/** @deprecated state.json is no longer used by Brainfile. */
export declare const BRAINFILE_STATE_BASENAME = "state.json";
export declare const DOT_BRAINFILE_GITIGNORE_BASENAME = ".gitignore";
export type BrainfileResolutionKind = 'dotdir' | 'root' | 'hidden' | 'bb';
export interface FoundBrainfile {
    absolutePath: string;
    /** Directory considered the "project root" for this brainfile */
    projectRoot: string;
    kind: BrainfileResolutionKind;
}
/**
 * Find a brainfile by walking up from a starting directory.
 *
 * Resolution priority (per directory):
 * 1) `.brainfile/brainfile.md` (preferred)
 * 2) `brainfile.md` (legacy)
 * 3) `.brainfile.md` (legacy hidden)
 * 4) `.bb.md` (legacy)
 */
export declare function findBrainfile(startDir?: string): FoundBrainfile | null;
export interface ResolveBrainfilePathOptions {
    /**
     * If set, an explicit file path. If `undefined` or the default `brainfile.md`,
     * auto-discovery is used.
     */
    filePath?: string;
    /** Starting directory used for auto-discovery and relative resolution */
    startDir?: string;
}
/**
 * Resolve a brainfile path for CLI/MCP usage.
 *
 * - If `filePath` is omitted (or is the default `brainfile.md`), attempts auto-discovery.
 * - If discovery fails, falls back to resolving `filePath` relative to `startDir`/cwd.
 */
export declare function resolveBrainfilePath(options?: ResolveBrainfilePathOptions): string;
/**
 * Return the `.brainfile/` directory for a given brainfile.
 *
 * - If the brainfile itself is inside `.brainfile/`, returns that directory.
 * - Otherwise returns `<brainfileDir>/.brainfile/`.
 */
export declare function getBrainfileStateDir(brainfilePath: string): string;
/**
 * @deprecated state.json is no longer used by Brainfile.
 */
export declare function getBrainfileStatePath(brainfilePath: string): string;
export declare function getDotBrainfileGitignorePath(brainfilePath: string): string;
export declare function ensureDotBrainfileDir(brainfilePath: string): string;
/**
 * Ensure `.brainfile/.gitignore` exists.
 *
 * Note: Brainfile no longer writes `state.json`, so no state entry is added.
 */
export declare function ensureDotBrainfileGitignore(brainfilePath: string): void;
//# sourceMappingURL=files.d.ts.map
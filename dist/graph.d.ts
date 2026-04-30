export interface DependencyGraphNode {
    id: string;
    dependsOn?: readonly string[];
}
export declare class MissingDependencyError extends Error {
    readonly taskId: string;
    readonly dependencyId: string;
    constructor(taskId: string, dependencyId: string);
}
export declare class DependencyCycleError extends Error {
    readonly cycle: string[];
    constructor(cycle: string[]);
}
export declare function topologicalSort(nodes: readonly DependencyGraphNode[]): string[];
//# sourceMappingURL=graph.d.ts.map
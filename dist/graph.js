"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyCycleError = exports.MissingDependencyError = void 0;
exports.topologicalSort = topologicalSort;
class MissingDependencyError extends Error {
    constructor(taskId, dependencyId) {
        super(`Task ${taskId} depends on missing task ${dependencyId}`);
        this.name = 'MissingDependencyError';
        this.taskId = taskId;
        this.dependencyId = dependencyId;
    }
}
exports.MissingDependencyError = MissingDependencyError;
class DependencyCycleError extends Error {
    constructor(cycle) {
        super(`Dependency cycle detected: ${cycle.join(' -> ')}`);
        this.name = 'DependencyCycleError';
        this.cycle = cycle;
    }
}
exports.DependencyCycleError = DependencyCycleError;
function normalizeDependencyIds(dependsOn) {
    if (!Array.isArray(dependsOn)) {
        return [];
    }
    return [...new Set(dependsOn.map((value) => value.trim()).filter(Boolean))];
}
function topologicalSort(nodes) {
    const dependenciesById = new Map();
    for (const node of nodes) {
        if (dependenciesById.has(node.id)) {
            throw new Error(`Duplicate graph node: ${node.id}`);
        }
        dependenciesById.set(node.id, normalizeDependencyIds(node.dependsOn));
    }
    const state = new Map();
    const stack = [];
    const order = [];
    const visit = (taskId) => {
        const currentState = state.get(taskId);
        if (currentState === 'done') {
            return;
        }
        if (currentState === 'visiting') {
            const cycleStart = stack.indexOf(taskId);
            const cycle = cycleStart >= 0
                ? [...stack.slice(cycleStart), taskId]
                : [taskId, taskId];
            throw new DependencyCycleError(cycle);
        }
        state.set(taskId, 'visiting');
        stack.push(taskId);
        for (const dependencyId of dependenciesById.get(taskId) ?? []) {
            if (!dependenciesById.has(dependencyId)) {
                throw new MissingDependencyError(taskId, dependencyId);
            }
            visit(dependencyId);
        }
        stack.pop();
        state.set(taskId, 'done');
        order.push(taskId);
    };
    for (const taskId of dependenciesById.keys()) {
        visit(taskId);
    }
    return order;
}
//# sourceMappingURL=graph.js.map
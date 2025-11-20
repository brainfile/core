/**
 * Task template system for creating structured tasks from predefined templates
 * @packageDocumentation
 */
import { TaskTemplate, Task } from './types';
export declare const BUILT_IN_TEMPLATES: TaskTemplate[];
/**
 * Generate a unique task ID
 * @returns A unique task ID string
 */
export declare function generateTaskId(): string;
/**
 * Generate a subtask ID based on parent task ID
 * @param parentId - The parent task ID
 * @param index - The index of the subtask
 * @returns A subtask ID string
 */
export declare function generateSubtaskId(parentId: string, index: number): string;
/**
 * Process a template and substitute variable values
 * @param template - The template to process
 * @param values - Variable values to substitute
 * @returns A partial Task object with substituted values
 */
export declare function processTemplate(template: TaskTemplate, values: Record<string, string>): Partial<Task>;
/**
 * Get a template by ID
 * @param id - The template ID
 * @returns The template or undefined if not found
 */
export declare function getTemplateById(id: string): TaskTemplate | undefined;
/**
 * Get all template IDs
 * @returns Array of template IDs
 */
export declare function getAllTemplateIds(): string[];
//# sourceMappingURL=templates.d.ts.map
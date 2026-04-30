/**
 * Journal-specific type definitions
 * @packageDocumentation
 */
import { BrainfileBase } from './base';
/**
 * Journal entry definition
 */
export interface JournalEntry {
    id: string;
    title: string;
    content?: string;
    summary?: string;
    mood?: string;
    tags?: string[];
    createdAt: string;
    updatedAt?: string;
}
/**
 * Journal type - Time-ordered entries (dev logs, standup notes, etc.)
 * Extends BrainfileBase with journal-specific fields
 */
export interface Journal extends BrainfileBase {
    type?: 'journal';
    entries: JournalEntry[];
}
//# sourceMappingURL=journal.d.ts.map
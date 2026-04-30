/**
 * Core type definitions for the Brainfile task management protocol
 * @packageDocumentation
 */
export * from './base';
export * from './enums';
export * from './contract';
export * from './ledger';
export * from './completed';
export * from './board';
export * from './journal';
import { Board } from './board';
import { Journal } from './journal';
export type Brainfile = Board | Journal;
//# sourceMappingURL=index.d.ts.map
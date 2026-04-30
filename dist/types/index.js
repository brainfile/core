"use strict";
/**
 * Core type definitions for the Brainfile task management protocol
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Base types shared across all brainfile types
__exportStar(require("./base"), exports);
// Type system enums
__exportStar(require("./enums"), exports);
// Contracts (optional task extension)
__exportStar(require("./contract"), exports);
__exportStar(require("./ledger"), exports);
// Completed task reference (abstraction over Task and LedgerRecord)
__exportStar(require("./completed"), exports);
// Type-specific definitions
__exportStar(require("./board"), exports);
__exportStar(require("./journal"), exports);
//# sourceMappingURL=index.js.map
"use strict";
/**
 * Browser-safe Brainfile entrypoint.
 *
 * This module exports parsing, serialization, graph, and realtime diff helpers
 * that do not import Node-only modules such as `fs`, `path`, or `crypto`.
 *
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
exports.topologicalSort = exports.DependencyCycleError = exports.MissingDependencyError = exports.diffBoards = exports.serializeTaskContent = exports.parseTaskContent = exports.serializeBoardConfig = exports.parseBoardConfig = exports.BrainfileSerializer = exports.BrainfileParser = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./types/contract"), exports);
var parser_1 = require("./parser");
Object.defineProperty(exports, "BrainfileParser", { enumerable: true, get: function () { return parser_1.BrainfileParser; } });
var serializer_1 = require("./serializer");
Object.defineProperty(exports, "BrainfileSerializer", { enumerable: true, get: function () { return serializer_1.BrainfileSerializer; } });
var boardContent_1 = require("./boardContent");
Object.defineProperty(exports, "parseBoardConfig", { enumerable: true, get: function () { return boardContent_1.parseBoardConfig; } });
Object.defineProperty(exports, "serializeBoardConfig", { enumerable: true, get: function () { return boardContent_1.serializeBoardConfig; } });
var taskContent_1 = require("./taskContent");
Object.defineProperty(exports, "parseTaskContent", { enumerable: true, get: function () { return taskContent_1.parseTaskContent; } });
Object.defineProperty(exports, "serializeTaskContent", { enumerable: true, get: function () { return taskContent_1.serializeTaskContent; } });
var realtimeDiff_1 = require("./realtimeDiff");
Object.defineProperty(exports, "diffBoards", { enumerable: true, get: function () { return realtimeDiff_1.diffBoards; } });
var graph_1 = require("./graph");
Object.defineProperty(exports, "MissingDependencyError", { enumerable: true, get: function () { return graph_1.MissingDependencyError; } });
Object.defineProperty(exports, "DependencyCycleError", { enumerable: true, get: function () { return graph_1.DependencyCycleError; } });
Object.defineProperty(exports, "topologicalSort", { enumerable: true, get: function () { return graph_1.topologicalSort; } });
//# sourceMappingURL=browser.js.map
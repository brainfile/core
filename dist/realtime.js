"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffBoards = void 0;
exports.hashBoardContent = hashBoardContent;
exports.hashBoard = hashBoard;
const crypto_1 = require("crypto");
const serializer_1 = require("./serializer");
var realtimeDiff_1 = require("./realtimeDiff");
Object.defineProperty(exports, "diffBoards", { enumerable: true, get: function () { return realtimeDiff_1.diffBoards; } });
/**
  * Generate a stable hash for raw Brainfile content.
  * Uses SHA-256 for collision resistance and cross-process consistency.
  */
function hashBoardContent(content) {
    return (0, crypto_1.createHash)('sha256').update(content, 'utf8').digest('hex');
}
/**
  * Generate a stable hash for a Board by serializing with BrainfileSerializer.
  */
function hashBoard(board) {
    const serialized = serializer_1.BrainfileSerializer.serialize(board);
    return hashBoardContent(serialized);
}
//# sourceMappingURL=realtime.js.map
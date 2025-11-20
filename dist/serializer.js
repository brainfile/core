"use strict";
/**
 * Serializer for converting Board objects to Brainfile markdown format
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrainfileSerializer = void 0;
const yaml = __importStar(require("js-yaml"));
class BrainfileSerializer {
    /**
     * Serialize a Board object back to brainfile.md format
     * @param board - The Board object to serialize
     * @param options - Serialization options
     * @returns Markdown string with YAML frontmatter
     */
    static serialize(board, options = {}) {
        const { indent = 2, lineWidth = -1, trailingNewline = true } = options;
        const yamlContent = yaml.dump(board, {
            indent,
            lineWidth,
            noRefs: true,
            sortKeys: false,
            quotingType: '"',
            forceQuotes: false
        });
        const result = `---\n${yamlContent}---\n`;
        return trailingNewline ? result : result.trimEnd();
    }
    /**
     * Serialize a Board object to YAML only (without markdown wrapper)
     * @param board - The Board object to serialize
     * @param options - Serialization options
     * @returns YAML string
     */
    static serializeYamlOnly(board, options = {}) {
        const { indent = 2, lineWidth = -1 } = options;
        return yaml.dump(board, {
            indent,
            lineWidth,
            noRefs: true,
            sortKeys: false
        });
    }
    /**
     * Pretty print a Board object for debugging
     * @param board - The Board object to print
     * @returns Pretty-printed JSON string
     */
    static prettyPrint(board) {
        return JSON.stringify(board, null, 2);
    }
}
exports.BrainfileSerializer = BrainfileSerializer;
//# sourceMappingURL=serializer.js.map
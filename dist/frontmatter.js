"use strict";
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
exports.parseFrontmatter = parseFrontmatter;
exports.serializeFrontmatter = serializeFrontmatter;
const yaml = __importStar(require("js-yaml"));
/**
 * Parse YAML frontmatter and markdown body from raw file content.
 *
 * This helper is intentionally runtime-agnostic: it performs no filesystem
 * access and is safe to bundle for browsers.
 */
function parseFrontmatter(content) {
    const lines = content.split('\n');
    if (!lines[0] || lines[0].trim() !== '---') {
        return null;
    }
    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
            endIndex = i;
            break;
        }
    }
    if (endIndex === -1) {
        return null;
    }
    const yamlContent = lines.slice(1, endIndex).join('\n');
    const bodyContent = lines.slice(endIndex + 1).join('\n');
    let parsed;
    try {
        parsed = yaml.load(yamlContent);
    }
    catch {
        return null;
    }
    if (!parsed || typeof parsed !== 'object') {
        return null;
    }
    return {
        data: parsed,
        body: bodyContent.replace(/^\n/, ''),
    };
}
/**
 * Serialize YAML frontmatter plus optional markdown body.
 *
 * This helper is intentionally runtime-agnostic: it performs no filesystem
 * access and is safe to bundle for browsers.
 */
function serializeFrontmatter(data, body = '') {
    const yamlContent = yaml.dump(data, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false,
        quotingType: '"',
        forceQuotes: false,
    });
    const parts = ['---\n', yamlContent, '---\n'];
    if (body.length > 0) {
        parts.push('\n');
        parts.push(body);
        if (!body.endsWith('\n')) {
            parts.push('\n');
        }
    }
    return parts.join('');
}
//# sourceMappingURL=frontmatter.js.map
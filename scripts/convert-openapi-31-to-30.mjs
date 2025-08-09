import fs from 'node:fs';
import path from 'node:path';

const schemaPath = path.resolve(process.cwd(), 'schema.json');
const raw = fs.readFileSync(schemaPath, 'utf8');
const doc = JSON.parse(raw);

function transformSchema(node) {
  if (!node || typeof node !== 'object') return;

  // Downgrade 3.1 nullable union to 3.0 nullable flag
  if (Array.isArray(node.type)) {
    const hasNull = node.type.includes('null');
    if (hasNull) {
      // pick the first non-null primitive if available
      const nonNull = node.type.find((t) => t !== 'null') || 'string';
      node.type = nonNull;
      node.nullable = true;
    }
  }

  // Recurse into nested objects/arrays
  for (const key of Object.keys(node)) {
    const value = node[key];
    if (Array.isArray(value)) {
      for (const v of value) transformSchema(v);
    } else if (value && typeof value === 'object') {
      transformSchema(value);
    }
  }
}

// Apply root-level changes
if (doc.openapi && typeof doc.openapi === 'string') {
  doc.openapi = '3.0.3';
}

// Remove unsupported top-level keys in 3.0
if ('webhooks' in doc) {
  delete doc.webhooks;
}

// Ensure servers is present
if (!doc.servers || !Array.isArray(doc.servers) || doc.servers.length === 0) {
  doc.servers = [{ url: 'https://dify-tool.atk721.workers.dev' }];
}

transformSchema(doc);

fs.writeFileSync(schemaPath, JSON.stringify(doc, null, 2) + '\n', 'utf8');

console.log('Converted schema.json to OpenAPI 3.0.3 and replaced nullable unions.');

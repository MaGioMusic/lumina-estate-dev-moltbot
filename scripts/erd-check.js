const fs = require('fs');
const path = require('path');
require('ts-node/register');
const { validateERD, toMermaid } = require('../src/lib/erd/relations');

function readSchemaMarkdown() {
  const schemaPath = path.resolve(__dirname, '../../LUMINA_DATABASE_SCHEMA.md');
  return fs.readFileSync(schemaPath, 'utf8');
}

function parseTables(markdown) {
  const codeBlocks = Array.from(markdown.matchAll(/```sql([\s\S]*?)```/g)).map(m => m[1]);
  const entities = [];
  const fks = [];
  const uniques = {};

  for (const sql of codeBlocks) {
    for (const tableMatch of sql.matchAll(/CREATE\s+TABLE\s+(\w+)\s*\(([^;]*?)\);/gi)) {
      const table = tableMatch[1];
      const body = tableMatch[2];
      const fields = {};
      const primaryKey = 'id';

      for (const line of body.split(/\n+/)) {
        const trimmed = line.trim().replace(/,$/, '');
        const col = trimmed.match(/^(\w+)\s+([\w\(\),]+)(?:\s|$)/);
        if (col) {
          const name = col[1];
          const type = col[2];
          // Always record the column, even if it also contains PRIMARY KEY or REFERENCES
          fields[name] = type.toLowerCase();
        }
        const ref = trimmed.match(/^(\w+)\s+[^,]*?REFERENCES\s+(\w+)\s*\((\w+)\)/i);
        if (ref) {
          fks.push({ fromTable: table, fromField: ref[1], toTable: ref[2], toField: ref[3] });
        }
        const uniq = trimmed.match(/UNIQUE\s*\(([^\)]+)\)/i);
        if (uniq) {
          const cols = uniq[1].split(',').map(s => s.trim());
          uniques[table] = uniques[table] ? uniques[table].concat([cols.join(',')]) : [cols.join(',')];
        }
      }

      entities.push({ name: table, fields, primaryKey, uniques: uniques[table] });
    }
  }

  return { entities, fks, uniques };
}

function buildRelations(entities, fks, uniques) {
  const rels = [];
  const byTable = {};
  for (const fk of fks) {
    byTable[fk.fromTable] = byTable[fk.fromTable] || [];
    byTable[fk.fromTable].push({ fromField: fk.fromField, toTable: fk.toTable, toField: fk.toField });
  }

  for (const fk of fks) {
    const uniqueCols = uniques[fk.fromTable] || [];
    const isOneToOne = uniqueCols.some(u => u.split(',').map(s => s.trim()).includes(fk.fromField));
    rels.push({
      name: `${fk.fromTable}.${fk.fromField}->${fk.toTable}.${fk.toField}`,
      cardinality: isOneToOne ? '1:1' : '1:N',
      from: { entity: fk.fromTable, field: fk.fromField },
      to: { entity: fk.toTable, field: fk.toField },
    });
  }

  const joinAllow = new Set(['favorites', 'appointments']);
  for (const [tbl, refs] of Object.entries(byTable)) {
    const parents = Array.from(new Set(refs.map(r => r.toTable)));
    if (parents.length >= 2 && joinAllow.has(tbl)) {
      for (const r of refs) {
        rels.push({
          name: `${tbl} via ${r.fromField}`,
          cardinality: 'N:M',
          from: { entity: tbl, field: r.fromField },
          to: { entity: r.toTable, field: r.toField },
          via: tbl,
        });
      }
    }
  }

  return rels;
}

function renderReport(entities, relationships, issues, mermaid) {
  const now = new Date().toISOString();
  const issuesTable = issues.length
    ? `\n| Level | Code | Message |\n|---|---|---|\n${issues.map(i => `| ${i.level} | ${i.code} | ${i.message.replace(/\|/g, '\\|')} |`).join('\n')}\n`
    : '\n_No issues found._\n';

  const entityList = entities.map(e => `- ${e.name}: ${Object.keys(e.fields).join(', ')}`).join('\n');
  const relList = relationships.map(r => `- ${r.cardinality} ${r.from.entity}.${r.from.field} -> ${r.to.entity}.${r.to.field}${r.via ? ` (via ${r.via})` : ''}`).join('\n');

  return `# ERD Audit Report\n\nGenerated: ${now}\n\n## Entities\n${entityList}\n\n## Relationships\n${relList}\n\n## Issues\n${issuesTable}\n\n## Mermaid ERD\n\n\`\`\`mermaid\n${mermaid}\n\`\`\`\n`;
}

function main() {
  const md = readSchemaMarkdown();
  const { entities, fks, uniques } = parseTables(md);
  const rels = buildRelations(entities, fks, uniques);
  const { issues } = validateERD(entities, rels);
  const mermaid = toMermaid(entities, rels);
  const report = renderReport(entities, rels, issues, mermaid);
  const outPath = path.resolve(__dirname, '../ERD_AUDIT.md');
  fs.writeFileSync(outPath, report, 'utf8');
  console.log(`\nERD_AUDIT.md written to: ${outPath}`);
}

main();

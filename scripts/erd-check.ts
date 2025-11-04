// This TypeScript variant is kept for reference. Execution will use the JS version to avoid ESM loader issues.
import fs from 'fs';
import path from 'path';
import { validateERD, toMermaid } from '../src/lib/erd/relations';

// Minimal structures mirroring validator types
interface Entity { name: string; fields: Record<string, string>; uniques?: string[]; primaryKey?: string }
interface FieldRef { entity: string; field: string }
interface Relationship { name: string; cardinality: '1:1' | '1:N' | 'N:1' | 'N:M'; from: FieldRef; to: FieldRef; via?: string }

function readSchemaMarkdown(): string {
  const schemaPath = path.resolve(__dirname, '../../LUMINA_DATABASE_SCHEMA.md');
  return fs.readFileSync(schemaPath, 'utf8');
}

function parseTables(markdown: string): { entities: Entity[]; fks: Array<{ fromTable: string; fromField: string; toTable: string; toField: string }>; uniques: Record<string, string[]> } {
  const codeBlocks = Array.from(markdown.matchAll(/```sql([\s\S]*?)```/g)).map(m => m[1]);
  const entities: Entity[] = [];
  const fks: Array<{ fromTable: string; fromField: string; toTable: string; toField: string }> = [];
  const uniques: Record<string, string[]> = {};

  for (const sql of codeBlocks) {
    for (const tableMatch of sql.matchAll(/CREATE\s+TABLE\s+(\w+)\s*\(([^;]*?)\);/gi)) {
      const table = tableMatch[1];
      const body = tableMatch[2];
      const fields: Record<string, string> = {};
      const primaryKey = 'id';

      // Column lines
      for (const line of body.split(/\n+/)) {
        const trimmed = line.trim().replace(/,$/, '');
        // column like: name TYPE ...
        const col = trimmed.match(/^(\w+)\s+([\w\(\),]+)(?:\s|$)/);
        if (col) {
          const name = col[1];
          const type = col[2];
          if (!/UNIQUE\b|PRIMARY KEY|FOREIGN KEY|CHECK\b|CONSTRAINT\b|REFERENCES\b/i.test(trimmed)) {
            fields[name] = type.toLowerCase();
          }
        }
        // FK inline REFERENCES
        const ref = trimmed.match(/^(\w+)\s+[^,]*?REFERENCES\s+(\w+)\s*\((\w+)\)/i);
        if (ref) {
          fks.push({ fromTable: table, fromField: ref[1], toTable: ref[2], toField: ref[3] });
        }
        // UNIQUE(column[,column]) inline or table-level
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

function buildRelations(entities: Entity[], fks: Array<{ fromTable: string; fromField: string; toTable: string; toField: string }>, uniques: Record<string, string[]>): Relationship[] {
  const rels: Relationship[] = [];

  // Detect join tables (two or more FKs to two distinct parents)
  const byTable: Record<string, Array<{ fromField: string; toTable: string; toField: string }>> = {};
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

  for (const [tbl, refs] of Object.entries(byTable)) {
    const parents = Array.from(new Set(refs.map(r => r.toTable)));
    if (parents.length >= 2) {
      // mark as join table for N:M (each FK becomes edge via tbl)
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

function renderReport(
  entities: Entity[],
  relationships: Relationship[],
  issues: ReturnType<typeof validateERD>['issues'],
  mermaid: string
): string {
  const now = new Date().toISOString();
  const issuesTable = issues.length
    ? `\n| Level | Code | Message |\n|---|---|---|\n${issues
        .map(i => `| ${i.level} | ${i.code} | ${i.message.replace(/\|/g, '\\|')} |`)
        .join('\n')}\n`
    : '\n_No issues found._\n';

  const entityList = entities
    .map(e => `- ${e.name}: ${Object.keys(e.fields).join(', ')}`)
    .join('\n');

  const relList = relationships
    .map(r => `- ${r.cardinality} ${r.from.entity}.${r.from.field} -> ${r.to.entity}.${r.to.field}${r.via ? ` (via ${r.via})` : ''}`)
    .join('\n');

  return `# ERD Audit Report\n\nGenerated: ${now}\n\n## Entities\n${entityList}\n\n## Relationships\n${relList}\n\n## Issues\n${issuesTable}\n\n## Mermaid ERD\n\n\`\`\`mermaid\n${mermaid}\n\`\`\`\n`;
}

function main() {
  const md = readSchemaMarkdown();
  const { entities, fks, uniques } = parseTables(md);
  // Attach uniques back to entities (parseTables already did, but ensure presence)
  const rels = buildRelations(entities, fks, uniques);
  const { issues } = validateERD(entities as any, rels as any);
  const mermaid = toMermaid(entities as any, rels as any);
  const report = renderReport(entities, rels, issues, mermaid);

  const outPath = path.resolve(__dirname, '../ERD_AUDIT.md');
  fs.writeFileSync(outPath, report, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`\nERD_AUDIT.md written to: ${outPath}`);
}

main();

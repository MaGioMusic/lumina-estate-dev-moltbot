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

      for (const rawLine of body.split(/\n+/)) {
        const trimmedRaw = rawLine.trim();
        if (!trimmedRaw || trimmedRaw.startsWith('--')) {
          continue;
        }

        const trimmed = trimmedRaw.replace(/,$/, '');

        if (/^constraint\b/i.test(trimmed) || /^primary\s+key/i.test(trimmed)) {
          continue;
        }

        if (/^unique\b/i.test(trimmed)) {
          const uniqOnly = trimmed.match(/UNIQUE\s*\(([^\)]+)\)/i);
          if (uniqOnly) {
            const cols = uniqOnly[1].split(',').map(s => s.trim()).filter(Boolean);
            uniques[table] = uniques[table] ? uniques[table].concat([cols.join(',')]) : [cols.join(',')];
          }
          continue;
        }

        if (/^check\b/i.test(trimmed)) {
          continue;
        }

        const col = trimmed.match(/^(\w+)\s+([\w\(\),]+)(?:\s|$)/);
        if (col) {
          const name = col[1];
          if (/^(constraint|primary|unique|check)$/i.test(name)) {
            continue;
          }
          const type = col[2];
          fields[name] = type.toLowerCase();

          if (/\bUNIQUE\b/i.test(trimmed)) {
            uniques[table] = uniques[table] ? uniques[table].concat([name]) : [name];
          }
        }
        const ref = trimmed.match(/^(\w+)\s+[^,]*?REFERENCES\s+(\w+)\s*\((\w+)\)/i);
        if (ref) {
          fks.push({ fromTable: table, fromField: ref[1], toTable: ref[2], toField: ref[3] });
        }
        const uniq = trimmed.match(/UNIQUE\s*\(([^\)]+)\)/i);
        if (uniq && !/^unique\b/i.test(trimmed)) {
          const cols = uniq[1].split(',').map(s => s.trim()).filter(Boolean);
          uniques[table] = uniques[table] ? uniques[table].concat([cols.join(',')]) : [cols.join(',')];
        }
      }

      const cleanedFields = Object.fromEntries(
        Object.entries(fields).filter(([key]) => /^[a-zA-Z_][\w$]*$/.test(key) && key.toLowerCase() !== 'check')
      );

      entities.push({ name: table, fields: cleanedFields, primaryKey, uniques: uniques[table] });
    }
  }

  return { entities, fks, uniques };
}

function buildRelations(_entities: Entity[], fks: Array<{ fromTable: string; fromField: string; toTable: string; toField: string }>, uniques: Record<string, string[]>): Relationship[] {
  const rels: Relationship[] = [];

  // Detect join tables (two or more FKs to two distinct parents)
  const byTable: Record<string, Array<{ fromField: string; toTable: string; toField: string }>> = {};
  for (const fk of fks) {
    byTable[fk.fromTable] = byTable[fk.fromTable] || [];
    byTable[fk.fromTable].push({ fromField: fk.fromField, toTable: fk.toTable, toField: fk.toField });
  }

  for (const fk of fks) {
    const uniqueCols = (uniques[fk.fromTable] || []).map(u => u.split(',').map(s => s.trim()).filter(Boolean));
    const isOneToOne = uniqueCols.some(cols => cols.length === 1 && cols[0] === fk.fromField);
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

  const sqlRecommendations = [
    '## SQL Recommendations',
    '',
    '**Favorites (saved properties)**',
    '```sql',
    'ALTER TABLE favorites',
    '  ADD CONSTRAINT favorites_user_property_unique UNIQUE (user_id, property_id);',
    'CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_favorites_property ON favorites(property_id);',
    '```',
    '',
    '**Appointments (viewings)**',
    '```sql',
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_unique_slot',
    '  ON appointments(client_id, agent_id, property_id, scheduled_date);',
    'CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);',
    'CREATE INDEX IF NOT EXISTS idx_appointments_agent ON appointments(agent_id);',
    'CREATE INDEX IF NOT EXISTS idx_appointments_property ON appointments(property_id);',
    '```',
    '',
    '**Property analytics (daily rollups)**',
    '```sql',
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_property_analytics_daily',
    '  ON property_analytics(property_id, analytics_date);',
    '```',
    '',
    '**Property search performance**',
    '```sql',
    'CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);',
    'CREATE INDEX IF NOT EXISTS idx_properties_search',
    '  ON properties(city, property_type, transaction_type, status);',
    'CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);',
    'CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);',
    '```',
    ''
  ].join('\n');

  const optionalModules = [
    '## Optional Modules (enable if needed)',
    '',
    '**Images table** — richer metadata per property',
    '```sql',
    'CREATE TABLE images (',
    '  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),',
    '  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,',
    '  url TEXT NOT NULL,',
    '  alt TEXT,',
    '  sort_order INTEGER DEFAULT 0,',
    '  created_at TIMESTAMP DEFAULT NOW()',
    ');',
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_images_property_sort',
    '  ON images(property_id, sort_order);',
    'CREATE INDEX IF NOT EXISTS idx_images_property ON images(property_id);',
    '```',
    '',
    '**Listings history** — re-list same property with new terms',
    '```sql',
    "CREATE TYPE listing_status AS ENUM ('active','expired','withdrawn','sold','rented');",
    'CREATE TABLE listings (',
    '  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),',
    '  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,',
    '  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,',
    '  user_id UUID REFERENCES users(id) ON DELETE SET NULL,',
    '  date_listed TIMESTAMP NOT NULL DEFAULT NOW(),',
    '  expiry_date TIMESTAMP,',
    '  price DECIMAL(12,2) NOT NULL,',
    "  currency currency_type DEFAULT 'GEL',",
    "  status listing_status DEFAULT 'active',",
    '  notes TEXT',
    ');',
    'CREATE INDEX IF NOT EXISTS idx_listings_property_date',
    '  ON listings(property_id, date_listed DESC);',
    'CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);',
    'CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);',
    '```',
    ''
  ].join('\n');

  return `# ERD Audit Report\n\nGenerated: ${now}\n\n## Entities\n${entityList}\n\n## Relationships\n${relList}\n\n## Issues\n${issuesTable}\n\n## Mermaid ERD\n\n\`\`\`mermaid\n${mermaid}\n\`\`\`\n${sqlRecommendations}\n\n${optionalModules}`;
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

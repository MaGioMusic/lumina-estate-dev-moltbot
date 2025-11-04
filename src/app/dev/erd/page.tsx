// Dev ERD page - renders validation issues and Mermaid code
import { validateERD } from '@/lib/erd/relations';

export default function Page() {
  const { issues, adjacency, mermaid } = validateERD();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">ERD Validation</h1>

      <section>
        <h2 className="text-xl font-medium mb-2">Issues</h2>
        {issues.length === 0 ? (
          <p className="text-green-600">No issues found.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-3 py-2 text-left">Level</th>
                  <th className="px-3 py-2 text-left">Code</th>
                  <th className="px-3 py-2 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((i, idx) => (
                  <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                    <td className={i.level === 'error' ? 'text-red-600 px-3 py-2' : 'text-amber-600 px-3 py-2'}>
                      {i.level}
                    </td>
                    <td className="px-3 py-2">{i.code}</td>
                    <td className="px-3 py-2">{i.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Adjacency</h2>
        <pre className="whitespace-pre-wrap text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
{JSON.stringify(adjacency, null, 2)}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Mermaid ERD</h2>
        <p className="text-sm text-gray-500 mb-2">Copy-paste into a Mermaid viewer to render.</p>
        <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-auto">
{mermaid}
        </pre>
      </section>
    </div>
  );
}



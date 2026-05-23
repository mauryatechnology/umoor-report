'use client';

import { InboxIcon } from 'lucide-react';

export default function DataTable({
  columns,
  data,
  emptyMessage = 'No data found.',
  emptyIcon: EmptyIcon = InboxIcon,
  className = '',
  maxHeight = 'max-h-[calc(100vh-320px)]',
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-charcoal/8 overflow-hidden ${className}`}
    >
      <div className={`overflow-auto scrollbar-thin ${maxHeight}`}>
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-emerald-50 to-emerald-50/60 border-b border-emerald-dark/10">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-emerald-dark/70 whitespace-nowrap ${
                    col.className || ''
                  }`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-charcoal/5 flex items-center justify-center">
                      <EmptyIcon size={24} className="text-charcoal/25" />
                    </div>
                    <p className="text-charcoal/40 text-sm font-medium">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  className="hover:bg-emerald-50/30 transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-4 py-3.5 text-charcoal/80 ${
                        col.cellClassName || ''
                      }`}
                    >
                      {col.render
                        ? col.render(row, rowIdx)
                        : col.accessor
                        ? row[col.accessor]
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

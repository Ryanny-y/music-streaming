import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type DataTableColumn<T> = {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  className?: string
}

type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => string
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({ className, columns, data, emptyMessage = 'No records found', getRowKey }: DataTableProps<T>) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-card/80', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-normal text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th className={cn('px-4 py-3 font-medium', column.className)} key={column.key}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length > 0 ? (
              data.map((row) => (
                <tr className="transition hover:bg-secondary/40" key={getRowKey(row)}>
                  {columns.map((column) => (
                    <td className={cn('px-4 py-4 text-foreground', column.className)} key={column.key}>
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

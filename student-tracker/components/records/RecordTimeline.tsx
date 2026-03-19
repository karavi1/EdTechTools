import { StudentRecord } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import RecordBadge from './RecordBadge'
import EmptyState from '@/components/ui/EmptyState'
import Link from 'next/link'

interface RecordTimelineProps {
  records: StudentRecord[]
  studentId: string
}

export default function RecordTimeline({ records, studentId }: RecordTimelineProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="No records yet"
        description="Start tracking this student's behavior by logging their first record."
        action={
          <Link
            href={`/students/${studentId}/records/new`}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Log first record
          </Link>
        }
      />
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {records.map((record, idx) => (
          <li key={record.id}>
            <div className="relative pb-8">
              {idx < records.length - 1 && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white shrink-0">
                  <span className="text-xs font-medium text-gray-600">
                    {record.type.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-100 px-4 py-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <RecordBadge type={record.type} />
                    <span className="text-xs text-gray-400">{formatDate(record.date)}</span>
                  </div>
                  {record.notes && (
                    <p className="mt-2 text-sm text-gray-700">{record.notes}</p>
                  )}
                  {record.value !== null && (
                    <p className="mt-1 text-sm font-medium text-gray-900">Score: {record.value}</p>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

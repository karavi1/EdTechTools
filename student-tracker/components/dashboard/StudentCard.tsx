import Link from 'next/link'
import { Student, StudentRecord } from '@/lib/types'
import { formatRelativeDate } from '@/lib/utils'
import RecordBadge from '@/components/records/RecordBadge'
import { Card, CardContent } from '@/components/ui/Card'

interface StudentCardProps {
  student: Student
  lastRecord?: StudentRecord | null
}

export default function StudentCard({ student, lastRecord }: StudentCardProps) {
  return (
    <Link href={`/students/${student.id}`}>
      <Card className="hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer">
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900">{student.name}</p>
              {student.grade && <p className="text-xs text-gray-500 mt-0.5">{student.grade}</p>}
            </div>
            {lastRecord && <RecordBadge type={lastRecord.type} />}
          </div>
          {lastRecord ? (
            <p className="mt-2 text-xs text-gray-400">
              Last entry: {formatRelativeDate(lastRecord.date)}
              {lastRecord.notes && ` — ${lastRecord.notes.slice(0, 60)}${lastRecord.notes.length > 60 ? '…' : ''}`}
            </p>
          ) : (
            <p className="mt-2 text-xs text-gray-400">No records yet</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import StudentCard from '@/components/dashboard/StudentCard'
import EmptyState from '@/components/ui/EmptyState'
import { Student, StudentRecord } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('teacher_id', user.id)
    .eq('archived', false)
    .order('created_at', { ascending: false })

  // Fetch the most recent record per student
  const studentIds = (students ?? []).map((s: Student) => s.id)
  const lastRecordMap: { [key: string]: StudentRecord } = {}

  if (studentIds.length > 0) {
    const { data: recentRecords } = await supabase
      .from('records')
      .select('*')
      .in('student_id', studentIds)
      .order('date', { ascending: false })

    for (const record of recentRecords ?? []) {
      if (!lastRecordMap[record.student_id]) {
        lastRecordMap[record.student_id] = record
      }
    }
  }

  return (
    <>
      <PageHeader
        title="Your students"
        description={students?.length ? `${students.length} student${students.length !== 1 ? 's' : ''}` : undefined}
        action={
          <Link href="/students/new">
            <Button>Add student</Button>
          </Link>
        }
      />

      {!students?.length ? (
        <EmptyState
          title="No students yet"
          description="Add your first student to start tracking their behavior and progress."
          action={
            <Link href="/students/new">
              <Button>Add your first student</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student: Student) => (
            <StudentCard
              key={student.id}
              student={student}
              lastRecord={lastRecordMap[student.id] ?? null}
            />
          ))}
        </div>
      )}
    </>
  )
}

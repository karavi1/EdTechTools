import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import RecordTimeline from '@/components/records/RecordTimeline'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import ArchiveButton from '@/components/students/ArchiveButton'

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .eq('teacher_id', user.id)
    .single()

  if (!student) notFound()

  const { data: records } = await supabase
    .from('records')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false })

  return (
    <>
      <PageHeader
        title={student.name}
        description={[student.grade, `${records?.length ?? 0} record${records?.length !== 1 ? 's' : ''}`].filter(Boolean).join(' · ')}
        action={
          <div className="flex gap-2">
            <Link href={`/students/${studentId}/edit`}>
              <Button variant="secondary" size="sm">Edit</Button>
            </Link>
            <Link href={`/students/${studentId}/records/new`}>
              <Button size="sm">+ Log record</Button>
            </Link>
          </div>
        }
      />

      {student.notes && (
        <Card className="mb-6">
          <CardContent className="py-3">
            <p className="text-sm text-gray-600">{student.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-900">Record history</h2>
        </CardHeader>
        <CardContent className="pt-4">
          <RecordTimeline records={records ?? []} studentId={studentId} />
        </CardContent>
      </Card>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <ArchiveButton studentId={studentId} studentName={student.name} />
      </div>
    </>
  )
}

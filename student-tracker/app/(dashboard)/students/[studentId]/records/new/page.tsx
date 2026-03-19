import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import RecordForm from '@/components/records/RecordForm'
import { Card, CardContent } from '@/components/ui/Card'

export default async function NewRecordPage({
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
    .select('id, name')
    .eq('id', studentId)
    .eq('teacher_id', user.id)
    .single()

  if (!student) notFound()

  return (
    <>
      <PageHeader
        title="Log a record"
        description={`For ${student.name}`}
      />
      <Card className="max-w-lg">
        <CardContent>
          <RecordForm studentId={studentId} teacherId={user.id} />
        </CardContent>
      </Card>
    </>
  )
}

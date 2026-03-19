import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import StudentForm from '@/components/students/StudentForm'
import { Card, CardContent } from '@/components/ui/Card'

export default async function EditStudentPage({
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

  return (
    <>
      <PageHeader title="Edit student" />
      <Card className="max-w-lg">
        <CardContent>
          <StudentForm teacherId={user.id} student={student} />
        </CardContent>
      </Card>
    </>
  )
}

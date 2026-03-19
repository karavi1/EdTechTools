import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import StudentForm from '@/components/students/StudentForm'
import { Card, CardContent } from '@/components/ui/Card'

export default async function NewStudentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <>
      <PageHeader title="Add a student" />
      <Card className="max-w-lg">
        <CardContent>
          <StudentForm teacherId={user.id} />
        </CardContent>
      </Card>
    </>
  )
}

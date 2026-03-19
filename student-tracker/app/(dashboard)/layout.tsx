import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/auth/SignOutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-14">
          <Link href="/dashboard" className="text-lg font-bold text-indigo-600">
            Student Tracker
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/students/new" className="text-sm text-gray-600 hover:text-gray-900">
              + Add student
            </Link>
            <SignOutButton />
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}

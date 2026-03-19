'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

interface ArchiveButtonProps {
  studentId: string
  studentName: string
}

export default function ArchiveButton({ studentId, studentName }: ArchiveButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)

  async function handleArchive() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('students').update({ archived: true }).eq('id', studentId)
    router.push('/dashboard')
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600">Archive {studentName}? Their records will be preserved.</p>
        <Button variant="danger" size="sm" onClick={handleArchive} disabled={loading}>
          {loading ? 'Archiving…' : 'Yes, archive'}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => setConfirming(true)} className="text-gray-400 hover:text-red-600">
      Archive student
    </Button>
  )
}

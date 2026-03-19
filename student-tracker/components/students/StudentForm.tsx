'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Student } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface StudentFormProps {
  teacherId: string
  student?: Student
}

export default function StudentForm({ teacherId, student }: StudentFormProps) {
  const router = useRouter()
  const isEdit = !!student

  const [name, setName] = useState(student?.name ?? '')
  const [grade, setGrade] = useState(student?.grade ?? '')
  const [notes, setNotes] = useState(student?.notes ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    if (isEdit) {
      const { error } = await supabase
        .from('students')
        .update({ name: name.trim(), grade: grade.trim() || null, notes: notes.trim() || null })
        .eq('id', student.id)

      if (error) { setError(error.message); setLoading(false); return }
      router.push(`/students/${student.id}`)
    } else {
      const { data, error } = await supabase
        .from('students')
        .insert({ teacher_id: teacherId, name: name.trim(), grade: grade.trim() || null, notes: notes.trim() || null })
        .select('id')
        .single()

      if (error) { setError(error.message); setLoading(false); return }
      router.push(`/students/${data.id}`)
    }

    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="name"
        label="Student name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        required
      />
      <Input
        id="grade"
        label="Grade (optional)"
        type="text"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        placeholder="e.g. 5th Grade, Year 3"
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any context about this student…"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Add student'}
        </Button>
      </div>
    </form>
  )
}

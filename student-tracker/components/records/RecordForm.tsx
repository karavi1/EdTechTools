'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RECORD_TYPES } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface RecordFormProps {
  studentId: string
  teacherId: string
}

export default function RecordForm({ studentId, teacherId }: RecordFormProps) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const [type, setType] = useState('academic')
  const [date, setDate] = useState(today)
  const [notes, setNotes] = useState('')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from('records').insert({
      student_id: studentId,
      teacher_id: teacherId,
      type,
      date,
      notes: notes.trim() || null,
      value: value !== '' ? parseFloat(value) : null,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/students/${studentId}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Record type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RECORD_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                type === t.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        id="date"
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Describe what happened…"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <Input
        id="value"
        label="Score / value (optional)"
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. 85"
        step="any"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving…' : 'Save record'}
        </Button>
      </div>
    </form>
  )
}

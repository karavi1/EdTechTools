export interface Profile {
  id: string
  full_name: string | null
  school: string | null
  created_at: string
}

export interface Student {
  id: string
  teacher_id: string
  name: string
  grade: string | null
  notes: string | null
  archived: boolean
  created_at: string
}

export interface StudentRecord {
  id: string
  student_id: string
  teacher_id: string
  type: string
  date: string
  notes: string | null
  value: number | null
  created_at: string
}

export interface RecordWithStudent extends StudentRecord {
  students: Pick<Student, 'id' | 'name'>
}

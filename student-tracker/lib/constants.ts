export const RECORD_TYPES = [
  { value: 'academic',      label: 'Academic',       color: 'blue'   },
  { value: 'attendance',    label: 'Attendance',     color: 'yellow' },
  { value: 'participation', label: 'Participation',  color: 'green'  },
  { value: 'disciplinary',  label: 'Disciplinary',   color: 'red'    },
  { value: 'custom',        label: 'Custom',         color: 'gray'   },
] as const

export type RecordTypeValue = typeof RECORD_TYPES[number]['value']
export type RecordTypeColor = typeof RECORD_TYPES[number]['color']

export const RECORD_TYPE_MAP = Object.fromEntries(
  RECORD_TYPES.map((t) => [t.value, t])
) as Record<string, typeof RECORD_TYPES[number]>

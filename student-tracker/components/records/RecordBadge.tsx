import Badge from '@/components/ui/Badge'
import { RECORD_TYPE_MAP } from '@/lib/constants'

export default function RecordBadge({ type }: { type: string }) {
  const config = RECORD_TYPE_MAP[type] ?? { label: type, color: 'gray' }
  return <Badge label={config.label} color={config.color} />
}

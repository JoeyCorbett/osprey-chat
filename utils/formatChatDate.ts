import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns'

export function formatChatDate(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp

  if (isToday(date)) {
    return format(date, 'h:mm a')
  }

  let label: string

  if (isYesterday(date)) {
    label = 'Yesterday'
  } else if (isThisWeek(date, { weekStartsOn: 1 })) {
    label = format(date, 'EEEE')
  } else if (isThisYear(date)) {
    label = format(date, 'MMM d')
  } else {
    label = format(date, 'MMM d, yyyy')
  }

  const time = format(date, 'h:mm a')
  return `${label}, ${time}`
}

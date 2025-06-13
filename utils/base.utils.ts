import type { BaseDtoWithName } from "~/types/request.types";

export const formatOptions = (option: Partial<BaseDtoWithName>) => {
    return {
        label: option.name || "Не указано",
        value: option.id || "",
    };
}

export function priorityColor(priority: string | undefined): 'primary' | 'error' | 'warning' | 'neutral' {
  switch (priority) {
    case 'Высокий': return 'error'
    case 'Средний': return 'warning'
    case 'Низкий': return 'neutral'
    case 'Неотложный': return 'primary'
    default: return 'neutral'
  }
}
export function priorityLabel(priority: string | undefined): string {
  switch (priority) {
    case 'Высокий': return 'Высокий'
    case 'Средний': return 'Средний'
    case 'Низкий': return 'Низкий'
    case 'Неотложный': return 'Неотложный'
    default: return 'Не указан'
  }
}

export function toISODateString(dateStr: string | undefined | null): string | null {
  if (!dateStr) return null
  return dateStr.split('T')[0]
}
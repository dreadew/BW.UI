import { ref } from 'vue'

// Мок-реализация, заменить на реальный API при необходимости
export function useUserSessions() {
  async function getSessions(userId: string) {
    // Здесь должен быть реальный запрос к API
    return [
      {
        device: 'MacBook Pro',
        ip: '192.168.1.10',
        createdAt: '2025-05-01 12:00',
        lastActive: '2025-05-31 10:00',
        current: true
      },
      {
        device: 'iPhone',
        ip: '192.168.1.11',
        createdAt: '2025-04-20 09:00',
        lastActive: '2025-05-20 18:00',
        current: false
      }
    ]
  }
  return { getSessions }
}

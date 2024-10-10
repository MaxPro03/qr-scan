// services/userService.ts
import apiClient from './api'

export const fetchUsers = async () => {
  const response = await apiClient.get('/users')
  return response.data // Vue Query автоматически кеширует результат
}

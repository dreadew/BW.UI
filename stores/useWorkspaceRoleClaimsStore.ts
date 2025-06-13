import { defineStore } from 'pinia'
import { workspaceRoleClaimsServiceFactory } from '~/services/workspace/workspaceRoleClaimsServiceFactory'
import type { CreateWorkspaceRoleClaimsRequest, WorkspaceRoleClaimsDto, ListRequest } from '~/types/request.types'

export const useWorkspaceRoleClaimsStore = defineStore('workspaceRoleClaims', () => {
  const data = ref<WorkspaceRoleClaimsDto[]>([])
  const roleId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function list() {
    loading.value = true
    try {
      if (!roleId.value) return []
      const res = await workspaceRoleClaimsServiceFactory.listWorkspaceRoleClaims(roleId.value, { limit: 100, offset: 0, includeDeleted: false }).execute()
      data.value = res.data
      return res
    } catch (e) {
      error.value = (e as Error).message
      return []
    } finally {
      loading.value = false
    }
  }

  async function create(request: CreateWorkspaceRoleClaimsRequest) {
    loading.value = true
    try {
      await workspaceRoleClaimsServiceFactory.createWorkspaceRoleClaim(request).ensured('Клейм успешно добавлен')
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteClaim(id: string) {
    loading.value = true
    try {
      await workspaceRoleClaimsServiceFactory.deleteWorkspaceRoleClaim(id).ensured('Клейм успешно удалён')
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    } finally {
      loading.value = false
    }
  }

  return { data, roleId, loading, error, list, create, deleteClaim }
})

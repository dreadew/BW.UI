<template>
  <div>
    <UiHeading size="lg" class="mb-4">Активность (Списанное время)</UiHeading>
    <UButton color="primary" @click="openModal = true" class="mb-4">Списать время</UButton>
    <UCard v-for="activity in activities" :key="activity.id" class="mb-2">
      <UiText>{{ activity.userId }}</UiText>
      <UiText class="text-xs text-gray-400 mt-1">Время: {{ activity.workHours }} ч</UiText>
    </UCard>
    <UModal v-model:open="openModal" title="Списать время">
      <template #body>
        <UForm :state="formState" :schema="formSchema" @submit="onSubmitActivity">
          <UFormField label="Описание" name="description" required>
            <UInput v-model="formState.description" required placeholder="Описание" />
          </UFormField>
          <UFormField label="Проект" name="projectId" required>
            <UInput v-model="formState.projectId" required placeholder="ID проекта" />
          </UFormField>
          <UFormField label="Активность" name="activityId" required>
            <UInput v-model="formState.activityId" required placeholder="ID активности" />
          </UFormField>
          <UFormField label="От кого" name="fromId" required>
            <UInput v-model="formState.fromId" required placeholder="ID отправителя" />
          </UFormField>
          <UFormField label="Дата" name="date" required>
            <UInput v-model="formState.date" required placeholder="Дата" type="date" />
          </UFormField>
          <UFormField label="Время (часы)" name="workHours" required>
            <UInput v-model="formState.workHours" required placeholder="Время" type="number" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="loading">Списать</UButton>
        </UForm>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskActivityStore } from '~/stores/useTaskActivityStore'
import type { TaskActivityDto } from '~/types/response.types'
definePageMeta({ layout: 'project' })
const route = useRoute()
const taskId = route.params.taskId
const activityStore = useTaskActivityStore()
const activities = ref<TaskActivityDto[]>([])
onMounted(async () => {
  activities.value = await activityStore.listByTask(taskId as string)
})
const openModal = ref(false)
const formState = ref({
  description: '',
  projectId: '',
  activityId: '',
  fromId: '',
  date: '',
  workHours: 0
})
const formSchema = {
  description: { required: true },
  projectId: { required: true },
  activityId: { required: true },
  fromId: { required: true },
  date: { required: true },
  workHours: { required: true }
}
const loading = ref(false)
const onSubmitActivity = async () => {
  loading.value = true
  try {
    await activityStore.create({
      projectId: formState.value.projectId,
      taskId: taskId as string,
      activityId: formState.value.activityId,
      fromId: formState.value.fromId,
      date: formState.value.date,
      workHours: Number(formState.value.workHours)
    })
    activities.value = await activityStore.listByTask(String(taskId))
    openModal.value = false
    formState.value = { description: '', projectId: '', activityId: '', fromId: '', date: '', workHours: 0 }
  } finally {
    loading.value = false
  }
}
</script>

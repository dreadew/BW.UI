<template>
  <div>
    <UiHeading size="lg" class="mb-4">Активность (Списанное время)</UiHeading>
    <UButton color="primary" @click="openModal = true" class="mb-4">Списать время</UButton>
    <UCard v-for="activity in activities" :key="activity.id" class="mb-2">
      <UiText>{{ activity.description }}</UiText>
      <UiText class="text-xs text-gray-400 mt-1">Время: {{ activity.timeSpent }} ч</UiText>
    </UCard>
    <!-- Модальное окно для списания времени -->
    <UModal v-model:open="openModal" title="Списать время">
      <template #body>
        <UForm :state="formState" :schema="formSchema" @submit="onSubmitActivity">
          <UFormField label="Описание" name="description" required>
            <UInput v-model="formState.description" required placeholder="Описание" />
          </UFormField>
          <UFormField label="Время (часы)" name="timeSpent" required>
            <UInput v-model="formState.timeSpent" required placeholder="Время" type="number" />
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
const route = useRoute()
const taskId = route.params.taskId
const activityStore = useTaskActivityStore()
const activities = ref([])
onMounted(async () => {
  activities.value = await activityStore.listByTask(taskId)
})
const openModal = ref(false)
const formState = ref({
  description: '',
  timeSpent: null
})
const formSchema = {
  description: { required: true },
  timeSpent: { required: true }
}
const loading = ref(false)
const onSubmitActivity = async () => {
  loading.value = true
  try {
    await activityStore.createActivity({ ...formState.value, taskId })
    activities.value = await activityStore.listByTask(taskId)
    openModal.value = false
    formState.value = { description: '', timeSpent: null }
  } catch (error) {
    console.error('Ошибка при списании времени:', error)
  } finally {
    loading.value = false
  }
}
</script>

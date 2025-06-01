<template>
  <div>
    <UiHeading size="lg" class="mb-4">Оценки задачи</UiHeading>
    <UButton color="primary" @click="openCreateModal = true" class="mb-4">Добавить оценку</UButton>
    <UCard v-for="evaluation in evaluations" :key="evaluation.id" class="mb-2">
      <UiText>{{ evaluation.taskId }}</UiText>
      <UiText class="text-xs text-gray-400 mt-1">Оценил: {{ evaluation.id }} | {{ evaluation.createdAt }}</UiText>
    </UCard>
    <UModal v-model:open="openCreateModal" title="Добавить/Редактировать оценку">
      <template #body>
        <UForm :state="formState" :schema="formSchema" @submit="onSubmitEvaluation">
          <UFormField label="Оценка" name="value" required>
            <UInput v-model="formState.value" required placeholder="Оценка" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openDeleteModal" title="Удалить оценку?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить оценку?</UiText>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="openDeleteModal = false">Отмена</UButton>
          <UButton color="error" @click="onDeleteEvaluation" :loading="loading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskEvaluationStore } from '~/stores/useTaskEvaluationStore'
import type { TaskEvaluationDto } from '~/types/response.types'
const route = useRoute()
const taskId = route.params.taskId
const evaluationStore = useTaskEvaluationStore()
const evaluations = ref<TaskEvaluationDto[]>([])
onMounted(async () => {
  evaluations.value = (await evaluationStore.list(taskId as string)) || []
})
const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const formState = ref({
  value: '',
})
const formSchema = {
  type: 'object',
  properties: {
    value: { type: 'string', minLength: 1, maxLength: 5 },
  },
}
const loading = ref(false)
const selectedEvaluation = ref<TaskEvaluationDto | null>(null)

const onSubmitEvaluation = async () => {
  loading.value = true
  try {
    const success = await evaluationStore.create({
      taskId: taskId as string,
      activityId: 'default', // TODO: заменить на реальный id активности
      hours: Number(formState.value.value)
    })
    if (success) {
      evaluations.value = (await evaluationStore.list(taskId as string)) || []
    }
  } finally {
    loading.value = false
    openCreateModal.value = false
    formState.value = { value: '' }
  }
}
const onDeleteEvaluation = async () => {
  if (!selectedEvaluation.value) return
  loading.value = true
  try {
    const success = await evaluationStore.deleteEvaluation(selectedEvaluation.value.id)
    if (success) {
      evaluations.value = (await evaluationStore.list(taskId as string)) || []
    }
  } finally {
    loading.value = false
    openDeleteModal.value = false
    selectedEvaluation.value = null
  }
}
</script>

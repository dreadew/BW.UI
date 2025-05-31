<template>
  <div>
    <UiHeading size="lg" class="mb-4">Оценки задачи</UiHeading>
    <UButton color="primary" @click="openCreateModal = true" class="mb-4">Добавить оценку</UButton>
    <UCard v-for="evaluation in evaluations" :key="evaluation.id" class="mb-2">
      <UiText>{{ evaluation.value }}</UiText>
      <UiText class="text-xs text-gray-400 mt-1">Оценил: {{ evaluation.authorName }} | {{ evaluation.createdAt }}</UiText>
    </UCard>
    <!-- Модальное окно для создания/редактирования/удаления оценки -->
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
          <UButton color="danger" @click="onDeleteEvaluation" :loading="loading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskEvaluationStore } from '~/stores/useTaskEvaluationStore'
const route = useRoute()
const taskId = route.params.taskId
const evaluationStore = useTaskEvaluationStore()
const evaluations = ref([])
onMounted(async () => {
  evaluations.value = await evaluationStore.listByTask(taskId)
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
const onSubmitEvaluation = async () => {
  loading.value = true
  try {
    // Логика сохранения оценки
  } finally {
    loading.value = false
    openCreateModal.value = false
  }
}
const onDeleteEvaluation = async () => {
  loading.value = true
  try {
    // Логика удаления оценки
  } finally {
    loading.value = false
    openDeleteModal.value = false
  }
}
</script>

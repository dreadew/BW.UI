<template>
  <UModal v-model:open="open" title="Создать задачу">
    <template #body>
      <UForm :state="formState" :schema="formSchema" @submit="onSubmit">
        <UFormField label="ID" name="id" required>
          <UInput v-model="formState.id" required placeholder="ID задачи" />
        </UFormField>
        <UFormField label="Название" name="name" required>
          <UInput v-model="formState.name" required placeholder="Название задачи" />
        </UFormField>
        <UFormField label="Архивировать?" name="isArchived" required>
          <UCheckbox v-model="formState.isArchived" label="Архивировать" />
        </UFormField>
        <UFormField label="Дата начала" name="startedDate" required>
          <UInput v-model="formState.startedDate" required placeholder="Дата начала (YYYY-MM-DD)" />
        </UFormField>
        <UFormField label="Дата окончания" name="endDate" required>
          <UInput v-model="formState.endDate" required placeholder="Дата окончания (YYYY-MM-DD)" />
        </UFormField>
        <UFormField label="Тип приоритета" name="priorityTypeId">
          <select v-model="formState.priorityTypeId" class="u-input">
            <option value="">Не выбран</option>
            <option v-for="option in priorityTypeOptions" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </UFormField>
        <UFormField label="Тип активности" name="activityTypeId">
          <select v-model="formState.activityTypeId" class="u-input">
            <option value="">Не выбран</option>
            <option v-for="option in activityTypeOptions" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </UFormField>
        <UFormField label="Тип отношения" name="relationTypeId">
          <select v-model="formState.relationTypeId" class="u-input">
            <option value="">Не выбран</option>
            <option v-for="option in relationTypeOptions" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </UFormField>
        <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { createTaskRequestSchema } from '~/schemas/generated.schema'
import { priorityTypeServiceFactory } from '~/services/project/priorityTypeServiceFactory'
import { activityTypeServiceFactory } from '~/services/project/activityTypeServiceFactory'
import { relationTypeServiceFactory } from '~/services/project/relationTypeServiceFactory'
import type { PriorityTypeDto, ActivityTypeDto, RelationTypeDto } from '~/types/response.types'
const props = defineProps({
  open: Boolean,
  loading: Boolean,
  onSubmit: Function
})
const emit = defineEmits(['update:open', 'submit'])
const formState = ref({
  id: '',
  name: '',
  isArchived: false,
  startedDate: '',
  endDate: '',
  priorityTypeId: '',
  activityTypeId: '',
  relationTypeId: ''
})
const formSchema = createTaskRequestSchema;
const priorityTypeOptions = ref<PriorityTypeDto[]>([])
const activityTypeOptions = ref<ActivityTypeDto[]>([])
const relationTypeOptions = ref<RelationTypeDto[]>([])

const loadOptions = async () => {
  try {
    const [priorityRes, activityRes, relationRes] = await Promise.all([
      priorityTypeServiceFactory.list().execute(),
      activityTypeServiceFactory.list().execute(),
      relationTypeServiceFactory.list().execute()
    ])
    priorityTypeOptions.value = priorityRes || []
    activityTypeOptions.value = activityRes || []
    relationTypeOptions.value = relationRes || []
  } catch (e) {
    // handle error (optional)
  }
}
onMounted(loadOptions)
watch(() => props.open, (val) => {
  if (!val) {
    formState.value = {
      id: '',
      name: '',
      isArchived: false,
      startedDate: '',
      endDate: '',
      priorityTypeId: '',
      activityTypeId: '',
      relationTypeId: ''
    }
  } else {
    loadOptions()
  }
})
const onSubmit = () => emit('submit', formState.value)
</script>

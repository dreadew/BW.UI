<template>
  <UModal :open="open" @update:open="emit('update:open', $event)" title="Создать задачу">
    <template #body>
      <UForm class="space-y-4" :state="formState" :schema="formSchema" @submit="onSubmit">
        <UFormField label="Название" name="name" required>
          <UInput class="w-full" v-model="formState.name" required placeholder="Название задачи" />
        </UFormField>
        <UFormField label="Описание" name="content" required>
          <UInput class="w-full" v-model="formState.content" required placeholder="Описание задачи" />
        </UFormField>
        <UFormField label="Секция" name="sectionId" required>
          <USelect :loading="sectionStore.loading" :disabled="sectionStore.loading" v-model="formState.sectionId"
            :items="sectionOptions" placeholder="Выберите секцию" class="w-full" />
        </UFormField>
        <UFormField label="Приоритет" name="priorityTypeId" required>
          <USelect :loading="isPrioritiesLoading" :disabled="isPrioritiesLoading" v-model="formState.priorityTypeId"
            :items="priorityOptions" placeholder="Выберите приоритет" class="w-full" />
        </UFormField>
        <UFormField label="Исполнитель" name="userId" required>
          <USelect v-model="formState.userId" :loading="userStore.loading" :disabled="userStore.loading"
            :items="userOptions" placeholder="Выберите пользователя" class="w-full" />
        </UFormField>
        <UFormField label="Дата начала" name="startedDate">
          <UPopover class="w-full">
            <UButton color="neutral" icon="i-lucide-calendar">
              {{ startedDateModel ? (startedDateModel ? df.format(startedDateModel.toDate(getLocalTimeZone())) :
                'Выбрать дату') : 'Выбрать дату' }}
            </UButton>
            <template #content>
              <UCalendar v-model="startedDateModel" class="p-2" />
            </template>
          </UPopover>
        </UFormField>
        <UFormField label="Дата окончания" name="endDate">
          <UPopover class="w-full">
            <UButton color="neutral" icon="i-lucide-calendar">
              {{ endDateModel ? (endDateModel ? df.format(endDateModel.toDate(getLocalTimeZone())) : 'Выбрать дату') :
                `Выбрать
              дату` }}
            </UButton>
            <template #content>
              <UCalendar v-model="endDateModel" class="p-2" />
            </template>
          </UPopover>
        </UFormField>
        <UButton type="submit" color="primary" class="mt-4 float-right" :loading="loading">Создать</UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { z } from 'zod'
import { useUserStore } from '~/stores/useUserStore'
import { priorityTypeServiceFactory } from '~/services/project/priorityTypeServiceFactory'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'
import { shallowRef } from 'vue'
import type { BaseSoftDeletableDtoWithName, CreateTaskRequest } from '~/types/request.types'
import type { Option } from '~/types/common.types'

const props = defineProps<{
  open: boolean;
  loading: boolean;
  sectionId: string;
  id: string;
  onSubmit: (data: CreateTaskRequest) => void;
}>()
const route = useRoute()
const projectId = computed(() => route.params.id as string)
const emit = defineEmits(['update:open', 'submit'])

const formState = ref<CreateTaskRequest>({
  id: props.id,
  sectionId: props.sectionId,
  name: '',
  content: '',
  priorityTypeId: '',
  userId: '',
  startedDate: '',
  endDate: ''
})

const formSchema = z.object({
  name: z.string().min(3, 'Минимум 3 символа'),
  content: z.string().min(3, 'Минимум 3 символа'),
  sectionId: z.string().min(1, 'Обязательное поле'),
  priorityTypeId: z.string().min(1, 'Обязательное поле'),
  userId: z.string().min(1, 'Обязательное поле'),
  startedDate: z.string().optional(),
  endDate: z.string().optional()
})

const userStore = useUserStore()
const sectionStore = useSectionStore()
sectionStore.projectId = projectId.value

const isPrioritiesLoading = ref(false)
const userOptions = computed(() => userStore.data
  .map(u => formatOptions(u)))
const priorityOptions = ref<Option[]>([])
const sectionOptions = computed(() => sectionStore.data
  .map(s => formatOptions(s)))

async function fetchOptions() {
  await userStore.list()
  await sectionStore.listByProject()
  isPrioritiesLoading.value = true;
  try {
    const priorities = await priorityTypeServiceFactory.list({ limit: 100, offset: 0, includeDeleted: false }).execute()
    priorityOptions.value = priorities.map((p: BaseSoftDeletableDtoWithName) => ({
      label: p.name,
      value: p.id
    }))
  } finally {
    isPrioritiesLoading.value = false;
  }
}

const df = new DateFormatter('ru-RU', { dateStyle: 'medium' })
const startedDateModel = shallowRef(formState.value.startedDate ? parseDate(formState.value.startedDate) : null)
const endDateModel = shallowRef(formState.value.endDate ? parseDate(formState.value.endDate) : null)

watch(() => startedDateModel.value, (val) => {
  formState.value.startedDate = val ? val.toDate(getLocalTimeZone()).toISOString() : ''
})

watch(() => endDateModel.value, (val) => {
  formState.value.endDate = val ? val.toDate(getLocalTimeZone()).toISOString() : ''
})

watch(() => props.open, (val) => {
  if (val) fetchOptions()
  if (!val) {
    formState.value = { ...formState.value, sectionId: props.sectionId || '', name: '', content: '', priorityTypeId: '', userId: '', startedDate: '', endDate: '' }
    startedDateModel.value = null
    endDateModel.value = null
  }
})

const onSubmit = () => emit('submit', formState.value)
</script>

<template>
  <UModal :open="open" @update:open="emit('update:open', $event)" title="Редактировать задачу">
    <template #body>
      <UForm class="space-y-4" :state="formState" @submit="onSubmit">
        <UFormField label="Название" name="name" required>
          <UInput class="w-full" v-model="formState.name" required placeholder="Название задачи" />
        </UFormField>
        <UFormField label="Описание" name="content" required>
          <UInput class="w-full" v-model="formState.content" required placeholder="Описание задачи" />
        </UFormField>
        <UFormField label="Секция" name="sectionId" required>
          <USelect class="w-full" v-model="formState.sectionId" :items="sectionOptions" placeholder="Выберите секцию" />
        </UFormField>
        <UFormField label="Приоритет" name="priorityTypeId" required>
          <USelect :loading="isPrioritiesLoading" :disabled="isPrioritiesLoading" v-model="formState.priorityTypeId"
            :items="priorityOptions" placeholder="Выберите приоритет" class="w-full" />
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
        <UFormField label="Аналитик" name="analyticId">
          <USelect v-model="formState.analyticId" :loading="userStore.loading" :disabled="userStore.loading"
            :items="userOptions" placeholder="Выберите аналитика" class="w-full" />
        </UFormField>
        <UButton type="submit" color="primary" class="mt-4 float-right" :loading="loading">Сохранить</UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, watch, shallowRef, computed } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { priorityTypeServiceFactory } from '~/services/project/priorityTypeServiceFactory'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'
import type { BaseSoftDeletableDtoWithName, UpdateTaskRequest } from '~/types/request.types'
import { useSectionStore } from '~/stores/useSectionStore'
import type { Option } from '~/types/common.types'

const props = defineProps<{
  open: boolean;
  loading: boolean;
  task: UpdateTaskRequest;
}>()
const emit = defineEmits(['update:open', 'submit'])
const formState = ref<UpdateTaskRequest>({ ...props.task, analyticId: props.task?.analyticId ?? '' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const userStore = useUserStore()
const sectionStore = useSectionStore()
sectionStore.projectId = projectId.value

const isPrioritiesLoading = ref(false)
const priorityOptions = ref<Option[]>([])
const sectionOptions = computed(() => sectionStore.data
  .map(s => formatOptions(s)));
const userOptions = computed(() => userStore.data.map(u => formatOptions(u)))

async function fetchOptions() {
  await userStore.list()
  await sectionStore.listByProject()
  formState.value.sectionId = sectionStore.data
    .find(s => s.id === props.task.sectionId)?.id

  isPrioritiesLoading.value = true;
  try {
    const priorities = await priorityTypeServiceFactory.list({ limit: 100, offset: 0, includeDeleted: false }).execute()
    priorityOptions.value = (priorities || []).map((p: BaseSoftDeletableDtoWithName) => ({
      label: p.name,
      value: p.id
    }))
  } finally {
    isPrioritiesLoading.value = false;
  }
}

const df = new DateFormatter('ru-RU', { dateStyle: 'medium' })

const startedDateModel = shallowRef(formState.value.startedDate ? parseDate(toISODateString(formState.value.startedDate)!) : null)
const endDateModel = shallowRef(formState.value.endDate ? parseDate(toISODateString(formState.value.endDate)!) : null)

watch(() => startedDateModel.value, (val) => {
  formState.value.startedDate = val ? val.toDate(getLocalTimeZone()).toISOString() : ''
})

watch(() => endDateModel.value, (val) => {
  formState.value.endDate = val ? val.toDate(getLocalTimeZone()).toISOString() : ''
})

watch(() => props.open, (val) => {
  if (val && props.task) {
    formState.value = { ...props.task, analyticId: props.task.analyticId ?? undefined }
    startedDateModel.value = props.task.startedDate ? parseDate(toISODateString(props.task.startedDate)!) : null
    endDateModel.value = props.task.endDate ? parseDate(toISODateString(props.task.endDate)!) : null
    fetchOptions().then(() => {
      // sectionId подставляется только если есть в списке секций
      const foundSection = sectionStore.data.find(s => s.id === props.task.sectionId)
      formState.value.sectionId = foundSection ? foundSection.id : ''
    })
  }
})

const onSubmit = () => emit('submit', formState.value)
</script>

<template>
  <UModal v-model:open="open" title="Создать тред">
    <template #body>
      <UForm :state="formState" :schema="formSchema" @submit="onSubmit">
        <UFormField label="Заголовок" name="title" required>
          <UInput v-model="formState.title" required placeholder="Заголовок треда" />
        </UFormField>
        <UFormField label="Текст" name="text" required>
          <UInput v-model="formState.text" required placeholder="Текст треда" />
        </UFormField>
        <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { createProjectThreadRequestSchema } from '~/schemas/generated.schema'
import type { CreateProjectThreadRequest } from '~/types/request.types'
const props = defineProps<{
  open: boolean;
  loading: boolean;
  onSubmit: (data: CreateProjectThreadRequest) => void;
}>()

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const emit = defineEmits(['update:open', 'submit'])
const formState = ref<CreateProjectThreadRequest>({
  id: projectId.value || '',
  title: '',
  text: ''
})

const formSchema = createProjectThreadRequestSchema;

watch(() => props.open, (val) => { if (!val) formState.value = { id: projectId.value || '', title: '', text: '' } })

const onSubmit = () => emit('submit', formState.value)
</script>

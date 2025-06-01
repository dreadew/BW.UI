<template>
  <div>
    <UiHeading size="xl" class="mb-6">Тред</UiHeading>
    <UCard v-if="thread">
      <UiHeading size="md">{{ thread.title }}</UiHeading>
      <UiText>{{ thread.text }}</UiText>
      <UiText color="neutral" size="xs" class="mt-2">Создано: {{ thread.createdAt }}</UiText>
    </UCard>
    <div class="mt-8">
      <UiHeading size="lg" class="mb-2">Комментарии</UiHeading>
      <UCard v-for="comment in comments" :key="comment.id" class="mb-2">
        <UiText>{{ comment.text }}</UiText>
        <UiText color="neutral" size="xs" class="mt-1">Автор: {{ comment.userId }} | {{ comment.createdAt }}</UiText>
      </UCard>
      <UForm :state="formState" @submit="onSubmitComment" class="mt-4 flex gap-2">
        <UInput v-model="newComment" placeholder="Добавить комментарий..." class="flex-1" />
        <UButton type="submit" color="primary">Отправить</UButton>
      </UForm>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectThreadStore } from '~/stores/useProjectThreadStore'
import { useProjectThreadCommentStore } from '~/stores/useProjectThreadCommentStore'
import type { ProjectThreadCommentDto, ProjectThreadDto } from '~/types/response.types'
const route = useRoute()
const projectId = route.params.id
const threadId = route.params.threadId
const { user } = useUserStore();
const threadStore = useProjectThreadStore()
const commentStore = useProjectThreadCommentStore()
const thread = ref<ProjectThreadDto | null>(null)
const comments = ref<ProjectThreadCommentDto[]>([])
const newComment = ref('')
const formState = ref({})

onMounted(async () => {
  thread.value = await threadStore.get(threadId as string)
  comments.value = await commentStore.list(threadId as string, {})
})
const onSubmitComment = async () => {
  if (!newComment.value) return
  await commentStore.create({ threadId: threadId as string, text: newComment.value, fromId: user?.id as string })
  comments.value = await commentStore.list(threadId as string, {})
  newComment.value = ''
}
</script>

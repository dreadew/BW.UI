<template>
  <div>
    <UiHeading size="xl" class="mb-6">Тред</UiHeading>
    <UCard v-if="thread">
      <UiHeading size="md">{{ thread.title }}</UiHeading>
      <UiText>{{ thread.description }}</UiText>
      <UiText class="text-xs text-gray-400 mt-2">Создано: {{ thread.createdAt }}</UiText>
    </UCard>
    <div class="mt-8">
      <UiHeading size="lg" class="mb-2">Комментарии</UiHeading>
      <UCard v-for="comment in comments" :key="comment.id" class="mb-2">
        <UiText>{{ comment.text }}</UiText>
        <UiText class="text-xs text-gray-400 mt-1">Автор: {{ comment.authorName }} | {{ comment.createdAt }}</UiText>
      </UCard>
      <UForm @submit="onSubmitComment" class="mt-4 flex gap-2">
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
const route = useRoute()
const projectId = route.params.id
const threadId = route.params.threadId
const threadStore = useProjectThreadStore()
const commentStore = useProjectThreadCommentStore()
const thread = ref(null)
const comments = ref([])
const newComment = ref('')
onMounted(async () => {
  thread.value = await threadStore.getById(threadId)
  comments.value = await commentStore.listByThread(threadId)
})
const onSubmitComment = async () => {
  if (!newComment.value) return
  await commentStore.create({ threadId, text: newComment.value })
  comments.value = await commentStore.listByThread(threadId)
  newComment.value = ''
}
</script>

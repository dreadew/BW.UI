<template>
  <div>
    <UiHeading size="lg" class="mb-4">Комментарии</UiHeading>
    <UCard v-for="comment in comments" :key="comment.id" class="mb-2">
      <UiText>{{ comment.text }}</UiText>
      <UiText class="text-xs text-gray-400 mt-1">Автор: {{ comment.authorName }} | {{ comment.createdAt }}</UiText>
    </UCard>
    <UForm @submit="onSubmitComment" class="mt-4 flex gap-2">
      <UInput v-model="newComment" placeholder="Добавить комментарий..." class="flex-1" />
      <UButton type="submit" color="primary">Отправить</UButton>
    </UForm>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskCommentStore } from '~/stores/useTaskCommentStore'
const route = useRoute()
const taskId = route.params.taskId
const commentStore = useTaskCommentStore()
const comments = ref([])
const newComment = ref('')
onMounted(async () => {
  comments.value = await commentStore.listByTask(taskId)
})
const onSubmitComment = async () => {
  if (!newComment.value) return
  await commentStore.create({ taskId, text: newComment.value })
  comments.value = await commentStore.listByTask(taskId)
  newComment.value = ''
}
</script>

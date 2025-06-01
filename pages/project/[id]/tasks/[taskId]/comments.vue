<template>
  <div>
    <UiHeading size="lg" class="mb-4">Комментарии</UiHeading>
    <UCard v-for="comment in comments" :key="comment.id" class="mb-2">
      <UiText>{{ comment.content }}</UiText>
      <UiText class="text-xs text-gray-400 mt-1">Автор: {{ comment.author.user?.username }} | {{ comment.createdAt }}</UiText>
    </UCard>
    <UForm :state="formState" :schema="formSchema" @submit="onSubmitComment" class="mt-4 flex gap-2">
      <UInput v-model="newComment" placeholder="Добавить комментарий..." class="flex-1" />
      <UButton type="submit" color="primary">Отправить</UButton>
    </UForm>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskCommentStore } from '~/stores/useTaskCommentStore'
import { useUserStore } from '~/stores/useUserStore'
import type { TaskCommentDto } from '~/types/response.types'
definePageMeta({ layout: 'project' })
const route = useRoute()
const taskId = route.params.taskId
const commentStore = useTaskCommentStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const comments = ref<TaskCommentDto[]>([])
const newComment = ref('')
const formState = ref({ content: '', authorId: '' })
const formSchema = {/* ...schema для комментария... */}
onMounted(async () => {
  comments.value = await commentStore.listByTask(taskId as string)
})
const onSubmitComment = async () => {
  if (!newComment.value) return
  await commentStore.create({
    taskId: taskId as string,
    content: formState.value.content,
    authorId: formState.value.authorId
  })
  comments.value = await commentStore.listByTask(taskId as string)
  newComment.value = ''
}
</script>

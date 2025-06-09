<template>
    <div class="project-tasks-layout flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div class="flex-1 px-2 md:px-8 py-8 max-w-5xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Задачи проекта</h1>
                <UButton color="primary" icon="i-heroicons-plus" @click="openTaskDialog()">Создать задачу</UButton>
            </div>
            <div class="grid gap-6">
                <TaskCard v-for="task in tasks" :key="task.id" :task="task" @edit="openTaskDialog(task)"
                    @delete="openDeleteTaskDialog(task)" @add-comment="openCommentDialog(task)"
                    @edit-comment="openEditCommentDialog(task, $event)"
                    @delete-comment="openDeleteCommentDialog(task, $event)" @add-eval="openEvalDialog(task)"
                    @edit-eval="openEditEvalDialog(task, $event)" @delete-eval="openDeleteEvalDialog(task, $event)"
                    @upload-file="openUploadDialog(task, $event)" />
            </div>
        </div>
        <TaskDialogs v-bind="dialogsState" @close="closeAllDialogs" @save-task="handleSaveTask"
            @delete-task="handleDeleteTask" @save-comment="handleSaveComment" @delete-comment="handleDeleteComment"
            @save-eval="handleSaveEval" @delete-eval="handleDeleteEval" @upload-file="handleUploadFile" />
        <UNotifications />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import TaskCard from '~/components/test-ui/TaskCard.vue'
import TaskDialogs from '~/components/test-ui/TaskDialogs.vue'
import type { TaskDto, TaskCommentDto, TaskEvaluationDto, TaskDirectoryDto } from '~/types/request.types'

// Фейковые задачи
const tasks = ref<TaskDto[]>([])
// dialogsState: reactive объект для управления всеми диалогами (создание/редактирование/удаление задачи, комментария, оценки, загрузка файла)
const dialogsState = reactive({
    showTask: false,
    showDeleteTask: false,
    showComment: false,
    showDeleteComment: false,
    showEval: false,
    showDeleteEval: false,
    showUpload: false,
    task: null,
    comment: null,
    eval: null,
    directory: null,
    file: null,
})
function openTaskDialog(task = null) {
    dialogsState.showTask = true
    dialogsState.task = task
}
function openDeleteTaskDialog(task) {
    dialogsState.showDeleteTask = true
    dialogsState.task = task
}
function openCommentDialog(task) {
    dialogsState.showComment = true
    dialogsState.task = task
    dialogsState.comment = null
}
function openEditCommentDialog(task, comment) {
    dialogsState.showComment = true
    dialogsState.task = task
    dialogsState.comment = comment
}
function openDeleteCommentDialog(task, comment) {
    dialogsState.showDeleteComment = true
    dialogsState.task = task
    dialogsState.comment = comment
}
function openEvalDialog(task) {
    dialogsState.showEval = true
    dialogsState.task = task
    dialogsState.eval = null
}
function openEditEvalDialog(task, evalItem) {
    dialogsState.showEval = true
    dialogsState.task = task
    dialogsState.eval = evalItem
}
function openDeleteEvalDialog(task, evalItem) {
    dialogsState.showDeleteEval = true
    dialogsState.task = task
    dialogsState.eval = evalItem
}
function openUploadDialog(task, directory) {
    dialogsState.showUpload = true
    dialogsState.task = task
    dialogsState.directory = directory
}
function closeAllDialogs() {
    Object.keys(dialogsState).forEach(k => {
        if (typeof dialogsState[k] === 'boolean') dialogsState[k] = false
        else dialogsState[k] = null
    })
}
// Методы handleSaveTask, handleDeleteTask, handleSaveComment, handleDeleteComment, handleSaveEval, handleDeleteEval, handleUploadFile реализуют работу с фейковыми данными
function handleSaveTask(task) {/* ... */ }
function handleDeleteTask(task) {/* ... */ }
function handleSaveComment(comment) {/* ... */ }
function handleDeleteComment(comment) {/* ... */ }
function handleSaveEval(evalItem) {/* ... */ }
function handleDeleteEval(evalItem) {/* ... */ }
function handleUploadFile(file) {/* ... */ }
</script>

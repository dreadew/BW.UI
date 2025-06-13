<template>
  <div class="flex items-center gap-6 mb-6">
    <div class="relative">
      <template v-if="user.path">
        <img :src="user.path" class="w-24 h-24 rounded-full object-cover" alt="Аватар" />
        <UButton icon="i-heroicons-trash" color="error" size="xs" class="absolute bottom-0 right-0"
          @click="$emit('delete-avatar')" title="Удалить аватарку" />
      </template>
      <template v-else>
        <div
          class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 select-none">
          {{ user.username?.charAt(0).toUpperCase() || '?' }}
        </div>
      </template>
      <UButton icon="i-heroicons-camera" color="primary" size="xs" class="absolute bottom-0 left-0"
        @click="$emit('upload-avatar')" title="Загрузить аватарку" />
    </div>
    <div>
      <UiHeading size="lg">{{ user.username }}</UiHeading>
      <UiText color="neutral">{{ user.email }}</UiText>
      <UiText color="neutral">ID: {{ user.id }}</UiText>
    </div>
    <div class="ml-auto flex gap-2">
      <UButton color="primary" @click="$emit('edit')">Редактировать</UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UserDto } from '~/types/request.types';

defineProps<{ user: UserDto }>()
</script>

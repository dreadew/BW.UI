<template>
  <div class="w-full max-w-sm mx-auto">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold">Регистрация</h2>
      <p class="text-gray-500 mt-1">Заполните все поля для создания аккаунта</p>
    </div>
    <AuthRegisterForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
});
</script>

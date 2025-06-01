<script setup lang="ts">
import { reactive, ref } from 'vue';

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const isSubmitted = ref(false);
const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function handleSubmit() {
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });

  let hasErrors = false;

  if (!form.name) {
    errors.name = 'Name is required';
    hasErrors = true;
  }

  if (!form.email) {
    errors.email = 'Email is required';
    hasErrors = true;
  } else if (!validateEmail(form.email)) {
    errors.email = 'Please enter a valid email';
    hasErrors = true;
  }

  if (!form.subject) {
    errors.subject = 'Subject is required';
    hasErrors = true;
  }

  if (!form.message) {
    errors.message = 'Message is required';
    hasErrors = true;
  } else if (form.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
    hasErrors = true;
  }

  if (hasErrors) {
    return;
  }

  isSubmitting.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    isSubmitted.value = true;
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="bg-card p-6 rounded-lg shadow-sm border border-secondary/10">
    <h2 class="text-2xl font-bold mb-6">Отправьте нам сообщение</h2>

    <div v-if="isSubmitted" class="p-4 mb-4 bg-primary/10 text-primary rounded-md">
      <p>Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.</p>
    </div>

    <UForm v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-1">
        <label for="name" class="text-sm font-medium">Имя</label>
        <UInput id="name" v-model="form.name" type="text"
          class="w-full" :class="{ 'border-destructive': errors.name }" />
        <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
      </div>

      <div class="space-y-1">
        <label for="email" class="text-sm font-medium">Эл. почта</label>
        <UInput id="email" v-model="form.email" type="email"
          class="w-full" :class="{ 'border-destructive': errors.email }" />
        <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
      </div>

      <div class="space-y-1">
        <label for="subject" class="text-sm font-medium">Тема</label>
        <UInput id="subject" v-model="form.subject" type="text"
          class="w-full" :class="{ 'border-destructive': errors.subject }" />
        <p v-if="errors.subject" class="text-sm text-destructive">{{ errors.subject }}</p>
      </div>

      <div class="space-y-1">
        <label for="message" class="text-sm font-medium">Сообщение</label>
        <UTextarea id="message" v-model="form.message" rows="5"
          class="w-full" :class="{ 'border-destructive': errors.message }" />
        <p v-if="errors.message" class="text-sm text-destructive">{{ errors.message }}</p>
      </div>

      <UButton type="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="mr-2">
          <svg class="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </span>
        {{ isSubmitting ? 'Sending...' : 'Отправить' }}
      </UButton>
    </UForm>
  </div>
</template>
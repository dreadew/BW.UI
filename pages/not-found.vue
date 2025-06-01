<template>
    <div class="flex flex-col items-center justify-center min-h-[60vh]">
        <UCard class="flex flex-col items-center justify-center p-8">
            <UIcon name="i-lucide-alert-triangle" class="text-5xl text-primary mb-4" />
            <UiHeading size="2xl">Страница не найдена</UiHeading>
            <UiText color="neutral" class="mt-2 mb-4">
              Возможно, вы ошиблись адресом или страница была удалена.
            </UiText>
            <NuxtLink to="/" class="w-full flex justify-end">
                <UButton color="primary">На главную</UButton>
            </NuxtLink>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'
useHead({ title: 'Страница не найдена' })
</script>

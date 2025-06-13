<template>
    <UModal :open="show" title="Внимание!" :closable="false" :maskClosable="false" :escClosable="false">
        <template #body>
            <div class="space-y-4">
                <UiText color="darker-neutral" class="mb-4">
                    Это <b>учебный проект</b>, не <b>имеющий отношения</b> к реальности.
                    Здесь <b>не предусмотрены коммерческие транзакции</b>, все данные и действия — исключительно для
                    тестирования. Если вы не согласны с этим, <b>покиньте страницу</b>.
                </UiText>
            </div>
        </template>
        <template #footer>
            <div class="w-full flex gap-4 justify-end">
                <UButton color="neutral" variant="ghost" @click="leave">Покинуть страницу</UButton>
                <UButton color="primary" variant="subtle" @click="accept">Согласен</UButton>
            </div>
        </template>
    </UModal>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const show = ref(false)

onMounted(() => {
    if (typeof window !== 'undefined') {
        show.value = !localStorage.getItem('tutorialProjectAccepted')
    }
})

function accept() {
    localStorage.setItem('tutorialProjectAccepted', '1')
    show.value = false
}
function leave() {
    window.location.href = 'https://ya.ru'
}
</script>

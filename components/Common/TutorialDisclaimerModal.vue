<template>
    <UModal :open="show" title="Внимание!" :closable="false" :maskClosable="false" :escClosable="false">
        <template #body>
            <div class="space-y-4">
                <UiText color="darker-neutral" class="mb-4">
                    Это <b>учебный проект</b>, не <b>имеющий отношения</b> к коммерческому.
                    Здесь <b>не предусмотрены коммерческие транзакции</b>, все данные и действия — исключительно для
                    тестирования. Если вы не согласны с этим, <b>покиньте страницу</b>.
                </UiText>
                <UiText color="neutral" class="mb-2">
                    Сайт использует <b>cookie-файлы для хранения технических данных</b>: факта согласия с правилами,
                    настроек
                    интерфейса, а также для корректной работы сервисов. <b>Cookie не используются для рекламы или
                        передачи
                        третьим лицам</b>.
                </UiText>
                <UButton variant="link" class="px-0" @click="showTerms = true">Подробнее о правилах и cookies</UButton>
            </div>
            <UModal v-model:open="showTerms" title="Правила и cookies">
                <template #body>
                    <TermsContent />
                </template>
                <template #footer>
                    <UButton @click="showTerms = false">Закрыть</UButton>
                </template>
            </UModal>
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
import TermsContent from '~/components/Legal/TermsContent.vue'

const show = ref(false)
const showTerms = ref(false)

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

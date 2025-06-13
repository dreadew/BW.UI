<template>
  <div class="mt-4">
    <UiHeading size="md" class="mb-2">Расписание</UiHeading>
    <BaseGrid :custom-list-fn="userScheduleStore.findByUser" without-heading :store="userScheduleStore"
      :columns="columns" :editable="false" @edit="onEdit" @delete="onDelete" @create="openCreate = true" />
    <UModal v-model:open="openCreate" title="Добавить расписание">
      <template #body>
        <UForm class="space-y-4" :state="formState" @submit="onCreate">
          <UFormField label="Дата" name="date" required>
            <UPopover class="w-full">
              <UButton color="neutral" icon="i-lucide-calendar">
                {{ dateModel ? (dateModel ? df.format(dateModel.toDate(getLocalTimeZone())) : 'Выбрать дату') : `Выбрать
                дату` }}
              </UButton>
              <template #content>
                <UCalendar v-model="dateModel" class="p-2" />
              </template>
            </UPopover>
          </UFormField>
          <UFormField label="Начало" name="startAt" required>
            <UInput class="w-full" v-model="formState.startAt" type="time" required />
          </UFormField>
          <UFormField label="Окончание" name="endAt" required>
            <UInput class="w-full" v-model="formState.endAt" type="time" required />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4">Создать</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openEdit" title="Редактировать расписание">
      <template #body>
        <UForm class="space-y-4" :state="formState" @submit="onUpdate">
          <UFormField label="Дата" name="date" required>
            <UPopover class="w-full">
              <UButton color="neutral" icon="i-lucide-calendar">
                {{ dateModel ? (dateModel ? df.format(dateModel.toDate(getLocalTimeZone())) : 'Выбрать дату') : `Выбрать
                дату` }}
              </UButton>
              <template #content>
                <UCalendar v-model="dateModel" class="p-2" />
              </template>
            </UPopover>
          </UFormField>
          <UFormField label="Начало" name="startAt" required>
            <UInput class="w-full" v-model="formState.startAt" type="time" required />
          </UFormField>
          <UFormField label="Окончание" name="endAt" required>
            <UInput class="w-full" v-model="formState.endAt" type="time" required />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openDelete" title="Удалить расписание?">
      <template #body>
        <UiText color="darker-neutral">Вы уверены, что хотите удалить расписание на <b>{{ formState.date }}</b>?
        </UiText>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton @click="openDelete = false">Отмена</UButton>
          <UButton color="error" @click="onRemove">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, shallowRef, computed } from 'vue'
import { useUserScheduleStore } from '~/stores/useUserScheduleStore'
import { useUserStore } from '~/stores/useUserStore'
import { DateFormatter, getLocalTimeZone, parseDate, type CalendarDate } from '@internationalized/date'
import type { UserScheduleDto } from '~/types/request.types'

const userStore = useUserStore()
const userScheduleStore = useUserScheduleStore()
const userId = computed(() => userStore.user?.id || '')
userScheduleStore.userId = userId.value
const columns = [
  { accessorKey: 'date', header: 'Дата' },
  { accessorKey: 'startAt', header: 'Начало' },
  { accessorKey: 'endAt', header: 'Окончание' },
  { id: 'action' }
]

const openCreate = ref(false)
const openEdit = ref(false)
const openDelete = ref(false)
const formState = ref({ id: userId.value, date: '', startAt: '', endAt: '' })
const dateModel = shallowRef<CalendarDate | null>(null)
const df = new DateFormatter('ru-RU', { dateStyle: 'medium' })

function resetForm() {
  formState.value = { id: userId.value, date: '', startAt: '', endAt: '' }
  dateModel.value = null
}

function onEdit(row: UserScheduleDto) {
  formState.value = { ...row, id: row.id }
  dateModel.value = row.date ? parseDate(row.date) : null
  openEdit.value = true
}
function onDelete(row: UserScheduleDto) {
  formState.value = { ...row, id: row.id }
  dateModel.value = row.date ? parseDate(row.date) : null
  openDelete.value = true
}
function toTimeOnly(val: string) {
  if (!val) return ''
  return val.length === 5 ? val + ':00' : val
}
async function onCreate() {
  await userScheduleStore.createUserSchedule({
    ...formState.value,
    date: dateModel.value ? dateModel.value.toDate(getLocalTimeZone()).toISOString().split('T')[0] : '',
    startAt: toTimeOnly(formState.value.startAt),
    endAt: toTimeOnly(formState.value.endAt)
  })
  openCreate.value = false
  resetForm()
  await userScheduleStore.findByUser()
}
async function onUpdate() {
  await userScheduleStore.updateUserSchedule({
    ...formState.value,
    date: dateModel.value ? dateModel.value.toDate(getLocalTimeZone()).toISOString().split('T')[0] : '',
    startAt: toTimeOnly(formState.value.startAt),
    endAt: toTimeOnly(formState.value.endAt)
  })
  openEdit.value = false
  resetForm()
  await userScheduleStore.findByUser()
}
async function onRemove() {
  await userScheduleStore.deleteUserSchedule(formState.value.id)
  openDelete.value = false
  resetForm()
  await userScheduleStore.findByUser()
}
// onMounted(() => {
//   userScheduleStore.findByUser()
// })
</script>

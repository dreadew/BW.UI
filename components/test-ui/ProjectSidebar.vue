<template>
  <aside class="min-h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 sticky top-0 left-0 z-40 shadow flex flex-col gap-4 p-8">
    <nav class="flex flex-col gap-2">
      <NuxtLink to="/test-ui/kanban" class="block px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors outline-none hover:bg-blue-50 hover:text-primary-600 focus:ring-2 focus:ring-primary-200 router-link-exact-active:bg-blue-100 router-link-exact-active:text-primary-700">
        Канбан-доска
      </NuxtLink>
      <NuxtLink to="/test-ui/threads" class="block px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors outline-none hover:bg-blue-50 hover:text-primary-600 focus:ring-2 focus:ring-primary-200 router-link-exact-active:bg-blue-100 router-link-exact-active:text-primary-700">
        Треды
      </NuxtLink>
      <NuxtLink to="/test-ui/priorities" class="block px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors outline-none hover:bg-blue-50 hover:text-primary-600 focus:ring-2 focus:ring-primary-200 router-link-exact-active:bg-blue-100 router-link-exact-active:text-primary-700">
        Приоритеты
      </NuxtLink>
      <NuxtLink to="/test-ui/relations" class="block px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors outline-none hover:bg-blue-50 hover:text-primary-600 focus:ring-2 focus:ring-primary-200 router-link-exact-active:bg-blue-100 router-link-exact-active:text-primary-700">
        Отношения
      </NuxtLink>
      <NuxtLink to="/test-ui/activities" class="block px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors outline-none hover:bg-blue-50 hover:text-primary-600 focus:ring-2 focus:ring-primary-200 router-link-exact-active:bg-blue-100 router-link-exact-active:text-primary-700">
        Активности
      </NuxtLink>
      <NuxtLink to="/test-ui/roles" class="block px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors outline-none hover:bg-blue-50 hover:text-primary-600 focus:ring-2 focus:ring-primary-200 router-link-exact-active:bg-blue-100 router-link-exact-active:text-primary-700">
        Роли проекта
      </NuxtLink>
      <NuxtLink to="/test-ui/sprints" class="block px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors outline-none hover:bg-blue-50 hover:text-primary-600 focus:ring-2 focus:ring-primary-200 router-link-exact-active:bg-blue-100 router-link-exact-active:text-primary-700">
        Спринты
      </NuxtLink>
    </nav>
  </aside>
</template>

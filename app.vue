<template>
  <UApp :toaster="{
    position: 'top-right'
  }">
    <NuxtLayout>
      <NuxtPage />
      <AuthAccountVerifyModal />
    </NuxtLayout>
  </UApp>
</template>

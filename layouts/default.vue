<template>
    <UContainer>
      <CommonNavigation />
      <slot />
      <CommonFooter />
    </UContainer>
</template>

<script lang="ts">
import { CommonNavigation, CommonFooter, UContainer } from '#components';
</script>
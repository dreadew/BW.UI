<template>
  <footer class="border-t border-t-secondary/10 my-12 py-12">
    <div>
      <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <div class="flex items-center gap-2">
            <img src="/assets/img/128.svg" alt="Hexaend Logo" class="h-7 w-7" />
            <UiHeading level="3" size="sm">Hexaend</UiHeading>
          </div>
          <UiText size="sm" class="mt-2">
            © {{ new Date().getFullYear() }} Hexaend. Все права защищены.
          </UiText>
        </div>
        <div class="flex gap-8 flex-wrap">
          <CommonFooterLinksWrapper title="Продукт">
            <template #icon>
              <UIcon name="i-lucide-box" />
            </template>
            <template #links>
              <ULink to="/features">
                <UIcon name="i-lucide-star" class="mr-1" /> Особенности
              </ULink>
              <ULink to="/pricing">
                <UIcon name="i-lucide-dollar-sign" class="mr-1" /> Цены
              </ULink>
              <ULink to="/roadmap">
                <UIcon name="i-lucide-map" class="mr-1" /> Дорожная карта
              </ULink>
            </template>
          </CommonFooterLinksWrapper>
          <CommonFooterLinksWrapper title="Компания">
            <template #icon>
              <UIcon name="i-lucide-users" />
            </template>
            <template #links>
              <ULink to="/about">
                <UIcon name="i-lucide-info" class="mr-1" /> О нас
              </ULink>
              <ULink to="/blog">
                <UIcon name="i-lucide-edit" class="mr-1" /> Блог
              </ULink>
              <ULink to="/careers">
                <UIcon name="i-lucide-briefcase" class="mr-1" /> Карьера
              </ULink>
            </template>
          </CommonFooterLinksWrapper>
          <CommonFooterLinksWrapper title="Юридическое">
            <template #icon>
              <UIcon name="i-lucide-shield" />
            </template>
            <template #links>
              <ULink to="/privacy">
                <UIcon name="i-lucide-lock" class="mr-1" /> Приватность
              </ULink>
              <ULink to="/terms">
                <UIcon name="i-lucide-file-text" class="mr-1" /> Правила
              </ULink>
            </template>
          </CommonFooterLinksWrapper>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
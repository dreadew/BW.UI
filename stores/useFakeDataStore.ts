import { defineStore } from 'pinia';

export const useFakeDataStore = defineStore('FakeData', () => {
  const items = ref<{ id: number; name: string; created_at: string }[]>([]);
  const total = ref(50);
  const currentPage = ref(0);
  const pageSize = ref(10);
  const loading = ref(false);

  async function list(): Promise<void> {
    if (loading.value) return;

    loading.value = true;
    try {
      const start = currentPage.value * pageSize.value;
      const end = start + pageSize.value;
      const paginatedItems = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        created_at: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
      })).slice(start, end);

      if (paginatedItems.length > 0) {
        items.value = [...items.value, ...paginatedItems];
        currentPage.value++;
      }
    } catch (error) {
      console.error('Error fetching fake data:', error);
    } finally {
      loading.value = false;
    }
  }

  async function deleteItem(id: string) {
    loading.value = true;
    try {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        items.value.splice(start, end);
        total.value = items.value.length; 
    } catch(err) {

    } finally {
        loading.value = false;
    }
  }

  return {
    items,
    total,
    currentPage,
    pageSize,
    loading,
    list,
    deleteItem
  };
});
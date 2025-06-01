import { defineStore } from 'pinia';

export const useFakeDataStore = defineStore('FakeData', () => {
  const items = ref<{ id: number; name: string; created_at: string }[]>([]);
  const total = ref(50);
  const limit = ref(10);
  const offset = ref(0);
  const loading = ref(false);

  async function list(params: { limit?: number; offset?: number } = {}): Promise<void> {
    if (loading.value) return;

    loading.value = true;
    try {
      const l = params.limit ?? limit.value;
      const o = params.offset ?? offset.value;
      const paginatedItems = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        created_at: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
      })).slice(o, o + l);

      if (paginatedItems.length > 0) {
        items.value = [...items.value, ...paginatedItems];
        offset.value += l;
      }
    } catch (error) {
      console.error('Error fetching fake data:', error);
    } finally {
      loading.value = false;
    }
  }

  function setPaging(newLimit: number, newOffset: number) {
    limit.value = newLimit;
    offset.value = newOffset;
  }

  function nextPage() {
    offset.value += limit.value;
  }

  function prevPage() {
    offset.value = Math.max(0, offset.value - limit.value);
  }

  async function deleteItem(id: string) {
    loading.value = true;
    try {
      items.value = items.value.filter(item => item.id !== Number(id));
      total.value = items.value.length;
    } catch (err) {

    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    total,
    limit,
    offset,
    loading,
    list,
    setPaging,
    nextPage,
    prevPage,
    deleteItem
  };
});
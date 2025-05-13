import { onMounted, onUnmounted, ref, type Ref } from "vue";

export function useScroll(container: Ref<HTMLElement | null>) {
  const isScrolling = ref(false);
  let scrollTimer: number | null = null;

  function onScroll() {
    isScrolling.value = true;
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      isScrolling.value = false;
      scrollTimer = null;
    }, 200);
  }

  onMounted(() => {
    container.value!.addEventListener("scroll", onScroll);
  });

  onUnmounted(() => {
    container.value!.removeEventListener("scroll", onScroll);
  });
  return {
    isScrolling,
  };
}

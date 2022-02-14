<template>
  <div class="colors">
    <template v-for="(color, index) in colors" :key="color + index">
      <color-item
        class="color-item"
        :size="16"
        :value="color"
        :border="false"
        :border-radius="3"
        :selected="selectIndex === index"
        @select="onSelectColor($event, index)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ColorItem from '../color-item'
export default defineComponent({
  name: 'Colors',
  components: {
    ColorItem
  },
  props: {
    colors: {
      type: Array,
      default: () => []
    }
  },
  emits: ['select'],
  setup (props, { emit }) {
    const selectIndex = ref<number>(-1)
    const onSelectColor = (color: string, index: number) => {
      selectIndex.value = index
      emit('select', color)
    }
    return {
      selectIndex,
      onSelectColor
    }
  }
})
</script>

<style scoped lang="less">
.colors {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.color-item {
  margin-top: 10px;
  margin-left: 10px;
}
</style>

<template>
  <div class="colors">
    <template v-for="(color, index) in colors" :key="color + index">
      <color-item
        class="color-item"
        :size="16"
        :value="color"
        :border="false"
        :border-radius="3"
        :selected="selectedIndex === index"
        @click.stop.prevent="onSelectColor(color, index)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ColorItem from '../color-item'
export default defineComponent({
  name: 'Colors',
  components: {
    ColorItem
  },
  props: {
    colors: {
      type: Array as PropType<string []>,
      default: () => []
    },
    selectedIndex: {
      type: Number,
      default: -1
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const onSelectColor = (color: string, index: number) => {
      emit('change', color, index)
    }
    return {
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
  margin-top: 5px;
}
.color-item {
  margin: 5px;
}
</style>

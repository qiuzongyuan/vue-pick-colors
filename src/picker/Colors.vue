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
import { defineComponent } from 'vue'
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
    },
    selectIndex: {
      type: Number,
      default: -1
    }
  },
  emits: ['select'],
  setup (props, { emit }) {
    const onSelectColor = (color: string, index: number) => {
      emit('select', color, index)
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
}
.color-item {
  margin-top: 10px;
  margin-left: 10px;
}
</style>

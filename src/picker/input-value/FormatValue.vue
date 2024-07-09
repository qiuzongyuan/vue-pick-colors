<template>
   <div class="format">
      <div class="label" ref="targetRef" @click="onShow">
        <span>{{ value }}</span>
        <div class="arrow" v-if="isNeedSelect"></div>
      </div>
     <Transition>
      <div class="selector" ref="selectorRef" :style="selectorStyle" v-if="isShowSelector">
        <div class="selector-item" v-for="option in formatOptions" :key="option" @click="onFormatChange(option)">
          {{ option }}
        </div>
      </div>
     </Transition>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, unref } from 'vue'
import { ALPHA_FORMAT_MAP, FORMAT_MAP, Format, FORMAT_VALUE_MAP } from '../../constant'
import usePopper from '../../hooks/usePopper'

export default defineComponent({
  props: {
    value: {
      type: String,
      default: 'RGBA'
    },
    showAlpha: {
      type: Boolean
    },
    options: {
      type: [Boolean, Array] as PropType<Format [] | Boolean>
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const targetRef = ref(null)
    const selectorRef = ref(null)
    const isShowSelector = ref(false)
    const { style: selectorStyle } = usePopper(targetRef, selectorRef, { strategy: 'fixed', defaultStyle: { zIndex: 2 } })
    const isNeedSelect = computed(() => Array.isArray(props.options) && props.options.length > 1)

    const onShow = () => {
      if (!isNeedSelect.value) return
      isShowSelector.value = true
    }
    const formatOptions = computed(() => {
      const { options, showAlpha, value } = props
      if (!Array.isArray(options)) return []
      if (showAlpha) return options.map((option) => ALPHA_FORMAT_MAP[option]).filter(v => !v.includes(value))
      return options.map((option) => FORMAT_MAP[option]).filter(v => !v.includes(value))
    })

    const onFormatChange = (format: string) => {
      emit('change', FORMAT_VALUE_MAP[format])
    }

    const onAllClick = (e) => {
      const target = e.target as HTMLElement
      const isTarget = !unref(targetRef)?.isEqualNode(target) && unref(targetRef)?.contains(target)
      if (isTarget) return
      isShowSelector.value = false
    }

    onMounted(() => {
      document.addEventListener('mouseup', onAllClick, false)
    })

    onUnmounted(() => {
      document.removeEventListener('mouseup', onAllClick, false)
    })
    return {
      targetRef,
      selectorRef,
      selectorStyle,
      isShowSelector,
      isNeedSelect,
      formatOptions,
      onShow,
      onFormatChange
    }
  }
})
</script>

<style scoped lang="less">
.format {
  position: relative;
}
.label {
  width: 60px;
  height: 30px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  color: #999999;
  background: #e7e8e9;
  position: relative;
}
[pick-colors-theme='dark'] .label {
  color: #999999;
  background: #252930;
}
.arrow {
  width: 6px;
    height: 6px;
    margin-left: 5px;
    margin-bottom: 4px;
    border-top: 1px solid #999999;
    border-right: 1px solid #999999;
    transform: rotate(135deg);
}
[pick-colors-theme='dark'] .arrow {
  border-top: 1px solid #999999;
  border-right: 1px solid #999999;
}
.selector {
  padding: 4px;
  background: #f7f8f9;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 400;
}
[pick-colors-theme='dark'] .selector {
  color: #999;
  background: #252930;
}
.selector-item {
  height: 30px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: #e1f2fe;
  }
}
[pick-colors-theme='dark'] .selector-item {
  color: #fff;
  &:hover {
    background: #0087FA;
  }
}
.active-selector-item {
  background: #e1f2fe;
}
[pick-colors-theme='dark'] .active-selector-item  {
  background: #0087FA;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
  opacity: 1;
  transform: scaleY(1);
  transform-origin: center top;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>

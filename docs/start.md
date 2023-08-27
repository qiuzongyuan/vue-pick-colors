# Get Started

## Installation
```
# NPM
npm install vue-pick-colors -S

# Yarn
yarn add vue-pick-colors
```

## Usage

```vue
<template>
  <pick-colors v-model:value="value"/>
</template>

<script lang="ts" setup>
  import pickColors from 'vue-pick-colors'
  const value = ref('#ff4500')
</script>
```
<script setup lang="ts">
interface propsType {
  msg: string
}

const props = withDefaults(defineProps<propsType>(), {
  msg: 'Welcome',
})
</script>

<template>
  <div class="hello">
    <h1>{{ props.msg }}</h1>
  </div>
</template>

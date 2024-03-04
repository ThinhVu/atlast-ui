<script setup>
defineProps(['tabs', 'modelValue'])
</script>

<template>
  <div class="fr ai-c">
    <div v-for="tab in tabs"
         :key="tab.value"
         @click="$emit('update:modelValue', tab.value)"
         class="clickable px-4 py-4" :class="modelValue === tab.value ? 'bc:#ccc' : 'bc:#fff'">
      {{tab.text}}
    </div>
  </div>
</template>

<style scoped>

</style>
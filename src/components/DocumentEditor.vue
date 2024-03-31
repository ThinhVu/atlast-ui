<script setup>
const props = defineProps({
  document: Object
})
</script>

<template>
  <div class="fc w-100 h-100 bc:#fff px-2 py-2">
    <div>{{JSON.stringify(document)}}</div>
    <div class="fr ai-c jc-fe fg-8px">
      <TBtn>Cancel</TBtn>
      <TBtn save>Save</TBtn>
    </div>
  </div>
</template>

<style scoped>

</style>
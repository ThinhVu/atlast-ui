<template>
  <div class="bc:white pb-3 mx-a min-w-400px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <p class="px-4 py-4 f1">Create a new collection</p>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1">
      <t-text v-model="colName" class="w-100" label="Collection name" placeholder="e.g: quantity"/>
    </div>
    <div class="px-3 py-1 fr ai-c jc-fe fg-4px">
      <TBtn @click="emit('close')">Cancel</TBtn>
      <TBtn @click="createCol" save>Create collection</TBtn>
    </div>
  </div>
</template>

<script setup>
import {isEmpty, trim} from "lodash-es";
import {inject, ref} from 'vue'
const emit = defineEmits(['close'])

const {notification} = inject('TSystem')

const colName = ref('')
const createCol = () => {
  const name = trim(colName.value)
  if (isEmpty(name)) {
    notification.err('collection name is empty')
    return
  }
  emit('close', name)
}
</script>
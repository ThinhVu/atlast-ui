<template>
  <div class="bc:white pb-3 mx-a min-w-400px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <p class="px-4 py-4 f1">Create a new document</p>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>
    <div class="px-3 py-3 f1 t-text rel">
      <t-text v-model="document" class="w-100 mb-4" label="Document Add" placeholder=""/>
    </div>
    <div class="px-3 py-1 fr ai-c jc-fe fg-4px">
      <TBtn @click="emit('close')">Cancel</TBtn>
      <TBtn @click="createDoc" save>Create document</TBtn>
    </div>
  </div>
</template>

<script setup>
import {isEmpty, trim} from "lodash-es";
import {inject, ref} from 'vue'

const emit = defineEmits(['close'])

const {notification} = inject('TSystem')

const document = ref('')
const createDoc = () => {
  const doc = trim(document.value)
  if (isEmpty(doc)) {
    notification.err('document is empty')
    return
  }
  emit('close', doc)
}

</script>

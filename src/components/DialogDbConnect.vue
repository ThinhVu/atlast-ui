<script setup>
import {computed, inject} from 'vue'
import {copyToClipboard} from "@/utils/common";

const props = defineProps({
  name: String,
  username: String,
  password: String
})
const emit = defineEmits(['close'])

const {notification} = inject('TSystem')

const DB_URL = 'mongodb.net'
const connectionStr = computed(() => `mongodb://${props.username}:${props.password}@${DB_URL}/?authSource=${props.name}`)

function copyConnectionStr() {
  copyToClipboard(connectionStr.value)
  notification.info('Copied')
  emit('close')
}
</script>

<template>
  <TBaseDialog title="DB Connect" showCloseIcon class="min-w-600px">
    <template #body>
      <TText v-model="connectionStr"/>
    </template>
    <template #footer>
      <tbtn @click="copyConnectionStr">Copy</tbtn>
    </template>
  </TBaseDialog>
</template>

<style scoped>

</style>
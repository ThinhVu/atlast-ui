<template>
  <div class="bc:white pb-3 mx-a min-w-400px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <p class="px-4 py-4 f1">Create a new database</p>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1">
    <t-text v-model="dbName" class="w-100" label="Input your database name" placeholder="e.g: inventory"/>
    </div>
    <div class="px-3 py-1 fr ai-c jc-fe fg-4px">
      <TBtn @click="emit('close')">Cancel</TBtn>
      <TBtn @click="emit('close', dbName)" save>Create database</TBtn>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const emit = defineEmits(['close'])

const dbName = ref('')
</script>

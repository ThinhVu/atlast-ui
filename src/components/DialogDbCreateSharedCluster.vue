<template>
  <div class="bc:white pb-3 mx-a min-w-400px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <p class="px-4 py-4 f1">Create a new database</p>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1 fc fg-4px">
      <TCombobox v-model="cluster" :options="sharedClusters" item-text="name" item-value="_id"/>
      <t-text v-model="name" class="w-100" label="Input your database name" placeholder="e.g: inventory"/>
    </div>
    <div class="px-3 py-1 fr ai-c jc-fe fg-4px">
      <TBtn @click="emit('close')">Cancel</TBtn>
      <TBtn @click="createDb" save>Create database</TBtn>
    </div>
  </div>
</template>

<script setup>
import {isEmpty, trim} from "lodash-es";
import {inject, ref, computed} from 'vue'
import {sharedClusters} from "@/app-state";

const emit = defineEmits(['close'])

const {notification} = inject('TSystem')

const cluster = ref(sharedClusters.value && sharedClusters.value[0] && sharedClusters.value[0]._id)
const name = ref('')

const createDb = () => {
  const alias = trim(name.value)
  if (isEmpty(alias)) {
    notification.err('db name is empty')
    return
  }
  if (isEmpty(cluster.value)) {
    notification.err('You must select cluster')
    return
  }
  emit('close', {
    cluster: cluster.value,
    alias,
  })
}
</script>

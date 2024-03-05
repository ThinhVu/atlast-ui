<script setup>
import {ref, computed, inject, onMounted} from 'vue'
import {dbAPI} from "@/api";

defineProps(['name'])

const name = ref('')

const emit = defineEmits(['close','createDb'])

const {notification} = inject('TSystem')

const createNewDb = () => {
    getName(name.value);
};

const getName = async (name) => {
    await dbAPI.createDb(name)
    setTimeout(loadDbs, 1000)
    notification.info('Successfully created new database')
    emit('close')
};


</script>

<template>
  <div class="bc:white pb-3 mx-a min-w-600px min-h-300px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <h1>Create a new database</h1>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1">
    <t-text v-model="name" class="w-100" label="Input your database name" placeholder="e.g: inventory"></t-text>
    </div>

    <div class="px-3 py-1 fr ai-c jc-fe">
      <TBtn @click="emit('close')">Cancel</TBtn>
      <TBtn @click="createNewDb" save>Create database</TBtn>
    </div>
  </div>
</template>

<style scoped>

</style>
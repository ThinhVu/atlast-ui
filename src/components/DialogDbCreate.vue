<template>
  <div class="bc:white pb-3 mx-a min-w-600px min-h-300px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <h1 class="f1">Create a new database</h1>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1">
    <t-text v-model="valueName" class="w-100" label="Input your database name" placeholder="e.g: inventory"></t-text>
    </div>
    <div class="px-3 py-1 fr ai-c jc-fe">
      <TBtn @click="emit('close')">Cancel</TBtn>
      <TBtn @click="createNewDb(); updateDbList()" save>Create database</TBtn>
    </div>
  </div>
</template>

//[click1($event), click2($event)]
<script setup>
import {ref, inject} from 'vue'
import {dbAPI} from "@/api";



const valueName = ref('')

const emit = defineEmits(['close','loadData'])

const {notification} = inject('TSystem')


const createNewDb = async () => {
    const name = valueName.value;
    console.log(name);
    try {
        await dbAPI.createDb(name);
        emit('close');
        notification.info('Successfully created new database');
    } catch (error) {
        console.error('Error creating new database:', error);
    }
};
const updateDbList = async() => {
  emit('loadData');
}
</script>

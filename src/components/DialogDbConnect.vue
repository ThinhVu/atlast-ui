<script setup>
import {ref, computed, inject, onMounted} from 'vue'
import {copyToClipboard} from "@/utils/common";
import {dbAPI} from "@/api";
import TabHeader from "@/components/TabHeader.vue";

const props = defineProps({
  _id: String,
  dbName: String,
  username: String,
  password: String
})
const emit = defineEmits(['close'])

const {notification} = inject('TSystem')

const TABS = {
  CONN_STR: 1,
  API_KEY: 2
}
const tabs = [
  {text: 'Connection string', value: TABS.CONN_STR},
  {text: 'API Key', value: TABS.API_KEY}
]
const tab = ref(TABS.CONN_STR)

const DB_URL = '127.0.0.1:27017'
const REPLICA_SET = 'rs0'
const connectionStr = computed(() => `mongodb://${props.username}:${props.password}@${DB_URL}/${props.dbName}?authSource=${props.dbName}&retryWrites=true&w=majority&replicaSet=${REPLICA_SET}&readPreference=nearest`)

const apiKeys = ref([])
async function loadApiKeys() {
  apiKeys.value = await dbAPI.getApiKeys(props._id)
}
async function createApiKey() {
  await dbAPI.createApiKey(props._id)
  setTimeout(loadApiKeys, 500)
}
async function enableApiKey(apiKey) {
  await dbAPI.enableApiKey(props._id, apiKey)
  setTimeout(loadApiKeys, 500)
}

async function disableApiKey(apiKey) {
  await dbAPI.disableApiKey(props._id, apiKey)
  setTimeout(loadApiKeys, 500)
}

function copyApiKey(apiKey) {
  copyToClipboard(apiKey)
}

onMounted(loadApiKeys)
</script>

<template>
  <div class="bc:white pb-3 mx-a min-w-600px min-h-300px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <TabHeader :tabs="tabs" v-model="tab" class="f1"/>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1">
      <div v-if="tab === TABS.CONN_STR" class="fc fg-8px">
        <div>
          <p class="mb-1"><b>Connection string</b></p>
          <TText v-model="connectionStr" multiLine :cols="80" :rows="4" class="f1"/>
        </div>

        <div>
          <p class="mb-1"><b>MongoDb driver example code</b></p>
          <pre class="max-w-600px br-2 px-2 py-2 ovf-x-s fs-s" style="border: 1px solid #ddd">
const {MongoClient} = require('mongodb');
const client = new MongoClient(
  '{{ connectionStr }}',
  { connectTimeoutMS: 1000000000, socketTimeoutMS: 100000}
);
await client.connect();
db = client.db('{{ dbName }}');</pre>
        </div>

        <div>
          <p class="mb-1"><b>Mongoose example code</b></p>
          <pre class="max-w-600px br-2 px-2 py-2 ovf-x-s fs-s" style="border: 1px solid #ddd">
const mongoose = require('mongoose');
db = await mongoose.connect('{{ connectionStr }}', {connectTimeoutMS: 10000})</pre>
        </div>
      </div>
      <template v-else>
        <div class="fc fg-4px mb-2">
          <div v-for="apiKey in apiKeys" :key="apiKey" class="fr ai-c fg-4px">
            <TText v-model="apiKey.key" class="f1"/>
            <TBtn @click="copyApiKey(apiKey)">Copy</TBtn>
          </div>
        </div>
        <TBtn @click="createApiKey" save>Create API Key</TBtn>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>
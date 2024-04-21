<script setup>
import {ref, computed, inject, onMounted} from 'vue'
import {copyToClipboard} from "@/utils/common";
import {dbAPI} from "@/api";
import TabHeader from "@/components/TabHeader.vue";
import {API_URL, MONGODB_HOSTS, MONGODB_REPL_NAME} from "@/constants";
import {clusterIdMap} from "@/app-state";

const props = defineProps({
  _id: String,
  dbName: String,
  clusterId: String,
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

const connectionStr = computed(() => {
  const cluster = clusterIdMap.value[props.clusterId];
  if (!cluster) return
  console.log('cluster', cluster);
  const host = cluster.nodes.join(',')
  const defaultConn = `mongodb://${props.username}:${props.password}@${host}/${props.dbName}?authSource=${props.dbName}`
  if (host === "127.0.0.1") {
    return defaultConn
  }
  const replicationOptions = {
    replicaSet: "rs0",
    retryWrites: true,
    w: 'majority',
    readPreference: 'nearest'
  }
  const replStr = Object.entries(replicationOptions).map(([k, v]) => `${k}=${v}`).join('&')
  return `${defaultConn}&${replStr}`
})

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
  notification.info('Copied')
}

function openDbApiExample() {
  window.open('https://github.com/ThinhVu/atlast-db-api-example', '_blank')
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
          <pre class="max-w-600px br-2 px-2 py-2 ovf-x-s fs-s" style="border: 1px solid #ddd">{{connectionStr}}</pre>
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
        <div class="mb-4">
          <p class="mb-2"><b>API URL:</b></p>
          <p>
            <TBtn @click="copyApiKey(`${API_URL}/run-db-cmd`)">
              <TIcon>fas fa-copy@14:#888</TIcon>
            </TBtn> {{`${API_URL}/run-db-cmd`}}
          </p>
        </div>

        <div class="mb-4">
          <p class="mb-2"><b>API Keys:</b></p>
          <p class="mb-2"><TBtn @click="createApiKey" save>Create API Key</TBtn></p>
          <div class="fc fg-4px mb-2">
            <div v-for="apiKey in apiKeys" :key="apiKey" class="fr ai-c fg-4px">
              <TBtn @click="copyApiKey(apiKey.key)">
                <TIcon>fas fa-copy@14:#888</TIcon>
              </TBtn>
              <span class="f1">{{apiKey.key}}</span>
            </div>
          </div>
        </div>

        <div class="mb-4 fc fg-4px">
          <p class="mb-2"><b>Examples:</b></p>
          <p @click="openDbApiExample" class="clickable ml-2 fs-14px" style="text-decoration: underline">
            - Basic example in NodeJS
          </p>
          <p class="clickable ml-2 fs-14px" style="text-decoration: underline">
            - Todo app in ExpressJs (monolith)
          </p>
          <p class="clickable ml-2 fs-14px" style="text-decoration: underline">
            - Todo app in HonoJS (serverless)
          </p>
          <p class="clickable ml-2 fs-14px" style="text-decoration: underline">
            - Todo app in Ampt (serverless)
          </p>
          <p class="clickable ml-2 fs-14px" style="text-decoration: underline">
            - Todo app in AWS Lambda (serverless)
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>
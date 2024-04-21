<script setup>
import dayjs from 'dayjs';
import {ref, onMounted, inject, computed} from "vue";
import {useNavigation} from "@/composables/useNavigation";
import {dbClusterAPI, dbAPI} from "@/api";
import {sharedClusters, mineClusters, clusterIdMap} from "@/app-state";
import DialogDbConnect from "@/components/DialogDbConnect.vue";
import DialogDbCreate from "@/components/DialogDbCreateShared.vue"

const {msgBox, dialog, notification, loading} = inject('TSystem')

const databases = ref([])

const nav = useNavigation()

const ACTIONS = {
  LOAD_DBS: 'l_dbs',
}

async function loadDbs() {
  loading.begin(ACTIONS.LOAD_DBS)
  databases.value = await dbAPI.getDbs()
  loading.end(ACTIONS.LOAD_DBS)
}
function inspect(db) {
  console.log(db)
}

async function showCreateDbDialog() {
  const rs = await dialog.show(DialogDbCreate)
  if (!rs) return
  try {
    const {alias, cluster} = rs
    await dbAPI.createDb(alias, cluster);
    notification.info('Successfully created new database');
    setTimeout(loadDbs, 500);
  } catch (error) {
    console.error('Error creating new database:', error);
  }
}

function connect(db) {
  dialog.show({
    component: DialogDbConnect,
    data: db
  })
}

async function explore(db) {
  try {
    await nav.gotoExplore(db._id)
  } catch(e) {
    notification.err(e)
  }
}

async function deleteDbConfirm(db) {
  const rs = await msgBox.show(
    'Delete Db Confirm',
    'Are you sure you want to delete this db?',
    msgBox.Buttons.YesNo,
    msgBox.Icons.Question
  )
  if (rs === msgBox.Results.yes) {
    await dbAPI.removeDb(db._id)
    setTimeout(loadDbs, 1000)
    notification.info('Db deleted')
  }
}

onMounted(async () => {
  sharedClusters.value = (await dbClusterAPI.getSharedClusters() || [])
  mineClusters.value = (await dbClusterAPI.getMineClusters() || [])
  await loadDbs()
})
</script>

<template>
  <section data-name="system-config" class="fc w-100 h-100 fg-12px px-3 py-3">
    <div>
      <t-btn save @click="showCreateDbDialog">Create database</t-btn>
    </div>

    <TLoading :action="ACTIONS.LOAD_DBS">
      <template #loading>
        Loading...
      </template>
      <t-table class="w-100 max-h-400px">
        <thead>
        <tr>
          <th class="z-index-1">Cluster</th>
          <th class="z-index-1">Name</th>
          <th class="z-index-1">Size (GB)</th>
          <th class="z-index-1">Create At</th>
          <th class="w-10px z-index-1">Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="db in databases" :key="db._id" @click="inspect(db)">
          <td>{{clusterIdMap[db.clusterId].name}}</td>
          <td>{{db.alias}}</td>
          <td>
            {{db.sizeInGB}}
          </td>
          <td>
            {{dayjs(db.createDt).format('YYYY-MM-DD HH:mm:ss')}}
          </td>
          <td>
            <div class="fr ai-c fg-4px">
              <t-btn primary class="fn-btn" @click="connect(db)">
                Connect
              </t-btn>
              <t-btn secondary class="fn-btn" @click="explore(db)">
                Explore
              </t-btn>
              <t-btn delete class="fn-btn" @click="deleteDbConfirm(db)">
                Remove
              </t-btn>
            </div>
          </td>
        </tr>
        </tbody>
      </t-table>
    </TLoading>
  </section>
</template>

<style scoped>

</style>
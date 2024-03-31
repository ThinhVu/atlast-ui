<template>
  <TLoading :action="ACTIONS.AUTH">
    <template #loading>
      <TPulseBlock class="h-100vh w-100vw"/>
    </template>
    <TDashboard v-if="user && sidebarItems !== null" :sidebar-items="sidebarItems">
      <template #header>
        <img src="@/assets/images/logo-full.png" alt="logo-full" style="width: 120px;" @click="nav.gotoHome()"/>
      </template>
      <template #sidebar-header>
        <div class="fr mt-2 mb-2 ai-c jc-sb">
          <p class="fs-20px fw-15">Collections</p>
          <t-btn primary @click="showCreateColDialog">
            Add
          </t-btn>
        </div>
      </template>
      <template #sidebar-footer>
        <t-btn @click="userAPI.signOut()">Sign out</t-btn>
      </template>
    </TDashboard>
  </TLoading>
</template>

<script setup lang="ts">
import {inject, computed, ref, onBeforeMount} from 'vue';
import {userAPI} from '@/api';
import {useNavigation} from '@/composables/useNavigation'
import {useRoute} from 'vue-router'
import {dbAPI} from '../api'
import {onMounted} from "vue";
import Collection from '../components/Collection.vue'
import DialogColCreate from "../components/DialogColCreate.vue";
import {user} from '@/app-state';
import {socketConnect} from '@/socket/socket';
import {provide} from 'vue';

const {dialog, loading, notification} = inject('TSystem')

const route = useRoute()

const nav = useNavigation()

const rs = ref([])

const dbId = route.params.id

provide('dbId', route.params.id)
const cols = ref([])

const ACTIONS = {
  AUTH: 'authenticate'
}
onMounted(getCols);


async function getCols() {
  cols.value = await dbAPI.getDbCollection(route.params.id);
}

const sidebarItems = computed(() => {
  if (cols.value?.length > 0) {
    return cols.value.map((col) => ({
      title: col.name,
      icon: 'fas fa-th-large@16px:#aaa',
      component: Collection
    }))
  } else {
    setTimeout(getCols, 100)
    return null
  }
})

async function showCreateColDialog() {
  const colName = await dialog.show(DialogColCreate)
  if (!colName) return
  try {
    await dbAPI.createNewCollection(dbId, colName);
    setTimeout(getCols, 500);
    notification.info(`Successfully created new collection: ${colName}`);
  } catch (error) {
    console.error('Error creating new collection:', error);
  }
}

onBeforeMount(async () => {
  // already logged in from Home
  if (user.value)
    return;

  const access_token = window.localStorage.getItem('access_token')
  if (!access_token) {
    console.log('access_token is missing. go to home.')
    await nav.gotoHome()
    return
  }

  console.log('login using access_token', access_token)

  try {
    loading.begin(ACTIONS.AUTH)
    console.log(`access_token: ${access_token}`)
    const {token} = await userAPI.auth(access_token)
    socketConnect(token)
  } catch (e) {
    console.error(e)
    await nav.gotoHome()
  } finally {
    loading.end(ACTIONS.AUTH)
  }
})

</script>

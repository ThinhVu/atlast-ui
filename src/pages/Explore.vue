<template>
  <TLoading :action="ACTIONS.AUTH">
    <template #loading>
      <TPulseBlock class="h-100vh w-100vw"/>
    </template>
    <template v-if="user && sidebarItems !== null">
      <div class="t-dashboard h-100vh v-100vw">
        <t-page-header>
          <img src="@/assets/images/logo-full.png" alt="logo-full" style="width: 120px;" @click="nav.gotoHome()"/>
        </t-page-header>
        <t-page-content>
          <div class="fr h-100 w-100">
            <div class="sidebar fc fg-4px ovf-y-s sb-h px-1 py-1">
              <div class="fr mt-2 mb-2 ai-c jc-sb">
                <p class="fs-20px fw-15">Collections</p>
                <t-btn primary @click="showCreateColDialog">
                  Add
                </t-btn>
              </div>
              <div v-for="(item, i) in sidebarItems" :key="item.title"
                   class="sidebar-item fr ai-c px-2 py-1 clickable"
                   :class="selectedSidebarItemIdx === i && 'sidebar-item--selected'"
                   @click="selectSidebarItem(i)">
                <t-icon class="item-icon">{{ item.icon }}</t-icon>
                <span class="item-text">{{ item.title }}</span>
              </div>
              <t-spacer/>
              <t-btn @click="userAPI.signOut()">Sign out</t-btn>
            </div>
            <div class="content ovf-h">
              <Collection :title="sidebarItems[selectedSidebarItemIdx].title"/>
            </div>
          </div>
        </t-page-content>
      </div>
    </template>
<!--    <TDashboard v-if="user && sidebarItems !== null" :sidebar-items="sidebarItems">-->
<!--      <template #header>-->
<!--        <img src="@/assets/images/logo-full.png" alt="logo-full" style="width: 120px;" @click="nav.gotoHome()"/>-->
<!--      </template>-->
<!--      <template #sidebar-header>-->
<!--        <div class="fr mt-2 mb-2 ai-c jc-sb">-->
<!--          <p class="fs-20px fw-15">Collections</p>-->
<!--          <t-btn primary @click="showCreateColDialog">-->
<!--            Add-->
<!--          </t-btn>-->
<!--        </div>-->
<!--      </template>-->
<!--      <template #sidebar-footer>-->
<!--        <t-btn @click="userAPI.signOut()">Sign out</t-btn>-->
<!--      </template>-->
<!--    </TDashboard>-->



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

const selectedSidebarItemIdx = ref(0)

function selectSidebarItem(i) {
  selectedSidebarItemIdx.value = i
}


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
      //component: Collection,
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

<style scoped>
.t-dashboard {
  background-color: #fff;
}
.sidebar {
  width: 46px;
  min-width: 46px;
  border-right: 1px solid #d8dee4;
}

.sidebar-item {
  color: #1f2328;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  background-color: transparent;
}

.sidebar-item--selected {
  color: #0b0d0e;
  background-color: #a7b1bb3d;
}

.sidebar-item:hover {
  background-color: #d0d7de52;
}

.content {
  width: calc(100% - 46px);
}

.item-icon {
  margin-right: 0;
}

.item-text {
  display: none;
}

@media screen and (min-width: 1024px) {
  .sidebar {
    width: 200px;
    min-width: 200px;
  }

  .item-icon {
    margin-right: 0.5em;
  }

  .item-text {
    display: initial;
  }

  .content {
    width: calc(100% - 200px);
  }
}
</style>
<template>
  <template v-if="sidebarItems">
    <div class="t-dashboard h-100vh v-100vw">
      <t-page-header>
        <img src="@/assets/images/logo-full.png" alt="logo-full" style="width: 120px;" @click="nav.gotoHome()"/>
      </t-page-header>
      <t-page-content>
        <div class="fr h-100 w-100">
          <div class="w-200px fc fg-4px ovf-y-s sb-h px-1 py-1" style="border-right: 1px solid #ddd">
            <div class="fr mt-2 mb-2 ai-c jc-sb">
              <p class="fs-20px fw-15">Collections</p>
              <t-btn primary @click="showCreateColDialog">
                Add
              </t-btn>
            </div>
            <div v-for="(item, i) in sidebarItems" :key="item.title"
                 class="fr ai-c px-2 py-1 clickable"
                 :class="selectedSidebarItemIdx === i ? 'bc:#ddd' : 'bc:white'"
                 @click="selectSidebarItem(i)">
              <t-icon>{{ item.icon }}</t-icon>
              <span class="ml-2">{{ item.title }}</span>
            </div>
            <t-spacer/>
            <t-btn @click="userAPI.signOut()">Sign out</t-btn>
          </div>
          <div class="f1 ovf-h">
            <Collection :db-id="dbId" :name="sidebarItems[selectedSidebarItemIdx].title"/>
          </div>
        </div>
      </t-page-content>
    </div>
  </template>
</template>

<script setup lang="ts">
import {inject, computed, ref} from 'vue';
import {userAPI} from '@/api';
import {useNavigation} from '@/composables/useNavigation'
import {useRoute} from 'vue-router'
import {dbAPI} from '../api'
import {onMounted} from "vue";
import Collection from '../components/Collection.vue'
import DialogColCreate from "../components/DialogColCreate.vue";
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
</script>
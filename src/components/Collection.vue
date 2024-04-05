<template>
  <div class="fr jc-fe px-2 py-2" style="border-bottom: 1px solid #ccc">
    <t-btn @click="showWebhook">
      <t-icon>fas fa-link@16px</t-icon>
    </t-btn>
  </div>
  <div class="fr w-100 h-100 rel">
    <div class="f1">
      <TTable>
        <thead>
        <tr>
          <td v-for="field in fields" :key="field">{{field}}</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="doc in documents" class="clickable" @click="setSelectingDoc(doc)">
          <td v-for="field in fields">
            {{doc[field]}}
          </td>
        </tr>
        </tbody>
      </TTable>
      <TPagingToolbar
        class="fr ai-c jc-fs fg-8px px-2 py-2"
        v-bind="paging"
        @update:page="paging.page = $event"/>
    </div>

    <!-- Editor -->
    <div v-if="showEditor" class="abs top-0 right-0 w-400px h-100" style="border-left: 1px solid #ccc">
<!--      <Webhook class="mb-2 mt-2"/>-->
      <DocumentEditor :document="selectingDoc" @close="closeDocEdit()"/>
    </div>
    <div v-else-if="!showEditor&&isWebHookShow" class="abs top-0 right-0 w-500px h-100 bc:#FFFFFF fr jc-c" style="border-left: 1px solid #ccc">
      <Webhook :isWebHookShow="isWebHookShow" :colName="colName" class="mt-2"/>
<!--      <DocumentEditor :document="selectingDoc"/>-->
    </div>
    <div v-else></div>
  </div>
</template>
<script setup>
import {flatten, uniq} from 'lodash-es';
import {ref, reactive, onMounted, computed} from 'vue';
import Webhook from '@/components/Webhook.vue'
import DocumentEditor from "@/components/DocumentEditor.vue";
import {colAPI} from "@/api"

const props = defineProps({
  title: String,
  dbId: String
})

const colName = props.title;

const paging = reactive({
  page: 1,
  itemsPerPage: 10,
  totalItems: 200
})

const documents = ref([])
const fields = computed(() => uniq(flatten(documents.value.map(Object.keys))))

const isWebHookShow=ref(false)
// const showEditor = ref(true)
const showEditor = ref(false)
const selectingDoc = ref()

const setSelectingDoc = (doc) => {
  selectingDoc.value = doc
  showEditor.value = true
}

async function listDocs() {
  documents.value = await colAPI.getDocs(props.dbId, colName, paging.page)
}

function showWebhook() {
  // showEditor.value = !showEditor.value;
  showEditor.value = false;
  isWebHookShow.value = !isWebHookShow.value
}

function closeDocEdit() {
  showEditor.value = false;
}

onMounted(listDocs);
</script>

<style scoped>

</style>
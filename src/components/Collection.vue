<template>
  <div class="fr ai-c jc-sb px-2 py-2" style="border-bottom: 1px solid #ccc">
    <span style="text-transform: uppercase">{{name}}</span>
    <t-btn @click="showWebhook">
      <t-icon>fas fa-link@16px</t-icon>
    </t-btn>
    <t-btn @click="createNewDoc">
      <t-icon>fas fa-plus@16px</t-icon>
    </t-btn>
  </div>
  <div class="fr w-100 h-100 rel">
    <div class="f1 fc fg-8px">
      <TLoading :action="ACTIONS.listDocs">
        <template #loading>
          <TPulseBlock class="h-30px w-100vw"/>
        </template>
        <TTable v-if="documents?.length">
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
      </TLoading>
      <TLoading :action="ACTIONS.countDocs">
        <template #loading>
          <TPulseBlock class="h-30px w-100vw"/>
        </template>
        <TPagingToolbar
          class="fr ai-c jc-fs fg-8px px-2 py-2"
          v-bind="paging"
          @update:page="paging.page = $event"/>
      </TLoading>
    </div>

    <!-- Editor -->
    <div v-if="showEditor" class="abs top-0 right-0 w-400px h-100" style="border-left: 1px solid #ccc">
      <DocumentEditor :document="selectingDoc" @close="closeDocEdit()"/>
    </div>
    <div v-else-if="!showEditor&&isWebHookShow" class="abs top-0 right-0 w-500px h-100 bc:#FFFFFF fr jc-c" style="border-left: 1px solid #ccc">
      <Webhook :isWebHookShow="isWebHookShow" :colName="name" class="mt-2"/>
    </div>
    <div v-else></div>
  </div>
</template>
<script setup>
import {flatten, uniq} from 'lodash-es';
import {ref, reactive, onMounted, watch, inject, computed} from 'vue';
import Webhook from '@/components/Webhook.vue'
import DocumentEditor from "@/components/DocumentEditor.vue";
import DialogDocCreate from "@/components/DialogDocCreate.vue"
import {colAPI} from "@/api"

const props = defineProps({
  name: String,
  dbId: String
})

const {loading, msgBox, dialog} = inject('TSystem');
const paging = reactive({
  page: 1,
  itemsPerPage: 10,
  totalItems: 0
})

const ACTIONS = {
  countDocs: 1,
  listDocs: 2
}

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
  loading.begin(ACTIONS.listDocs)
  documents.value = await colAPI.getDocs(props.dbId, props.name, paging.page)
  loading.end(ACTIONS.listDocs)
}
async function countDocs() {
  loading.begin(ACTIONS.countDocs)
  paging.page = 1;
  paging.totalItems = await colAPI.countDocs(props.dbId, props.name)
  loading.end(ACTIONS.countDocs)
}

function showWebhook() {
  // showEditor.value = !showEditor.value;
  showEditor.value = false;
  isWebHookShow.value = !isWebHookShow.value
}

function closeDocEdit() {
  showEditor.value = false;
}

onMounted(() => {
  countDocs()
  listDocs()
});

watch(() => props.name, () => {
  console.log('watch trigger')
  countDocs()
  listDocs()
});

async function createNewDoc() {
  const doc = await dialog.show(DialogDocCreate)
  if (!doc) return
  const col = props.name.toString();
  try {
    await colAPI.createNewDoc(props.dbId, col, doc)
    notification.info('Successfully creating new doc')
  } catch (error) {
    console.error(`Error creating new document`, error);
  }
}

</script>
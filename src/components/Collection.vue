<template>
  <!-- toolbar -->
  <div class="fr ai-c fg-8px px-2 py-2" style="border-bottom: 1px solid #ccc">
    <span style="text-transform: uppercase">{{ name }}</span>
    <div class="f1"></div>
    <TBtn @click="setSelectingDoc({})">
      <TIcon>fas fa-plus@16px</TIcon>
    </TBtn>
    <TBtn @click="reloadData">
      <TIcon>fas fa-refresh@16px</TIcon>
    </TBtn>
    <TBtn @click="deleteColl">
      <TIcon>fas fa-trash-alt@16px</TIcon>
    </TBtn>
    |
    <TBtn @click="showWebhook">
      <TIcon>fas fa-link@16px</TIcon>
    </TBtn>
  </div>

  <!-- content -->
  <div class="fr w-100 h-100 rel">
    <!-- Data -->
    <div class="f1 fc fg-4px px-2 py-2">
      <TabHeader :tabs="tabs" v-model="tab" style="border-bottom: 1px solid #ddd"/>
      <template v-if="tab === TABS.TABLE">
        <TLoading :action="ACTIONS.listDocs">
          <template #loading>
            <TPulseBlock class="h-30px w-100vw"/>
          </template>

          <!-- data -->
          <TTable v-if="documents?.length">
            <thead>
            <tr>
              <th v-for="field in fields" :key="field">{{field}}</th>
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
      </template>
      <template v-else>
        <CommandExecutor @run="runCmd"/>
        <DataSourcePresenter :data-source="dataSource" @set-selecting-doc="setSelectingDoc"/>
      </template>
    </div>

    <!-- Editor -->
    <div v-if="showEditor" class="w-400px h-100" style="border-left: 1px solid #ccc">
      <DocumentEditor
        :document="selectingDoc"
        @delete="deleteDoc"
        @close="closeDocEdit"
        @save="upsertDoc"/>
    </div>
    <div v-else-if="isWebHookShow" class="abs top-0 right-0 w-700px h-100 bc:#fff" style="border-left: 1px solid #ccc">
      <Webhook :colName="name"/>
    </div>
  </div>
</template>
<script setup>
import collQryBuilder from '@/api/db';
import {flatten, uniq, omit} from 'lodash-es';
import {ref, reactive, onMounted, watch, inject, computed} from 'vue';
import Webhook from '@/components/Webhook.vue'
import {collAPI} from "@/api"
import {dbAPI} from "@/api"
import DocumentEditor from "@/components/DocumentEditor.vue";
import CommandExecutor from "@/components/CommandExecutor.vue";
import DataSourcePresenter from "@/components/DataSourcePresenter.vue";
import TabHeader from "@/components/TabHeader.vue";

const props = defineProps({
  name: String,
  dbId: String
})

const emit = defineEmits(['collDeleted'])

const TABS = {
  TABLE: 1,
  CMD_EXEC: 2
}
const tabs = [
  {text: 'Table', value: TABS.TABLE},
  {text: 'Command Executor', value: TABS.CMD_EXEC}
]
const tab = ref(TABS.TABLE)

const {loading, msgBox, notification} = inject('TSystem');
const paging = reactive({
  page: 1,
  itemsPerPage: 10,
  totalItems: 0
})

const ACTIONS = {
  countDocs: 1,
  listDocs: 2
}

const dataSource = ref()
const documents = ref([])
const fields = computed(() => uniq(flatten(documents.value.map(Object.keys))))

const isWebHookShow=ref(false)
const showEditor = ref(false)

async function listDocs() {
  loading.begin(ACTIONS.listDocs)
  documents.value = await collAPI.getDocs(props.dbId, props.name, paging.page)
  loading.end(ACTIONS.listDocs)
}
async function countDocs() {
  loading.begin(ACTIONS.countDocs)
  paging.page = 1;
  paging.totalItems = await collAPI.countDocs(props.dbId, props.name)
  loading.end(ACTIONS.countDocs)
}

function showWebhook() {
  showEditor.value = false;
  isWebHookShow.value = !isWebHookShow.value
}

function closeDocEdit() {
  showEditor.value = false;
}

function reloadData() {
  countDocs()
  listDocs()
}

onMounted(reloadData);
onMounted(() => collQryBuilder(props.dbId, dataSource))
watch(() => props.name, reloadData);

const selectingDoc = ref()
function setSelectingDoc(doc) {
  selectingDoc.value = doc
  showEditor.value = true
}

async function upsertDoc(doc) {
  if (!doc) return
  try {
    if (doc._id) {
      await collAPI.updateDoc(props.dbId, props.name, doc._id, omit(doc, ['_id']));
      notification.info('Successfully updating document');
    } else {
      await collAPI.createDoc(props.dbId, props.name, doc);
      notification.info('Successfully create document');
    }
    setTimeout(reloadData, 500);
    showEditor.value = false;
  } catch (error) {
    console.error(`Error in updating document`, error);
  }
}

async function deleteDoc() {
  const rs = await msgBox.show(
    'Delete Document Confirm',
    'Are you sure you want to delete this document?',
    msgBox.Buttons.YesNo,
    msgBox.Icons.Question
  )
  if (rs === msgBox.Results.yes) {
    await collAPI.deleteDoc(props.dbId, props.name, selectingDoc.value._id)
    showEditor.value = false;
    setTimeout(reloadData, 500)
    notification.info('Successfully deleting document')
  }
}

async function deleteColl() {
  const rs = await msgBox.show(
    'Delete Collection Confirm',
    `Are you sure you want to delete collection: ${props.name}?`,
    msgBox.Buttons.YesNo,
    msgBox.Icons.Question
  )
  if (rs === msgBox.Results.yes) {
    const ok = await dbAPI.deleteCollection(props.dbId, props.name)
    if (ok) {
      notification.info('Successfully deleting document')
      emit('collDeleted')
    } else {
      await msgBox.show(
        'Warning',
        `Please delete all webhooks related to this collection first!`,
        msgBox.Buttons.OK,
        msgBox.Icons.Warning
      )
    }
  }
}


function runCmd(content) {
  console.log('runCmd', content);
  const wrapCmd = `let x = async function(){ ${content} }; x();`;
  eval(wrapCmd);
}
</script>
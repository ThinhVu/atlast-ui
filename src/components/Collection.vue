<template>
  <!-- toolbar -->
  <div class="fr ai-c fg-8px px-2 py-2" style="border-bottom: 1px solid #ccc">
    <span style="text-transform: uppercase">{{ name }}</span>
    <div class="f1"></div>
    <TBtn @click="setSelectingDoc({})">
      <TIcon>fas fa-plus@16px</TIcon>
    </TBtn>
    <TBtn @click="showFilterBar">
      <TIcon>fas fa-filter@16px</TIcon>
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
      <TLoading :action="ACTIONS.listDocs">
        <template #loading>
          <TPulseBlock class="h-30px w-100vw"/>
        </template>

        <!-- filter -->
        <div v-if="showFilter" class="fr fg-4px">
          <select v-model="selected">
            <option value="">All fields</option>
            <option v-for="field in fields" :key="field">{{ field }}</option>
          </select>
          <t-text v-model="searchValue" placeholder="Enter filter" class="f1"/>
          <t-btn delete @click="closeFilterBar">
            <t-icon>fas fa-times@16px@bc:#fff</t-icon>
          </t-btn>
        </div>

        <!-- data -->
        <TTable v-if="documents?.length">
          <thead>
          <tr>
            <th v-for="field in fields" :key="field">{{field}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="doc in filteredDocs" class="clickable" @click="setSelectingDoc(doc)">
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
import {flatten, uniq, omit} from 'lodash-es';
import {ref, reactive, onMounted, watch, inject, computed} from 'vue';
import Webhook from '@/components/Webhook.vue'
import DocumentEditor from "@/components/DocumentEditor.vue";
import {collAPI} from "@/api"
import {dbAPI} from "@/api"

const props = defineProps({
  name: String,
  dbId: String
})

const emit = defineEmits(['collDeleted'])

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

const documents = ref([])
const fields = computed(() => uniq(flatten(documents.value.map(Object.keys))))

const isWebHookShow=ref(false)
const showEditor = ref(false)
const searchValue = ref()
const showFilter = ref(false)
const selected = ref('')

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

const filteredDocs = computed(() => {
  if (selected.value && searchValue.value) {
    return documents.value.filter(obj => {
      let valueToSearch = obj[selected.value];
      if (typeof valueToSearch === 'number') {
        valueToSearch = valueToSearch.toString();
      }
      return valueToSearch.includes(searchValue.value);
    });
  } else if (!selected.value && searchValue.value) {
    return documents.value.filter(obj => {
      return Object.values(obj).some(value => {
        const stringValue = typeof value === 'number' ? value.toString() : value;
        return stringValue.includes(searchValue.value);
      });
    });
  } else {
    return documents.value;
  }
})

function showFilterBar() {
  showFilter.value = true
}

function closeFilterBar() {
  showFilter.value = false
  searchValue.value = ""
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

</script>
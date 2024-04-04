<template>
  <div class="fr jc-fe px-2 py-2" style="border-bottom: 1px solid #ccc">
    <t-btn @click="showWebhook">
      <t-icon>fas fa-link@16px</t-icon>
    </t-btn>
  </div>
  <div class="fr w-100 h-100 rel">
    <!-- Data table -->
    <div class="f1">
      <TTable>
<!--        <thead>-->
<!--        <tr v-for=>-->
<!--          <td>ID</td><td>Product name</td><td>Product Price</td><td>Manufacture Date</td>-->
<!--        </tr>-->
<!--        </thead>-->
        <tbody>
        <tr v-for="doc in documents" class="clickable" @click="setSelectingDoc(doc)">
          <td v-for="value in Object.keys(doc)">
            {{value}}
          </td>
<!--          <td>{{doc.id}}</td><td>{{doc.name}}</td><td>{{doc.price}}</td><td>{{doc.manufactureDate}}</td>-->
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
import {ref, reactive, inject, onMounted} from 'vue';
import Webhook from '@/components/Webhook.vue'
import DocumentEditor from "@/components/DocumentEditor.vue";
import {colAPI} from "@/api"


const dbId = inject('dbId')
const props = defineProps(['title'])

const colName = props.title;

const paging = reactive({
  page: 1,
  itemsPerPage: 10,
  totalItems: 200
})

const documents = ref([])

const isWebHookShow=ref(false)
// const showEditor = ref(true)
const showEditor = ref(false)
const selectingDoc = ref()

const setSelectingDoc = (doc) => {
  selectingDoc.value = doc
  showEditor.value = true
}

onMounted(listDocs);
async function listDocs() {
  documents.value = await colAPI.getDocs(dbId, colName, paging.page)
}

setTimeout(listDocs,100)

// const documents = [
//   {id: 1, name: 'Product 1', price: 10, manufactureDate: '2024-01-01'},
//   {id: 2, name: 'Product 2', price: 10, manufactureDate: '2024-01-01'},
//   {id: 3, name: 'Product 3', price: 10, manufactureDate: '2024-01-01'},
//   {id: 4, name: 'Product 4', price: 10, manufactureDate: '2024-01-01'},
//   {id: 5, name: 'Product 5', price: 10, manufactureDate: '2024-01-01'},
//   {id: 6, name: 'Product 6', price: 10, manufactureDate: '2024-01-01'},
//   {id: 7, name: 'Product 7', price: 10, manufactureDate: '2024-01-01'},
//   {id: 8, name: 'Product 8', price: 10, manufactureDate: '2024-01-01'},
//   {id: 9, name: 'Product 9', price: 10, manufactureDate: '2024-01-01'},
//   {id: 10, name: 'Product 10', price: 10, manufactureDate: '2024-01-01'},
//   {id: 11, name: 'Product 11', price: 10, manufactureDate: '2024-01-01'},
//   {id: 12, name: 'Product 12', price: 10, manufactureDate: '2024-01-01'},
//   {id: 13, name: 'Product 13', price: 10, manufactureDate: '2024-01-01'},
// ]

function showWebhook() {
  // showEditor.value = !showEditor.value;
  showEditor.value = false;
  isWebHookShow.value = !isWebHookShow.value
}

function closeDocEdit() {
  showEditor.value = false;
}

</script>

<style scoped>

</style>
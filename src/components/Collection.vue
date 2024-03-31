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
        <thead>
        <tr><td>ID</td><td>Product name</td><td>Product Price</td><td>Manufacture Date</td></tr>
        </thead>
        <tbody>
        <tr v-for="doc in documents" class="clickable" @click="setSelectingDoc(doc)">
          <td>{{doc.id}}</td><td>{{doc.name}}</td><td>{{doc.price}}</td><td>{{doc.manufactureDate}}</td>
        </tr>
        </tbody>
      </TTable>
      <TPagingToolbar
        class="fr ai-c jc-fs fg-8px px-2 py-2"
        v-bind="paging"
        @update:page="paging.page = $event"/>
    </div>

    <!-- Editor -->
    <div v-if="showEditor" class="abs top-0 right-0 w-400px h-100">
      <Webhook class="mb-2 mt-2"/>
      <DocumentEditor :document="selectingDoc"/>
    </div>
  </div>
</template>
<script setup>
import {ref, reactive} from 'vue';
import Webhook from '@/components/Webhook.vue'
import DocumentEditor from "@/components/DocumentEditor.vue";

const paging = reactive({
  page: 1,
  itemsPerPage: 10,
  totalItems: 300
})

const isWebHookShow=ref(false)
const showEditor = ref(true)
const selectingDoc = ref()

const setSelectingDoc = (doc) => {
  selectingDoc.value = doc
  showEditor.value = true
}

const documents = [
  {id: 1, name: 'Product 1', price: 10, manufactureDate: '2024-01-01'},
  {id: 2, name: 'Product 2', price: 10, manufactureDate: '2024-01-01'},
  {id: 3, name: 'Product 3', price: 10, manufactureDate: '2024-01-01'},
  {id: 4, name: 'Product 4', price: 10, manufactureDate: '2024-01-01'},
  {id: 5, name: 'Product 5', price: 10, manufactureDate: '2024-01-01'},
  {id: 6, name: 'Product 6', price: 10, manufactureDate: '2024-01-01'},
  {id: 7, name: 'Product 7', price: 10, manufactureDate: '2024-01-01'},
  {id: 8, name: 'Product 8', price: 10, manufactureDate: '2024-01-01'},
  {id: 9, name: 'Product 9', price: 10, manufactureDate: '2024-01-01'},
  {id: 10, name: 'Product 10', price: 10, manufactureDate: '2024-01-01'},
]

function showWebhook() {
  showEditor.value = !showEditor.value;
  isWebHookShow.value = true;
}
</script>

<style scoped>

</style>
<script setup>
import {flatten, isObject, uniq} from 'lodash-es';
import {computed, ref, watch} from "vue";

const props = defineProps(['dataSource'])
const emit = defineEmits(['setSelectingDoc'])

const documents = ref([])
const fields = computed(() => uniq(flatten(documents.value.map(Object.keys))))
watch(() => props.dataSource, (v) => {
  if (isObject(v)) {
    documents.value = v
  }
})

function setSelectingDoc(doc) {
  emit('setSelectingDoc', doc)
}
</script>

<template>
  <template v-if="isObject(dataSource)">
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
  </template>
  <template v-else>
    {{dataSource}}
  </template>
</template>

<style scoped>

</style>
<script setup>
import {onMounted, ref} from 'vue';


const props = defineProps({
  document: Object
})

const emit = defineEmits(['close', 'save', 'delete'])

function closeDocEdit() {
  emit('close')
}

const docs = ref('')

onMounted(getDocs)

onMounted(() => {
  const editableContent = document.getElementById('editableContent');
  editableContent.focus();
});
function getDocs() {
  docs.value = JSON.stringify(props.document,null,2)

}

function saveDoc() {
  const editableContent = document.getElementById('editableContent');
  const input = JSON.parse(editableContent.textContent);
  let {_id, ...inputData } = input;
  emit('save', inputData);
}

function deleteDoc() {
  emit ('delete')
}

</script>

<template>
  <div class="fc w-100 h-100 bc:#fff px-2 py-2">
    <div class="mt-2 mb-2 fr ai-fe jc-fe">
      <t-icon @click="deleteDoc()">fas fa-trash-alt@16px</t-icon>
    </div>
    <pre class="mt-2 mb-2" id="editableContent" contenteditable="true">{{JSON.stringify(props.document,null,2)}}</pre>
    <div class="fr ai-c jc-fe fg-8px mt-2">
      <TBtn @click="closeDocEdit()">Cancel</TBtn>
      <TBtn save @click="saveDoc()">Save</TBtn>
    </div>
  </div>
</template>

<style scoped>

</style>
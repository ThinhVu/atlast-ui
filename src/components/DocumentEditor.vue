<script setup>
import {onMounted, ref} from 'vue';

const props = defineProps({
  document: Object
})

const emit = defineEmits(['close', 'save'])

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

function saveDocs() {
  const editableContent = document.getElementById('editableContent');
  const inputData = JSON.parse(editableContent.textContent);
  emit('save', inputData);
}


</script>

<template>
  <div class="fc w-100 h-100 bc:#fff px-2 py-2">
    <pre id="editableContent" contenteditable="true">{{JSON.stringify(document,null,2)}}</pre>
    <div class="fr ai-c jc-fe fg-8px">
      <TBtn @click="closeDocEdit()">Cancel</TBtn>
      <TBtn save @click="saveDocs">Save</TBtn>
    </div>
  </div>
</template>

<style scoped>

</style>
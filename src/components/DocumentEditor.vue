<script setup>
import {ref} from 'vue';
import MonacoEditor from "@/components/MonacoEditor.vue";

const props = defineProps({document: Object})
const emit = defineEmits(['close', 'save', 'delete'])

const codeEditorEl = ref()

function deleteDoc() {
  emit ('delete')
}

function closeDocEdit() {
  emit('close')
}

function saveDoc() {
  const content = codeEditorEl.value.getContent()
  if (!content)
    return
  emit('save', JSON.parse(content));
}
</script>

<template>
  <div class="fc w-100 h-100 bc:#fff px-2 py-2">
    <monaco-editor
      :content="JSON.stringify(props.document, null, 4)"
      :dimension="{width: 380, height: 400}"
      ref="codeEditorEl"/>

    <div class="fr ai-c jc-fe fg-8px mt-2">
      <TBtn delete @click="deleteDoc">
        <t-icon>fas fa-trash-alt@16px:#fff</t-icon>
      </TBtn>
      <TSpacer/>
      <TBtn @click="closeDocEdit">Cancel</TBtn>
      <TBtn save @click="saveDoc">{{document?._id ? 'Save': 'Create'}}</TBtn>
    </div>
  </div>
</template>

<style scoped>

</style>
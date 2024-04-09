<template>
  <TGuard :silent="false">
    <div ref="editorEl"></div>
  </TGuard>
</template>
<script setup>
import * as monaco from 'monaco-editor';
import {onMounted, ref, watch} from 'vue';

const props = defineProps({
  content: String,
  dimension: Object,
  language: {
    type: String,
    default: 'json'
  }
})
const editorEl = ref()
let editorIns
onMounted(() => {
  try {
    editorIns = monaco.editor.create(editorEl.value, {
      value: props.content,
      language: props.language,
      minimap: {
        enabled: false
      },
      dimension: props.dimension || {
        width: 380 /*side-bar width: fixed for now*/,
        height: 200
      },
      theme: 'vs-dark',
      fontSize: '14px',
    })
  } catch (e) {
    console.log('onMounted')
    console.error(e)
  }
})
watch(() => props.content, () => {
  if (editorIns) {
    console.log('update content')
    editorIns.getModel().setValue(props.content)
  } else {
    console.log('hmm')
  }
})

defineExpose({
  getContent: function () {
    if (editorIns)
      return editorIns.getModel().getValue()
  }
})
</script>

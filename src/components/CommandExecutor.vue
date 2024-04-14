<script setup>
import {ref} from 'vue';
import MonacoEditor from "@/components/MonacoEditor.vue";

const props = defineProps({command: Object})
const emit = defineEmits(['run'])

const codeEditorEl = ref()

function run() {
  const content = codeEditorEl.value.getContent()
  if (!content)
    return
  emit('run', content);
}
</script>

<template>
  <div>
    <TBtn @click="run">
      <TIcon>fas fa-play@16px</TIcon>
    </TBtn>
  </div>
  <monaco-editor
    class="w-100"
    :content="props.command"
    :dimension="{width: 500, height: 200}"
    ref="codeEditorEl"/>
</template>

<style scoped>

</style>
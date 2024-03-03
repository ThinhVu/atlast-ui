<template>
  <div class="modal">
      <div class="modal-inner">
          <slot/>
          <button @click="buttonClick">Cancel</button>
          <button>Delete</button>
      </div>
  </div>
</template>


<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['hideModal']);

function buttonClick() {
    emit('hideModal');
}
</script>


<style scoped>
.modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-inner{
    position: relative;
    background: #fff;
    padding: 32px;

}
</style>

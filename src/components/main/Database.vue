<template>
  <div>
      <button class="mb-10"
      style="font-size:18px; background-color: #669462; color: white; margin-top: 10px; margin-left: 5px">Create database</button>
      <ul>
          <ItemComponent/>
      </ul>
  </div>

</template>
<script setup>
import ItemComponent from './database/Item.component.vue'

</script>
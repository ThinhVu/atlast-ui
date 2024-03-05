<script setup>
import {ref, computed} from 'vue'

const custom = ref('Custom')
const billValue = ['$10', '$20', '$50', custom.value]

const selectedValue = ref('')

const currentBalance = computed(() => {
  return selectedValue.value;
});
</script>

<template>
  <section class="px-4 py-4">
    <div class="fr fg-16px">
      <div class="px-4 py-4 w-350px br-3" style="border: 1px solid">
        <div class="mt-2 mb-4">
          <p style="padding-bottom: 15px">Your balance</p>
          <p style="padding-bottom: 30px">Current balance: {{ (currentBalance !== 'Custom') ? currentBalance : '' }}</p>
          <p>Buy credit</p>
        </div>
        <div class="fr fg-8px">
          <div v-for="(item, index) in billValue" :key="index">
            <t-btn @click="selectedValue=item">{{ item }}</t-btn>
          </div>
        </div>
        <div>
          <t-btn save class="mt-2 w-280px">Buy credit</t-btn>
        </div>
      </div>
      <div class="px-4 py-4 f1 br-3" style="border: 1px solid">Payment history</div>
    </div>
  </section>
</template>
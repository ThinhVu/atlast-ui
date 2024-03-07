<script setup>
import {ref, computed} from 'vue'
import {user} from '@/app-state'

// TODO: display current balance
const currentBalance = computed(() => user.value.balance);

const predefinedBuyValues = [10, 20, 50]
const selectedValue = ref(predefinedBuyValues[0])
const proceedBuy = async () => {
  const amount = Number(selectedValue.value)
  // TODO: buy amount
  console.log('proceedBuy', amount)
}
</script>

<template>
  <section class="px-4 py-4">
    <div class="fr fg-16px">
      <div class="px-4 py-4 w-350px br-2 fc fg-16px" style="border: 1px solid #ddd">
        <p>Your balance</p>
        <p>Current balance: {{ (currentBalance !== 'Custom') ? currentBalance : '' }}</p>
        <hr/>
        <p>Buy credit</p>
        <div class="fr fg-8px">
          <t-btn v-for="item in predefinedBuyValues"
                 :key="item"
                 @click="selectedValue = item"
                 :primary="selectedValue === item">
            {{ item }}
          </t-btn>
          <TText v-model="selectedValue"/>
        </div>
        <t-btn @click="proceedBuy" save class="mt-2">Buy credit</t-btn>
      </div>
      <div class="px-4 py-4 f1 br-3" style="border: 1px solid #ddd">
        Payment history
      </div>
    </div>
  </section>
</template>
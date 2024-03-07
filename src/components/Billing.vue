<script setup>
import {ref, computed, inject, onMounted} from 'vue'
import {user} from '@/app-state'
import {paymentAPI} from '../api/index'

const {msgBox, notification} = inject('TSystem')


onMounted(loadBalance)
async function loadBalance() {
  user.value = await paymentAPI.getCurrentBalance();
}

const currentBalance = computed(() => user.value.balance);



const predefinedBuyValues = [10, 20, 50]
const selectedValue = ref(predefinedBuyValues[0])

const proceedBuy = async () => {
  const amount = Number(selectedValue.value)
  if(Number(currentBalance.value) < amount || currentBalance.value==="") {
    await msgBox.show(
      'Insufficient funds to complete this transaction.',
      'Please deposit more money into your account or update your payment method.',
      msgBox.Buttons.OK
    )
  } else {
    await paymentAPI.updateBalance(amount);
    notification.info('Successful making payment')
    console.log('proceedBuy', amount)
    setTimeout(loadBalance, 500);
  }
}

</script>

<template>
  <section class="px-4 py-4">
    <div class="fr fg-16px">
      <div class="px-4 py-4 w-350px br-2 fc fg-16px" style="border: 1px solid #ddd">
        <p>Your balance</p>
        <p>Current balance: {{currentBalance}}</p>
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
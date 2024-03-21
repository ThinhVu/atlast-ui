<script setup>
import {ref, computed, inject, onMounted} from 'vue'
import {user} from '@/app-state'
import {paymentAPI} from '../api/index'
import dayjs from "dayjs";

const {msgBox, notification} = inject('TSystem')

const paymentHistory = ref([])

onMounted(loadBalance)
onMounted(showPayment)
async function loadBalance() {
  user.value = await paymentAPI.getCurrentBalance();
}

async function showPayment() {
  paymentHistory.value = await paymentAPI.getPaymentHistory()
}

const currentBalance = computed(() => user.value.balance);



const predefinedBuyValues = [10, 20, 50]
const selectedValue = ref(predefinedBuyValues[0])

const proceedBuy = async () => {
  const amount = Number(selectedValue.value)
    // await paymentAPI.depositMoney(amount);
    // notification.info('Successful deposit payment')
    // console.log('proceedBuy', amount);
    // await paymentAPI.updatePaymentHistory(amount);
    // setTimeout(loadBalance, 500);
    // setTimeout(showPayment, 500);
  await msgBox.show(
    'Note',
    'This function is not fully developed.\nPress Yes to exit.',
    msgBox.Buttons.Ok)
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
        <p class="mb-3 ac-c f1">Payment history</p>
        <t-table class="w-100 max-h-400px">
          <thead>
          <tr>
            <th class="z-index-1">Amount</th>
            <th class="z-index-1">Date</th>
            <th class="z-index-1">Status</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="pm in paymentHistory" :key="pm._id">
            <td>{{pm.value}}</td>
            <td>
              {{dayjs(pm.createDt).format('YYYY-MM-DD HH:mm:ss')}}
            </td>
            <td>Succeeded</td>
          </tr>
          </tbody>
        </t-table>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, computed, inject, onMounted} from 'vue'
import {user} from '@/app-state'
import {paymentAPI} from '../api/index'
import dayjs from "dayjs";
import PaypalButton from "@/components/PaypalButton.vue";
import {PAYPAL_CLIENT_ID} from "@/constants";

const {msgBox, notification} = inject('TSystem')

const paymentHistory = ref([])

onMounted(loadBalance)
onMounted(loadPayments)

async function loadBalance() {
  user.value = await paymentAPI.getCurrentBalance();
}
async function loadPayments() {
  paymentHistory.value = await paymentAPI.getPaymentHistory()
}

const currentBalance = computed(() => user.value.balance);
const predefinedBuyValues = [1, 6, 12, 60, 120, 600, 1200];
const buyValueModels = predefinedBuyValues.map(v => ({text: `$${v}`, value: v}))
const selectedValue = ref(predefinedBuyValues[0])

const paypalOrderInfo = computed(() => {
  return {
    application_context: {
      brand_name: "Atlast",
      locale: "en-US", // using custom locale instead of paypal user locale
      landing_page: 'NO_PREFERENCE', // let paypal decide whether login page or billing page will be display depend on user login condition
      shipping_preference: 'NO_SHIPPING', // hide shipping information in paypal order
      user_action: 'CONTINUE'
    },
    purchase_units: [{
      custom_id: `${user.value?._id}`,
      amount: {
        currency_code: "USD",
        value: selectedValue.value
      }
    }]
  }
})
const clientId = PAYPAL_CLIENT_ID;
const confirmPayPalPayment = async (details) => {
  console.log('details', details);
  await paymentAPI.pay(details);
  notification.success('Payment completed. Your account balance will be updated in a few seconds')
  setTimeout(() => location.reload(), 2000)
}
</script>

<template>
  <section class="px-4 py-4">
    <div class="fr fg-16px">
      <!-- balance -->
      <div class="px-4 py-4 w-350px br-2 fc fg-16px" style="border: 1px solid #ddd">
        <p>Your balance</p>
        <p>Current balance: {{ currentBalance }}</p>
        <hr/>
        <TCombobox
          v-model="selectedValue"
          :options="buyValueModels"
          item-text="text"
          item-value="value"/>
        <PaypalButton
          v-if="selectedValue"
          self-host debug
          :order-info="paypalOrderInfo"
          :clientId="clientId"
          @capture="confirmPayPalPayment"/>
      </div>
      <!-- payment history -->
      <div class="px-4 py-4 f1 br-3" style="border: 1px solid #ddd">
        <p class="mb-3 ac-c f1">Payment history</p>
        <t-table class="w-100 max-h-400px">
          <thead>
          <tr>
            <th class="z-index-1">Type</th>
            <th class="z-index-1">Value</th>
            <th class="z-index-1">Date</th>
            <th class="z-index-1">Status</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="pm in paymentHistory" :key="pm._id">
            <td>{{ pm.type }}</td>
            <td>{{ pm.type === 'PayPal' ? pm.metadata.purchase_units[0].amount.value : pm.value }}</td>
            <td>
              {{ dayjs(pm.createDt).format('YYYY-MM-DD HH:mm:ss') }}
            </td>
            <td>Succeeded</td>
          </tr>
          </tbody>
        </t-table>
      </div>
    </div>
  </section>
</template>

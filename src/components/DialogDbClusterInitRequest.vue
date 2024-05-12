<template>
  <div class="bc:white pb-3 mx-a min-w-400px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <p class="px-4 py-4 f1">Create new cluster</p>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1 fc fg-4px max-w-400px">
      <p>Plan:</p>
      <TCombobox v-model="plan" :options="plans" item-text="text" item-value="value"/>

      <p>Region:</p>
      <TCombobox v-model="region" :options="regions" item-text="text" item-value="value"/>

      <p>Note:</p>
      <TText v-model="note"/>

      <br/>
      <p class="fs-xs">* In Australia and Japan, we offer 10 TB of outgoing, and unlimited inbound data transfer at the same great performance.</p>
    </div>
    <div class="px-3 py-1 fr ai-c jc-fe fg-4px">
      <TBtn @click="emit('close')">Cancel</TBtn>
      <TBtn @click="createTicket" save>Create a ticket</TBtn>
    </div>
  </div>
</template>

<script setup>
import {inject, ref} from 'vue'

const emit = defineEmits(['close'])

const {notification} = inject('TSystem')

// cluster plan
const plans = [
  {
    text: '4 vCPU Cores, 6 GB RAM, 100 GB NVMe (400 GB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'vps1'
  },
  {
    text: '6 vCPU Cores, 16 GB RAM, 200 GB NVMe (400 GB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'vps2'
  },
  {
    text: '8 vCPU Cores, 24 GB RAM, 300 GB NVMe (1.2 TB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'vps3'
  },
  {
    text: '12 vCPU Cores, 48 GB RAM, 400 GB NVMe (1.6 TB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'vps4'
  },
  {
    text: '16 vCPU Cores, 64 GB RAM, 500 GB NVMe (2 TB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'vps5'
  },
  {
    text: '24 vCPU Cores, 120 GB RAM, 600 GB NVMe (2.4 TB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'vps6'
  }
]
const plan = ref()

// cluster region
const regions = [
  {
    text: 'European Union',
    desc: '4 machines will be used to make a clusters (1 primary, 2 secondary, 1 delayed backup). All of them will be located at EU region',
    value: 'eu'
  },
  {
    text: 'United Kingdom',
    desc: '4 machines will be used to make a clusters (1 primary, 2 secondary, 1 delayed backup).  All of them will be located at Un',
    value: 'uk'
  },
  {
    text: 'United States (Central)',
    desc: '4 machines will be used to make a clusters (1 primary, 2 secondary, 1 delayed backup)',
    value: 'us-central'
  },
  {
    text: 'United States (East)',
    desc: '4 machines will be used to make a clusters (1 primary, 2 secondary, 1 delayed backup)',
    value: 'us-east'
  },
  {
    text: 'United States (West)',
    desc: '4 machines will be used to make a clusters (1 primary, 2 secondary, 1 delayed backup)',
    value: 'us-west'
  },
  {
    text: 'Asia (Singapore)',
    desc: '4 machines will be used to make a clusters (1 primary, 2 secondary, 1 delayed backup)',
    value: 'asia-singapore'
  },
  {
    text: 'Asia (Japan)',
    desc: '4 machines will be used to make a clusters (1 primary, 2 secondary, 1 delayed backup)',
    value: 'asia-japan'
  },
  {
    text: 'Australia (Sydney)',
    desc: '4 machines will be used to make a clusters (1 primary, 2 secondary, 1 delayed backup)',
    value: 'au'
  },
  {
    text: 'Worldwide (US + EU + Asia)',
    desc: '4 machines will be used to make a clusters (1 primary, 2 secondary, 1 delayed backup)',
    value: 'worldwide'
  }
]
const region = ref('')

// creete db if already having cluster
const note = ref('')

function createTicket() {

}
</script>

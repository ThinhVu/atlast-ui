<template>
  <div class="bc:white pb-3 mx-a min-w-600px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <p class="px-4 py-4 f1">Order private cluster</p>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1 fc fg-4px max-w-600px">
      <p>Configuration:</p>
      <TCombobox v-model="configuration" :options="configurations" item-text="text" item-value="value"/>

      <p>Region:</p>
      <TCombobox v-model="region" :options="regions" item-text="text" item-value="value"/>

      <p>Plan:</p>
      <TCombobox v-model="plan" :options="plans" item-text="text" item-value="value"/>

      <p>Note:</p>
      <TText v-model="note"/>

      <br/>
      <p class="ta-r">Total: ${{totalCost}}</p>
      <hr/>
      <p class="fs-xs">* In Australia and Japan, we offer 10 TB of outgoing, and unlimited inbound data transfer at the same great performance.</p>
    </div>
    <div class="px-3 py-1 fr ai-c jc-fe fg-4px">
      <TBtn @click="emit('close')">Cancel</TBtn>
      <TBtn @click="createTicket" save>Create order</TBtn>
    </div>
  </div>
</template>

<script setup>
import {inject, ref, computed} from 'vue';
import {orderAPI} from '@/api/index';

const emit = defineEmits(['close'])

const {notification} = inject('TSystem')

// cluster plan
const configurations = [
  {
    text: '2 vCPU Cores, 3 GB RAM, 800 GB SSD, 200 Mbit/s Port, 32 TB Traffic (Unlimited Incoming)',
    value: 'storage_vps1',
    price: 44,
  },
  {
    text: '4 vCPU Cores, 8 GB RAM, 800 GB SSD, 400 Mbit/s Port, 32 TB Traffic (Unlimited Incoming)',
    value: 'storage_vps2',
    price: 100,
  },
  {
    text: '6 vCPU Cores, 12 GB RAM, 2.4 TB SSD, 600 Mbit/s Port, 32 TB Traffic (Unlimited Incoming)',
    value: 'storage_vps3',
    price: 140,
  },
  {
    text: '10 vCPU Cores, 24 GB RAM, 3.2 TB SSD, 1 Gbit/s Port, 32 TB Traffic (Unlimited Incoming)',
    value: 'storage_vps4',
    price: 260,
  },
  {
    text: '12 vCPU Cores, 32 GB RAM, 4 TB SSD, 1 Gbit/s Port, 32 TB Traffic (Unlimited Incoming)',
    value: 'storage_vps5',
    price: 336,
  },
  {
    text: '18 vCPU Cores, 60 GB RAM, 4.8 TB SSD, 1 Gbit/s Port, 32 TB Traffic (Unlimited Incoming)',
    value: 'storage_vps6',
    price: 616,
  },
  {
    text: '4 vCPU Cores, 6 GB RAM, 100 GB NVMe (400 GB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'cloud_vps1',
    price: 44,
  },
  {
    text: '6 vCPU Cores, 16 GB RAM, 200 GB NVMe (400 GB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'cloud_vps2',
    price: 100,
  },
  {
    text: '8 vCPU Cores, 24 GB RAM, 300 GB NVMe (1.2 TB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'cloud_vps3',
    price: 140,
  },
  {
    text: '12 vCPU Cores, 48 GB RAM, 400 GB NVMe (1.6 TB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'cloud_vps4',
    price: 260,
  },
  {
    text: '16 vCPU Cores, 64 GB RAM, 500 GB NVMe (2 TB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'cloud_vps5',
    price: 336,
  },
  {
    text: '24 vCPU Cores, 120 GB RAM, 600 GB NVMe (2.4 TB SSD), 32 TB Traffic (Unlimited Incoming)',
    value: 'cloud_vps6',
    price: 616,
  }
]
const configuration = ref(configurations[0].value)

// cluster region
const regions = [
  {
    text: 'European Union',
    value: 'eu'
  },
  {
    text: 'United Kingdom',
    value: 'uk'
  },
  {
    text: 'United States (Central)',
    value: 'us-central'
  },
  {
    text: 'United States (East)',
    value: 'us-east'
  },
  {
    text: 'United States (West)',
    value: 'us-west'
  },
  {
    text: 'Asia (Singapore)',
    value: 'asia-singapore'
  },
  {
    text: 'Asia (Japan)',
    value: 'asia-japan'
  },
  {
    text: 'Australia (Sydney)',
    value: 'au'
  },
  {
    text: 'Worldwide (US + EU + Asia)',
    value: 'worldwide'
  }
]
const region = ref('')

const plans = [
  {text: '3 months', value: 3},
  {text: '6 months', value: 6},
  {text: '12 months', value: 12},
  {text: '18 months', value: 18},
  {text: '24 months', value: 24},
]
const plan = ref(plans[0].value)

// create db if already having cluster
const note = ref('')

const totalCost = computed(() => {
  if (!configuration.value) return 0;
  if (!plan.value) return 0;
  const configurationObj = configurations.find(c => c.value === configuration.value)
  return configurationObj.price * plan.value;
})

async function createTicket() {
  orderAPI.create({
    configuration: configuration.value,
    region: region.value,
    plan: plan.value,
    note: note.value
  })
}
</script>

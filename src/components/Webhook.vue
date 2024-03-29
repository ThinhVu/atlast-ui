<template>
  <div v-if="isWebHookShow" class="sidebar fe">
    <i class="fas fa-times" @click="closeWebhook()"></i>
    <t-table class="w-100 max-h-400px">
      <thead>
      <tr>
        <th class="z-index-1">Db Name</th>
        <th class="z-index-1">Collection Name</th>
        <th class="z-index-1">Webhook URL</th>
        <th class="z-index-1">Create At</th>
        <th class="w-10px z-index-1">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="wh in webhooks" :key="wh._id">
        <td>{{wh.dbName}}</td>
        <td>{{wh.colName}}</td>
        <td>
          {{wh.to}}
        </td>
        <td>
          {{dayjs(wh.createDt).format('YYYY-MM-DD HH:mm:ss')}}
        </td>
        <td>
          <div class="fr ai-c fg-4px">
            <t-btn secondary class="fn-btn" @click="showUpdateWebHookDialog(wh)">
              Change WebHook
            </t-btn>
            <t-btn delete class="fn-btn" @click="deleteWebhookConfirm(wh)">
              Remove
            </t-btn>
          </div>
        </td>
      </tr>
      </tbody>
    </t-table>
    <i class="fas fa-plus-circle round fs-25px" @click="showCreateWebHookDialog()"></i>
  </div>
</template>
<script setup>
import {webhookAPI} from '@/api'
import dayjs from "dayjs";
import {ref, onMounted, inject} from 'vue';
import DialogWebhookCreate from "@/components/DialogWebhookCreate.vue";
import DialogWebhookUpdate from "@/components/DialogWebHookUpdate.vue"

const {msgBox, dialog, notification} = inject('TSystem')

const props = defineProps({
 isWebHookShow: Boolean,
})


const emitClose = defineEmits(['close']);

const closeWebhook = () => {
  emitClose('close');
};


const dbId = inject('dbId')


const webhooks = ref([])

onMounted(getWebHooks)
async function getWebHooks() {
  webhooks.value = await webhookAPI.listDbWebHook(dbId)
}

async function showCreateWebHookDialog(dbId) {
  const data = await dialog.show({
    component: DialogWebhookCreate,
    data: dbId
  })
  if (!data) return
  try {
    await webhookAPI.createDbWebHook(dbId, data);
    notification.info('Successfully created new webhook');
    setTimeout(getWebHooks, 500);
  } catch (error) {
    console.error('Error creating new webhook:', error);
  }
}

async function showUpdateWebHookDialog(wh) {
  const change = await dialog.show(DialogWebhookUpdate)
  if (!change) return
  try {
    await webhookAPI.updateDbWebHook(wh._id, change);
    notification.info(`Successfully update webhook id: ${wh._id}`)
    setTimeout(getWebHooks, 500);
  } catch (error) {
    console.error(`Error update webhook id: ${wh._id}`, error);
  }
}

async function deleteWebhookConfirm(wh) {
    const rs = await msgBox.show(
      'Delete WebHook Confirm',
      'Are you sure you want to delete this webhook?',
      msgBox.Buttons.YesNo,
      msgBox.Icons.Question
    )
    if (rs === msgBox.Results.yes) {
      await webhookAPI.deleteDbWebHook(wh._id)
      setTimeout(getWebHooks, 1000)
      notification.info('Db deleted')
    }
}

</script>

<style>
.sidebar {
    width: 1000px;
    min-width: 150px;
    border-left: 1px solid #d8dee4;
}
.round {
    color: #007bff; /* Đặt màu nền cho button */
}

/* Tùy chỉnh hover state */
.round:hover {
    color: #0056b3; /* Thay đổi màu nền khi di chuột qua button */
}
</style>
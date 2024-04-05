<template>
  <div v-if="isWebHookShow" class="sidebar transition-element move-right-to-left">
    <div class="fr mt-2 mb-2 ai-c jc-sb">
      <p class="mr-10 as-fs fs-20px fw-7">Web Hook</p>
<!--      <i class="fas fa-plus-circle round fs-25px as-fe" @click="showCreateWebHookDialog()"></i>-->
      <t-btn @click="showCreateWebHookDialog()" primary>Add</t-btn>

    </div>
    <t-table class="w-100 max-h-400px">
      <thead>
      <tr>
        <th class="z-index-1">Collection</th>
        <th class="z-index-1">Webhook URL</th>
        <th class="w-10px z-index-1">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="wh in webhooks" :key="wh._id">
        <td>{{wh.colName}}</td>
        <td>
          {{wh.to}}
        </td>
        <td>
          <div class="fr ai-c fg-4px">
            <t-btn save class="fn-btn" @click="showUpdateWebHookDialog(wh)">
              Modify
            </t-btn>
            <t-btn delete class="fn-btn" @click="deleteWebhookConfirm(wh)">
              Remove
            </t-btn>
          </div>
        </td>
      </tr>
      </tbody>
    </t-table>
  </div>
</template>
<script setup>
import {webhookAPI} from '@/api'
import {ref, onMounted, inject} from 'vue';
import DialogWebhookCreate from "@/components/DialogWebhookCreate.vue";
import DialogWebhookUpdate from "@/components/DialogWebHookUpdate.vue"

const {msgBox, dialog, notification} = inject('TSystem')

const props = defineProps({
 isWebHookShow: Boolean,
 colName: String,
})


const emitClose = defineEmits(['close']);

const closeWebhook = () => {
  emitClose('close');
};

const colName = props.colName

const dbId = inject('dbId')


const webhooks = ref([])

onMounted(getWebHooks)
async function getWebHooks() {
  webhooks.value = await webhookAPI.listDbWebHook(dbId, colName)
}

async function showCreateWebHookDialog() {
  const to = await dialog.show(DialogWebhookCreate)
  if (!to) return
  try {
    await webhookAPI.createDbWebHook(dbId, colName, to);
    setTimeout(getWebHooks, 500);
    notification.info('Successfully created new webhook');
  } catch (error) {
    console.error('Error creating new webhook:', error);
  }
}

async function showUpdateWebHookDialog(wh) {
  const to = await dialog.show({component: DialogWebhookUpdate, data: wh})
  if (!to) return
  try {
    await webhookAPI.updateDbWebHook(dbId, colName, wh._id, to);
    setTimeout(getWebHooks, 500);
    notification.info('Successfully update webhook')
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
      notification.info('Webhook deleted')
    }
}


console.log(`colName: ${props.colName}`)
</script>

<style>
.sidebar {
    width: 400px;
}
.round {
    color: #007bff;
}

.round:hover {
    color: #0056b3;
}

.transition-element {
    transition: transform 0.5s ease;
}

</style>
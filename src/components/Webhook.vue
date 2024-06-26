<template>
  <div class="px-2 py-2">
    <div class="fr mb-2 ai-c jc-sb">
      <p class="fs-20px fw-7">Web Hook</p>
      <t-btn @click="showCreateWebHookDialog()" primary>Add</t-btn>
    </div>

    <TLoading :action="ACTIONS.LOAD_WEBHOOKS">
      <template #loading>
        Loading...
      </template>
      <t-table class="w-100 max-h-400px">
        <thead>
        <tr>
          <th class="z-index-1">Webhook URL</th>
          <th class="w-10px z-index-1">Action</th>
          <th class="z-index-1">Enable</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="wh in webhooks" :key="wh._id">
          <td>
            {{wh.to}}
          </td>
          <td>
            <div class="fr ai-c fg-4px">
              <t-btn save class="fn-btn" @click="showUpdateWebHookDialog(wh)">
                Update
              </t-btn>
              <t-btn delete class="fn-btn" @click="deleteWebhookConfirm(wh)">
                <t-icon>fas fa-trash-alt@16px:#fff</t-icon>
              </t-btn>
            </div>
          </td>
          <td>
            <t-switch v-model="wh.enable" @update:modelValue="(enable)=>enable===true? enableWebHook(wh): disableWebHook(wh)"></t-switch>
          </td>
        </tr>
        </tbody>
      </t-table>
    </TLoading>
  </div>
</template>
<script setup>
import {webhookAPI} from '@/api'
import {ref, onMounted, inject} from 'vue';
import DialogWebhookCreate from "@/components/DialogWebhookCreate.vue";
import DialogWebhookUpdate from "@/components/DialogWebHookUpdate.vue"


const {msgBox, dialog, notification, loading} = inject('TSystem')

const props = defineProps({
 colName: String,
})

const ACTIONS = {
  LOAD_WEBHOOKS: 'lwh'
}

const colName = props.colName

const dbId = inject('dbId')

const enable = ref(true)

const webhooks = ref([])

onMounted(getWebHooks)
async function getWebHooks() {
  loading.begin(ACTIONS.LOAD_WEBHOOKS)
  webhooks.value = await webhookAPI.listDbWebHook(dbId, colName)
  loading.end(ACTIONS.LOAD_WEBHOOKS)
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

async function enableWebHook(wh) {
  await webhookAPI.enableWebHook(wh._id);
}

async function disableWebHook(wh) {
  await webhookAPI.disableWebHook(wh._id);
}

</script>
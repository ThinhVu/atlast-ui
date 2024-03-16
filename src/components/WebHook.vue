<script setup>
import {isEmpty} from 'lodash-es';
import dayjs from 'dayjs';
import {webhookAPI} from "@/api";
import {ref, onMounted, inject} from "vue";
import DialogWebHookCreate from "@/components/DialogWebhookCreate.vue";
import DialogWebHookUpdate from "@/components/DialogWebHookUpdate.vue";

const {msgBox, dialog, notification} = inject('TSystem')

const webhooks = ref([])
onMounted(loadDbWebHooks)

async function loadDbWebHooks() {
  webhooks.value = await webhookAPI.listDbWebHook()
}

async function showCreateDbWebhookDialog() {
  const data = await dialog.show(DialogWebHookCreate)
  if (!data) return
  try {
    await webhookAPI.createDbWebHook(data);
    notification.info('Successfully created new webhook');
    setTimeout(loadDbWebHooks, 500);
  } catch (error) {
    console.error('Error creating new webhook:', error);
  }
}

//TODO: ĐANG SỬA showUpdateDbWebHook
async function showUpdateDbWebHook(dbWebHook) {
  const change = dialog.show({
    component: DialogWebHookUpdate,
    data: dbWebHook
  })
  if (!change) return
  try {
    await webhookAPI.updateDbWebHook(dbWebHook._id, change);
    notification.info('Successfully update webhook');
    setTimeout(loadDbWebHooks, 500);
  } catch (error) {
    console.error('Error updating webhook:', error);
  }
}

async function deleteDbWebHook(dbWebHook) {
  const rs = await msgBox.show(
    'Delete Db Confirm',
    'Are you sure you want to delete this db?',
    msgBox.Buttons.YesNo,
    msgBox.Icons.Question
  )
  if (rs === msgBox.Results.yes) {
    await webhookAPI.deleteDbWebHook(dbWebHook._id)
    setTimeout(loadDbWebHooks, 1000)
    notification.info('Webhook deleted')
  }
}

</script>

<template>
  <section data-name="system-config" class="fc w-100 h-100 fg-12px px-3 py-3">
    <div>
      <t-btn save @click="showCreateDbWebhookDialog">Create New Webhook</t-btn>
    </div>
    <t-table class="w-100 max-h-400px">
      <thead>
      <tr>
        <th class="z-index-1">Id</th>
        <th class="z-index-1">Db Name</th>
        <th class="z-index-1">Collection</th>
        <th class="z-index-1">WebHook URL</th>
        <th class="z-index-1">Create At</th>
        <th class="w-10px z-index-1">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="dbWebHook in webhooks" :key="dbWebHook._id">
        <td>{{dbWebHook._id}}</td>
        <td>{{dbWebHook.dbName}}</td>
        <td>
          {{dbWebHook.colName}}
        </td>
        <td>
          {{dbWebHook.to}}
        </td>
        <td>
          {{dayjs(dbWebHook.createDt).format('YYYY-MM-DD HH:mm:ss')}}
        </td>
        <td>
          <div class="fr ai-c fg-4px">
            <t-btn primary class="fn-btn" @click="showUpdateDbWebHook(dbWebHook)">
              Change
            </t-btn>
            <t-btn delete class="fn-btn" @click="deleteDbWebHook(dbWebHook)">
              Remove
            </t-btn>
          </div>
        </td>
      </tr>
      </tbody>
    </t-table>
  </section>
</template>

<style scoped>

</style>
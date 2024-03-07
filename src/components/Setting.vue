<script setup>
import {ref} from 'vue'
import {userAPI} from '@/api';
import {useRouter} from 'vue-router';
//import '../../style/style.css'

const currentPwd = ref()
const newPwd = ref()
const confirmPwd = ref()
const check = ref(true)

const changePass = async()=> {
    if (confirmPwd.value!=='') {
        check.value = newPwd.value === confirmPwd.value;
        if (check.value===true) {
            await userAPI.changePassword({password:newPwd.value})
        } else {
            console.log("Password doesn't match!")
        }
    } else {
        check.value = true
    }
}
</script>

<template>
  <section class="px-4 py-4">
    <div class="px-4 py-4 w-350px br-2" style="border: 1px solid #ddd">
      <div class="fc fg-16px">
        <h1>Change password</h1>
        <t-password v-model="currentPwd" class="w-50" label="Current password"/>
        <t-password v-model="newPwd" class="w-50" label="New password"/>
        <t-password v-model="confirmPwd" class="w-50" label="Confirm password"/>
        <p v-show = "!check" class="red-text">Password don't match. Please try again</p>
        <t-btn class="w-200px" save @click="changePass">Change password</t-btn>
      </div>
    </div>
  </section>

</template>

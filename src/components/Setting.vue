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
    <div>
        <h1>Change password</h1>
        <p><t-password v-model="currentPwd" class="w-50" label="Current password"/></p>
        <p><t-password v-model="newPwd" class="w-50" label="New password"/></p>
        <p><t-password v-model="confirmPwd" class="w-50" label="Confirm password"/></p>
        <p v-show = "!check" class="red-text">Password don't match. Please try again</p>
    </div>
    <div>
        <button @click="changePass">Change password</button>
    </div>
</template>

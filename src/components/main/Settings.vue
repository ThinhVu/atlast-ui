<template>
    <div>
        <h1>Change password</h1>
        <p><t-password v-model="cPass" class="w-50" label="Current password"/></p>
        <p><t-password v-model="nPass" class="w-50" label="New password"/></p>
        <p><t-password v-model="confirmPass" class="w-50" label="Confirm password"/></p>
        <p v-show = "!check" class="red-text">Password do not match. Please try again</p>
    </div>
    <div>
        <button @click="changePass">Change password</button>
    </div>
</template>
<script setup>
import {ref} from 'vue'
import {userAPI} from '@/api';
import {useRouter} from 'vue-router';
//import '../../style/style.css'

const cPass = ref()
const nPass = ref()
const confirmPass = ref()
const check = ref(true)

const changePass = async()=> {
    if (confirmPass.value!=='') {
        check.value = nPass.value === confirmPass.value;
        if (check.value===true) {
            await userAPI.changePassword({password:nPass.value})
        } else {
            console.log("Password doesn't match!")
        }
    } else {
        check.value = true
    }
}
</script>
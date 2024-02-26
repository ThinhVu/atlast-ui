<template>
    <div class="w-100 h-100 fr ai-c fix z-index-999">
        <div class="px-4 py-4 br-10px mx-a fc fg-16px"
             style="border: 1px solid rgba(255,255,255,0.2); min-width: 300px">
            <p><t-text v-model="email" class="w-100" label="Email" placeholder="enter your email"/></p>
            <p><t-password v-model="password" class="w-100" label="Password"/></p>
            <p><t-password v-model="rewrite" class="w-100" label="Confirm password"/></p>
            <p v-show="!check" class="red-text">Password don't match. Please try again</p>
            <div class="fr ai-c jc-fe fg-4px">
                <t-btn primary @click="signUp">Create your account</t-btn>
            </div>
        </div>
    </div>
</template>
<script setup>
import {ref,watch} from 'vue'
import {userAPI} from '@/api';
import {useRouter} from 'vue-router';

const router = useRouter()

const email = ref()
const password = ref()
//rewrite the password
const rewrite = ref()
const check = ref(true)


const signUp = async () => {
    if (rewrite.value!=='') {
        check.value = password.value === rewrite.value;
    } else {
        check.value = true
    }
    if (rewrite.value!==''&&check.value===true) {
        const token = await userAPI.signUp(email.value, password.value)
        if (token) {
            await router.push({path: '/'})
        }
    } else {
        console.log('Fail to sign up!')
    }
}
</script>
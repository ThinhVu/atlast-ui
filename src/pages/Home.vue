<template>
  <div>
    <div class="h-100px bc:#232f3e">
      <div class="fr jc-fe">
        <button class="custom-button" @click="showDialogSignUp">Sign Up</button>
        <button class="custom-button" @click="showDialogSignIn">Sign In</button>
        <button class="custom-button" @click="navigateToDashboard">Dashboard</button>
      </div>
      <div class="fr jc-c">
          <p v-for="item in headers" :key="item" class="c:#FFFFFF ml-25 mt-6 fs-15px">
            {{item}}
          </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {inject, ref} from 'vue'
import {useRouter} from 'vue-router';
import DialogSignIn from '../components/DialogSignIn.vue'
import DialogSignUp from '../components/DialogSignUp.vue'


const {dialog} = inject('TSystem')
const headers = ["Products", "Solution", "Pricing", "Documentation", "Explore More"]
const headerStats = ref('')

const router = useRouter();

const navigateToDashboard = () => {
  router.push('/dashboard');
};

async function showDialogSignIn() {
  await dialog.show(DialogSignIn)
}

async function showDialogSignUp() {
  await dialog.show(DialogSignUp)
}

</script>

<style scoped>

</style>
<template>
  <div>
    <div class="h-100px bc:#232f3e">
      <div class="fr jc-fe">
        <button class="custom-button">Sign In</button>
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
import {ref} from 'vue'
import {useRouter} from 'vue-router';

const headers = ["Products", "Solution", "Pricing", "Documentation", "Explore More"]
const headerStats = ref('')

const router = useRouter();

const navigateToDashboard = () => {
  router.push('/dashboard');
};
</script>

<style scoped>

</style>
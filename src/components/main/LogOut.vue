<template>
  <button @click="signOut">
      Log out
  </button>
</template>
<script setup>
import {userAPI} from '@/api';
import {useRouter} from 'vue-router';

const signOut = async() => {
    await userAPI.signOut()
}
</script>
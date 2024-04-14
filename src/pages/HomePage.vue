<template>
  <div>
    <div class="fix top-0 left-0 w-100 bc:#232f3e">
      <div class="fr ai-c jc-fe px-2 py-2 fg-8px">
        <img src="@/assets/images/logo-full.png" alt="logo-full" style="width: 120px;"/>
        <TSpacer/>
        <TBtn @click="signIn">Sign in</TBtn>
        <TBtn save @click="createAnAccount">Sign up</TBtn>
      </div>
    </div>
    <section class="w-100 fc ai-c jc-c ta-c" style="height: 60vh">
      <img class="mb-4" src="@/assets/images/logo.png" alt="Atlast's logo" style="width: 200px;"/>
      <h2 class="mb-2">Unlock Simplicity, Embrace Affordability</h2>
      <p>Your MongoDB Atlas Alternative for Seamless Database Hosting!</p>
    </section>
    <section class="fc ai-c jc-c" style="width: 80vw; margin: 0 auto">
      <div class="grid benefits gg-20px fs-14px">
        <div class="px-4 py-4 br-2" style="border: 1px solid #ddd">
          <h3 class="mb-3 c:#18a00c fs-20px">Affordable pricing</h3>
          <p class="mb-2">Ditch the high costs without compromising quality!</p>
          <p class="mb-2">Atlast delivers top-notch features with unbeatable affordability,
            ensuring you save big on database hosting without sacrificing performance.</p>
        </div>
        <div class="px-4 py-4 br-2" style="border: 1px solid #ddd">
          <h3 class="mb-3 c:#18a00c fs-20px">User-friendly</h3>
          <p class="mb-2">Say goodbye to complexity!</p>
          <p class="mb-2">Our solution brings you a user-friendly experience that's as intuitive as it is powerful.</p>
          <p class="mb-2">Enjoy hassle-free database management, simplified for your success.</p>
        </div>
        <div class="px-4 py-4 br-2" style="border: 1px solid #ddd">
          <h3 class="mb-3 c:#18a00c fs-20px">Useful, robust features</h3>
          <p class="mb-2">Experience the next level of database hosting!</p>
          <p class="mb-2">Atlast not only simplifies but enhances, offering robust features that elevate your
             database management to new heights.</p>
          <p class="mb-2">Unleash the power of innovation with confidence.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {inject} from 'vue'
import {useNavigation} from '@/composables/useNavigation'
import {userAPI} from "@/api";
import {socketConnect} from "@/socket/socket";
import AuthDialog from "@/components/AuthDialog.vue";

const {dialog, notification} = inject('TSystem')
const nav = useNavigation()

async function signIn() {
  const access_token = window.localStorage.getItem('access_token')
  if (access_token) {
    console.log('found access_token. trying to login using access_token')
    try {
      const {token} = await userAPI.auth(access_token)
      socketConnect(token)
      await nav.gotoDashboard()
      return
    } catch (e) {
      console.log('login using access_token failed')
      notification.err(e)
    }
  }

  console.log('show sign-in dialog')
  dialog.show({
    component: AuthDialog,
    data: {mode: 'signIn'}
  })
}

const createAnAccount = () => {
  dialog.show({
    component: AuthDialog,
    data: {mode: 'signUp'}
  })
}
</script>

<style scoped>
.benefits {
  grid-template-columns: 1fr;
}

@media screen and (min-width: 600px) {
  .benefits {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
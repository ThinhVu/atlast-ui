<template>
<!--      <div>-->
<!--        <div class="h-1000px w-40px br-4 fr" style = "border: 1px black">-->
<!--          <div v-for="item in sidebarItems">-->
<!--            {{item.icon}}-->
<!--            {{item.title}}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
  <TLoading>
    <template #loading>
      <TPulseBlock class="h-100vh w-100vw"/>
    </template>
    <TDashboard v-if="sidebarItems.length > 0" :sidebar-items="sidebarItems">
      <template #header>
        <img src="@/assets/images/logo-full.png" alt="logo-full" style="width: 120px;" @click="nav.gotoHome()"/>
      </template>
      <template #sidebar-footer>
        <button class="round-button" @click="showCreateColDialog">
          <i class="fas fa-plus"></i>
        </button>
        <t-btn @click="userAPI.signOut()">Sign out</t-btn>
      </template>
    </TDashboard>
    <div v-else>
      <p>Data is loading</p>
    </div>
  </TLoading>
</template>

<script setup lang="ts">
import {inject, computed, ref} from 'vue';
import {userAPI} from '@/api';
import {useNavigation} from '@/composables/useNavigation'
import { useRoute } from 'vue-router'
import { dbAPI } from '../api'
import {onMounted} from "vue";
import Collection from '../components/Collection.vue'
import DialogColCreate from "../components/DialogColCreate.vue";


const {dialog, loading, notification} = inject('TSystem')

const route = useRoute()

const nav = useNavigation()

const rs = ref([])
const colName = ref()

const cols = ref([])
const dbId = route.params.id

//onMounted(()=> getCols(dbId));
onMounted(getCols);

async function getCols() {
    cols.value = await dbAPI.getDbCollection(dbId);
}

const sidebarItems = computed(() => {
    if (cols.value.length > 0) {
        return cols.value.map((col) => ({
            title: String(col.name),
            icon: 'fas fa-th-large@16px:#aaa',
            component: Collection
        }))
    } else {
        return []
    }
})

async function showCreateColDialog() {
    const colName = await dialog.show(DialogColCreate)
    if (!colName) return
    try {
        await dbAPI.createNewCollection(dbId, colName);
        setTimeout(getCols, 500);
        notification.info(`Successfully created new collection: ${colName}`);
    } catch (error) {
        console.error('Error creating new collection:', error);
    }
}

</script>

//TODO: check sign out function
<style scoped>
.round-button {
    width: 50px; /* Đặt chiều rộng của button */
    height: 50px; /* Đặt chiều cao của button */
    border-radius: 50%; /* Đặt border-radius thành 50% để tạo hình tròn */
    background-color: #007bff; /* Đặt màu nền cho button */
    color: white; /* Đặt màu chữ cho button */
    border: none; /* Loại bỏ border của button */
    cursor: pointer; /* Đổi con trỏ chuột khi di chuyển qua button */
    outline: none; /* Loại bỏ đường viền khi button được focus */
    font-size: 24px; /* Đặt kích thước font chữ */
    line-height: 50px; /* Canh giữa nội dung theo chiều dọc */
    text-align: center; /* Canh giữa nội dung theo chiều ngang */
}

/* Tùy chỉnh hover state */
.round-button:hover {
    background-color: #0056b3; /* Thay đổi màu nền khi di chuột qua button */
}
</style>


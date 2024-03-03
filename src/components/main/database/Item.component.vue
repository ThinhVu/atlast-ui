<template>
    <div>
        <li v-for="(item, index) in mockData" :key="index" class="item">
            <div class="database-item top-border f1">
                <div class="p-container">
                    <p class="p1"> {{item.name}}</p>
                    <p class="p2"> {{item.used}} </p>
                </div>
            </div>

            <div class="top-border" style="padding: 10px">
                <button style="background-color: #5acafa; color:white; font-size:15px; font-weight:800; margin-right: 5px">i</button>
                <button style="background-color: #bb5753; color:white; font-size:15px; font-weight:800" @click="onShowModal">X</button>
                <div>
                    <ElModal v-if="buttonTrigger" @hideModal="hideModal">
                        <h2 style="padding: 5px; font-size: 13px">Confirm</h2>
                        <p style="padding:5px; font-size:11px; justify-content: center">Are you sure to delete this database?</p>
                        <p style="padding:5px; font-size:11px; justify-content: center">If yes, type "delete":</p>
                    </ElModal>
                </div>

            </div>
        </li>


    </div>
</template>

<script setup>
import ElModal from "@/components/primitives/ElModal.vue";
import {ref} from 'vue';


const buttonTrigger = ref(false);
const onShowModal = () => {
    buttonTrigger.value = true
}
const hideModal = () => {
    buttonTrigger.value = false
}


const mockData = [
    {
        id: 1,
        name: 'db1234',
        used: 20
    },
    {
        id: 2,
        name: 'db567',
        used: 50

    },
    {
        id: 3,
        name: 'db8910',
        used: 30
    },
    {
        id: 4,
        name: 'db1112',
        used: 10
    },
    {
        id: 5,
        name: 'db1234',
        used: 12
    },
]

</script>
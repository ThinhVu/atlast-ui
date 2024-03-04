<script setup>
import {ref, computed} from 'vue'
const custom = ref('Custom')
const billValue = ['$10','$20','$50',custom.value]

const selectedValue = ref('')

const currentBalance = computed(() => {
    return selectedValue.value;
});
</script>

<template>
    <section style="border: 1px solid; padding:30px; width: 350px">
        <div style="margin-top:10px; margin-bottom:20px">
            <p style="padding-bottom: 15px">Your balance</p>
            <p style="padding-bottom: 30px">Current balance: {{(currentBalance!=='Custom')?currentBalance:''}}</p>
            <p>Buy credit</p>
        </div>
        <div style="display: flex">
                <div v-for="(item,index) in billValue" :key="index" style="margin: 5px">
                    <button class="custom-button" @click="selectedValue=item">{{item}}</button>
                </div>
        </div>
        <div>
            <button class="mt-2" style="background-color: lightgreen; width: 280px">Buy credit</button>
        </div>
    </section>


</template>

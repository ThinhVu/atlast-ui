import {ref, computed} from 'vue';
export const user = ref();
export const sharedClusters = ref([]);
export const mineClusters = ref([]);
export const clusterIdMap = computed(() => {
  const output = {}
  for (const cl of sharedClusters.value) {
    output[cl._id] = cl
  }
  for (const cl of mineClusters.value) {
    output[cl._id] = cl
  }
  return output
})


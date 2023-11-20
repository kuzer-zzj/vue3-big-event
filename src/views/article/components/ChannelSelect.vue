<script setup>
import { ref } from 'vue'
import { getArChannelList } from '@/api/article'

defineProps({
  modelValue: {
    type: [String, Number]
  }
})
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelList = async () => {
  const { data } = await getArChannelList()
  channelList.value = data.data
}
getChannelList()
</script>
<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>

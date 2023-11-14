<script lang="ts" setup>
const open2 = () => {
  ElMessage.success('Congrats, this is a success message.')
}
</script>
<template>
  布局架子
  <el-button :plain="true" @click="open2">success</el-button>
</template>

<script setup>
import { ref } from 'vue'
import { userUploadAvatarService } from '@/api/user'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const imageUrl = ref(userStore.user.user_pic)
const uploadRef = ref(null)

const onUploadFile = async (file) => {
  //使用FileReader对象读取文件
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    //将base64地址赋值给src
    imageUrl.value = reader.result
  }
  await userUploadAvatarService(imageUrl.value)
  await userStore.getUserInfo()
  //提示 上传成功
  ElMessage({ type: 'success', message: '更换头像成功' })
}
</script>
<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onUploadFile"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <img v-else src="@/assets/avatar.jpg" width="278" />
    </el-upload>
    <br />
    <el-button
      type="primary"
      :icon="Plus"
      @click="uploadRef.$el.querySelector('input').click()"
      size="large"
      >选择图片</el-button
    >
    <el-button type="success" :icon="Upload" @click="upload" size="large"
      >上传头像</el-button
    >
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>

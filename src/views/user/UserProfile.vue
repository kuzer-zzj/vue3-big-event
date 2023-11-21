<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'

const {
  user: { username, nickname, email, id }
} = useUserStore()
const formData = ref({
  username,
  nickname,
  email,
  id
})

const loginForm = ref()

const formRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位字符串',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
}

const userStore = useUserStore()
const handleSubmit = async () => {
  //参数校验
  const valid = await loginForm.value.validate()
  if (!valid) return
  await userUpdateInfoService(formData.value)
  //提示更新成功
  ElMessage.success('修改成功')
  userStore.getUserInfo()
}
</script>
<template>
  <page-container title="个人信息">
    <el-row>
      <el-col :span="10">
        <el-form
          :model="formData"
          :rules="formRules"
          ref="loginForm"
          label-width="100px"
        >
          <el-form-item label="登录名称">
            <el-input v-model="formData.username" disabled />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="formData.nickname" />
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="formData.email" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>

<script setup>
import { ref } from 'vue'
import { userUpdatePassService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const pwdFormRef = ref(null)
const userStore = useUserStore()
const router = useRouter()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const validateNewPwd = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}

const validateRePwd = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('确认密码与新密码不一致'))
  } else {
    callback()
  }
}
const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
    { validator: validateNewPwd, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
    { validator: validateRePwd, trigger: 'blur' }
  ]
}

const modifyPassword = async () => {
  const valid = await pwdFormRef.value.validate()
  // 在这里执行修改密码的逻辑
  if (valid) {
    await userUpdatePassService(pwdForm.value)
    //清除token 和用户信息
    userStore.logout()
    //跳登录页
    router.push('/login')
    ElMessage.success('密码修改成功')
  }
  console.log('修改密码')
}

const resetForm = () => {
  // 重置表单
  pwdForm.value = {
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
  }
}
</script>
<template>
  <el-row>
    <el-col :span="10">
      <el-form
        ref="pwdFormRef"
        :model="pwdForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="原密码" prop="old_pwd">
          <el-input
            v-model="pwdForm.old_pwd"
            type="password"
            placeholder="请输入原密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_pwd">
          <el-input
            v-model="pwdForm.new_pwd"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="re_pwd">
          <el-input
            v-model="pwdForm.re_pwd"
            type="password"
            placeholder="请确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyPassword">修改密码</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

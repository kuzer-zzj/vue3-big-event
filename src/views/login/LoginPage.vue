<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userRegService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const isReg = ref(true)
const userStore = useUserStore()
const router = useRouter()

const formModel = ref({
  username: 'createApp',
  password: '',
  confirmPassword: ''
})

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名长度在5-10个字符', trigger: 'blur' }
  ],
  password: [
    //必填
    { required: true, message: '请输入密码', trigger: 'blur' },
    //用正则 6-15的非空字符
    {
      pattern: /^(?!\s*$).{6,15}$/,
      message: '密码长度在6-15个字符',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    //必填
    { required: true, message: '请输入密码', trigger: 'blur' },
    //用正则 6-15的非空字符
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度在6-15个字符',
      trigger: 'blur'
    },
    {
      //验证 confirmPassword 和 password是否一致
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const form = ref()
const register = async () => {
  await form.value.validate()
  console.log('开始注册！')
  await userRegService(formModel.value)
  ElMessage.success('注册成功！')
  isReg.value = false
}

const login = async () => {
  await form.value.validate()
  console.log('登录！')
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  ElMessage.success('登录！成功！')
  router.push('/')
}

//用watch 监视 isReg 清空表单
watch(isReg, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        :model="formModel"
        :rules="rules"
        v-if="isReg"
      >
        <el-form-item><h1>注册</h1></el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            v-model="formModel.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="密码"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            v-model="formModel.confirmPassword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="button"
            auto-insert-space
            @click="register"
            >注册</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isReg = false"
            >← 返回</el-link
          >
        </el-form-item>
      </el-form>

      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        :model="formModel"
        :rules="rules"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="密码"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="button"
            auto-insert-space
            @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isReg = true"
            >注册 →</el-link
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>

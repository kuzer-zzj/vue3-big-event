import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'

export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const user = ref({})
    const setToken = (t) => {
      token.value = t
    }
    const getUserInfo = async () => {
      const userInfoRes = await userGetInfoService()
      console.log('userInfoRes:', userInfoRes)
      user.value = userInfoRes.data.data
    }
    const logout = () => {
      setToken('')
      user.value = {}
    }

    return { token, setToken, getUserInfo, user, logout }
  },
  {
    persist: true
  }
)

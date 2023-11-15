import request from '@/utils/request'

export const userRegService = ({ username, password, confirmPassword }) => {
  return request.post('/api/reg', {
    username,
    password,
    repassword: confirmPassword
  })
}

export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', {
    username,
    password
  })
}

export const userGetInfoService = () => request.get('/my/userinfo')

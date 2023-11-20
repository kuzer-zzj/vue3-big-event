import request from '@/utils/request'

export const getArChannelList = () => request.get('/my/cate/list')

export const artAddService = (data) => request.post('/my/cate/add', data)

export const artChannelEditService = (data) =>
  request.put('/my/cate/info', data)

export const artChannelDelService = (id) =>
  request.delete('/my/cate/del', {
    params: {
      id
    }
  })

export const artGetListService = (params) =>
  request.get('/my/article/list', { params })

export const artPublishService = (data) => {
  return request.post('/my/article/add', data)
}

export const artGetDetailService = (id) => {
  return request.get('/my/article/info', {
    params: {
      id
    }
  })
}

export const artEditService = (data) => request.put('/my/article/info', data)

export const artDelService = (id) =>
  request.delete('/my/article/info', {
    params: {
      id
    }
  })

<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const defauldFormModel = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const visibleDrawer = ref(false)

const formModel = ref({ ...defauldFormModel })

const imageUrl = ref('')
const editorRef = ref()

const emit = defineEmits(['success'])

const onUploadFile = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imageUrl.value = baseURL + res.data.data.cover_img
    formModel.value.cover_img = await convertImageUrlToFile(imageUrl.value)
  } else {
    console.log('后', '添加功能')
    formModel.value = { ...defauldFormModel }
  }
}

const onPush = async (state) => {
  formModel.value.state = state
  const fd = new FormData()
  for (const key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.id) {
    await artEditService(fd)
    visibleDrawer.value = false
    ElMessage.success('修改成功成功')
    emit('success', 'edit')
  } else {
    await artPublishService(fd)
    ElMessage.success('提交成功')
    visibleDrawer.value = false
    emit('success', 'add')
    //清空表单内容
    formModel.value = { ...defauldFormModel }
    imageUrl.value = ''
    editorRef.value.setHtml = ''
  }
}

/**
 * 将网络图片地址转换为 File 对象
 * @param {string} imageUrl - 网络图片地址
 * @returns {Promise<File>} - 返回一个 Promise，包含转换后的 File 对象
 */
const convertImageUrlToFile = async (imageUrl) => {
  try {
    // 使用 axios 发送 GET 请求获取图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 获取图片数据
    const imageData = response.data

    // 获取图片文件名
    const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)

    // 将图片数据包装成 File 对象
    const file = new File([imageData], fileName, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    // 请求失败处理
    console.error('转换图片失败:', error)
    throw error
  }
}

defineExpose({ open })
</script>
<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <el-form :model="formModel" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="图片" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            theme="snow"
            contentType="html"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="onPush('草稿')">草稿</el-button>
        <el-button type="primary" @click="onPush('已发布')">发布</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>

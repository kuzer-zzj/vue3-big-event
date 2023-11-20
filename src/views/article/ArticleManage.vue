<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
import { ElMessageBox } from 'element-plus'

const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})

const total = ref(0)

const articleList = ref([])

const loading = ref(false)

const articleEditRef = ref()

const getArticleList = async () => {
  loading.value = true
  const { data } = await artGetListService(params.value)
  articleList.value = data.data
  total.value = data.total
  loading.value = false
  console.log('文章分页data:', data)
}
getArticleList()

const handleCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}
const handleSizeChange = (pageSize) => {
  params.value.pagenum = 1
  params.value.pagesize = pageSize
  getArticleList()
}

const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const addArt = () => {
  articleEditRef.value.open({})
}

const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

//监听子组件 success时间
const onSuccess = (type) => {
  if (type === 'add') {
    params.value.pagenum = Math.ceil((total.value + 1) / params.value.pagesize)
  }
  getArticleList()
}

const onDel = async (row) => {
  //用ElmessgeBox 提示 是否确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  getArticleList()
}
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="addArt"> 添加文章 </el-button>
    </template>
    <el-form inline>
      <el-form-item label="文章分类：">
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="文章状态：">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">清空</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="articleList" style="width: 100%" v-loading="loading">
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类"></el-table-column>
      <el-table-column label="发表时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            type="danger"
            circle
            :icon="Delete"
            plain
            @click="onDel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 4, 6, 8]"
      background
      layout="jumper,total, sizes, prev, pager, next "
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 15px; justify-content: flex-end"
    />
    <article-edit ref="articleEditRef" @success="onSuccess" />
  </page-container>
</template>

<style lang="scss" scoped></style>

<script setup>
import { ref } from 'vue'
import { getArChannelList, artChannelEditService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([])
const loading = ref(false)
const dialog = ref()
const pageCon = ref()

const getArAhannelList = async () => {
  loading.value = true
  const res = await getArChannelList()
  console.log('文章分类：', res)
  channelList.value = res.data.data
  loading.value = false
}
getArAhannelList()

const onEditChannel = (row) => {
  dialog.value.open(row)
}

const onDelChannel = async (row) => {
  await ElMessageBox.confirm('确定删除吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
  artChannelEditService(row.id)
  console.log('删除文章分类：', row)
  ElMessage.success('删除成功')
  getArChannelList()
}

const onAddChannel = () => {
  dialog.value.open()
}

const onSuccess = () => {
  getArAhannelList()
}
</script>

<template>
  <page-container title="文章分类" ref="pageCon">
    <template #extra
      ><el-button type="primary" @click="onAddChannel"
        >添加分类</el-button
      ></template
    >

    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>

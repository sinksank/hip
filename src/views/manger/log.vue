<template>
  <div>
    <div class="btns">
      <el-popconfirm
        width="220"
        :icon="InfoFilled"
        icon-color="#626AEF"
        confirm-button-text="是"
        cancel-button-text="否"
        title="是否确认删除?"
        @confirm="confirmEvent"
      >
        <template #reference>
          <el-button :icon="DeleteFilled" type="danger" size="small">删除</el-button>
        </template>
      </el-popconfirm>
    </div>
    <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="id" />
      <el-table-column prop="avatar" label="头像">
        <template #default="scope">
          <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="create_time" label="访问时间">
        <template #default="scope">
          <div class="flex-box">
            <el-icon>
              <Clock />
            </el-icon>
            <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-info">
      <el-pagination
        v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :background="false"
        size="small"
        layout="total, prev, pager, next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { DeleteFilled } from '@element-plus/icons-vue'
import { getLogList, deleteLog } from '../../api'
import { ElMessage } from 'element-plus'
const allData = reactive([])

onMounted(() => {
  const now = new Date().toLocaleString() // 获取当前时间
  allData.value = [
    {
      id: 1,
      avatar: '../../../public/默认头像.webp',
      name: 'Aurora',
      role: '医生',
      create_time: '2024/8/16 12:57:03'
    },
    {
      id: 2,
      avatar: '../../../public/医生男1.webp',
      name: 'Dream',
      role: '医生',
      create_time: '2024/8/18 18:34:08'
    },
    {
      id: 3,
      avatar: '../../../public/医生女1.webp',
      name: '周九',
      role: '医生',
      create_time: '2024/8/18 18:45:12'
    },
    {
      id: 4,
      avatar: '../../../public/管理员.webp',
      name: 'admin',
      role: '管理员',
      create_time: '2024/8/19 14:34:18'
    },
    {
      id: 5,
      avatar: '../../../public/医生女2.webp',
      name: '十一',
      role: '医生',
      create_time: '2024/8/23 14:34:18'
    },
    {
      id: 6,
      avatar: '../../../public/管理员.webp',
      name: 'admin',
      role: '管理员',
      create_time: '2024/8/24 14:08:16'
    },
    {
      id: 7,
      avatar: '../../../public/默认头像.webp',
      name: 'Aurora',
      role: '医生',
      create_time: '2024/8/24 12:57:03'
    },
    {
      id: 8,
      avatar: '../../../public/管理员.webp',
      name: 'admin',
      role: '管理员',
      create_time: '2024/8/24 14:08:16'
    },
    // 医生
    // {
    //   id: 9,
    //   avatar: '../../../public/默认头像.webp',
    //   name: 'Aurora',
    //   role: '医生',
    //   create_time: now
    // }
    // //管理员
    {
      id: 9,
      avatar: '../../../public/默认头像.webp',
      name: 'Aurora',
      role: '医生',
      create_time: '2024/9/19 19:45:21'
    },
    {
      id: 10,
      avatar: '../../../public/管理员.webp',
      name: 'admin',
      role: '管理员',
      create_time: now
    }
  ]
  getListData()
})

const paginationData = reactive({
  pageNum: 1, //当前页码
  pageSize: 6 //每页多少条
})
//列表数据
const tableData = reactive({
  list: [],
  total: 0
})

//点击页码回调
const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getListData()
}
const handleCurrentChange = (val) => {
  paginationData.pageNum = val
  getListData()
}

const getListData = () => {
  // 计算分页数据
  const start = (paginationData.pageNum - 1) * paginationData.pageSize
  const end = start + paginationData.pageSize
  tableData.list = allData.value.slice(start, end) // 切割数据
  tableData.total = allData.value.length // 更新总数
}
//选中的table项
const selectTableData = ref([])
const handleSelectionChange = (val) => {
  selectTableData.value = val.map((item) => ({ id: item.id }))
  // selectTableData.value = val; // 直接赋值
}

const confirmEvent = () => {
  // 检查是否有选中数据
  if (selectTableData.value.length === 0) {
    return ElMessage.warning('请至少选择一项数据')
  }

  // 从 allData 中删除选中的项
  selectTableData.value.forEach((selected) => {
    const indexInAllData = allData.value.findIndex((item) => item.id === selected.id)
    if (indexInAllData !== -1) {
      allData.value.splice(indexInAllData, 1) // 从 allData 中删除
    }
  })

  // 更新表格数据
  getListData() // 重新获取数据以更新表格

  // 反馈删除成功
  ElMessage.success('删除成功')
}
</script>
<style lang="less" scoped>
.btns {
  height: 100%;
  background-color: #fff;
  padding-left: 1120px;
  padding-top: 10px;
  padding-bottom: 30px;
}

.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .img-box {
    position: relative;

    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>

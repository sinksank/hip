<template>
  <div>
    <div class="btns">
      <!-- 科室这里的数据需要访问后台获取 departmentList-->
      <div class="header-left">
        <el-select
          v-model="selectedDepartment"
          placeholder="选择科室"
          size="default"
          style="width: 200px; margin-left: 10px"
        >
          <el-option
            v-for="department in departmentList"
            :key="department.id"
            :label="department.department"
            :value="department.id"
          />
        </el-select>
        <el-button
          type="primary"
          @click="handleSearchDepartment"
          size="small"
          style="margin-left: 10px"
          >搜索</el-button
        >
      </div>
      <div class="header-right">
        <el-button :icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
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
    </div>
    <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="id" />
      <el-table-column prop="department" label="科室" />
      <el-table-column prop="describe" label="科室简介" />
      <el-table-column prop="create_time" label="创建时间">
        <template #default="scope">
          <div class="flex-box">
            <el-icon>
              <Clock />
            </el-icon>
            <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="open(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-info">
      <el-pagination
        v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :background="false"
        :size="small"
        layout="total, prev, pager, next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 科室创建对话框 -->
    <el-dialog v-model="dialogFormVisable" :before-close="beforeClose" title="科室管理" width="500">
      <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
        <el-form-item v-show="false" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="科室" prop="department">
          <el-input v-model="form.department" placeholder="请输入要添加的科室名" />
        </el-form-item>
        <el-form-item label="科室简介" prop="describe">
          <el-input v-model="form.describe" placeholder="请输入科室简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import { Plus, DeleteFilled, InfoFilled } from '@element-plus/icons-vue'
// import { addDepartment, deleteDepartment, getDepartmentList } from '../../api'
import { ElMessage } from 'element-plus'
const allData = ref([])
onMounted(() => {
  allData.value = [
    {
      id: 1,
      department: '内科',
      describe: '内科是医学科属，研究人体内脏疾病病因、诊断及防治。',
      create_time: '2024-08-16 12:57:03'
    },
    {
      id: 2,
      department: '外科',
      describe: '外科是医学科属，研究人体组织和器官的手术治疗方法。',
      create_time: '2024-08-16 12:58:23'
    },
    {
      id: 3,
      department: '皮肤科',
      describe: '皮肤科是医学科属，研究皮肤及其附属器官疾病的诊断及防治。',
      create_time: '2024-08-16 12:59:06'
    },
    {
      id: 4,
      department: '检验科',
      describe: '检验科是医学科属，主要负责各种生物样本的检测分析，以辅助诊断和治疗。',
      create_time: '2024-08-16 13:01:00'
    },
    {
      id: 5,
      department: '儿科',
      describe: '儿科是医学科属，专门研究儿童生长发育、疾病防治和健康管理。',
      create_time: '2024-08-16 13:01:49'
    },
    {
      id: 6,
      department: '急诊科',
      describe: '急诊科是医院中专门负责处理各种紧急、危重病症的科室。',
      create_time: '2024-08-16 13:02:17'
    },
    {
      id: 7,
      department: '妇产科',
      describe: '妇产科是医学科属，主要研究女性生殖系统及妊娠、分娩等相关问题。',
      create_time: '2024-08-16 13:02:17'
    },
    {
      id: 8,
      department: '病理科',
      describe: '病理科是医学科属，主要负责疾病组织和细胞的形态学研究及诊断。',
      create_time: '2024-08-16 13:02:45'
    },
    {
      id: 9,
      department: '呼吸科',
      describe: '呼吸科是医学科属，主要研究呼吸系统疾病的诊断及治疗。',
      create_time: '2024-08-16 13:03:08'
    },
    {
      id: 10,
      department: '神经内科',
      describe: '神经内科是医学科属，主要研究中枢神经系统和周围神经系统的疾病。',
      create_time: '2024-08-16 13:03:59'
    }
  ]
  getListData()
  getDepartmentData()
})

const dialogFormVisable = ref(false)

const beforeClose = () => {
  dialogFormVisable.value = false
  //清空当前form
  formRef.value.resetFields() // 调用 el-form 的 resetFields 方法
  selectedDepartment.value = '' // 重置科室选择
}
const currentData = ref('')
const formRef = ref()
const form = reactive({
  id: '',
  department: '', //科室
  describe: '' //描述
})

const rules = reactive({
  department: [{ required: true, trigger: 'blur', message: '请输入科室' }],
  describe: [{ required: true, trigger: 'blur', message: '请输入科室简介' }]
})
const now = new Date()
currentData.value = now.toLocaleString()
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const now = new Date().toLocaleString() // 获取当前时间
      if (form.id) {
        // 编辑科室
        const indexInDepartmentList = departmentList.value.findIndex((dept) => dept.id === form.id)
        const indexInAllData = allData.value.findIndex((dept) => dept.id === form.id)

        if (indexInDepartmentList !== -1 && indexInAllData !== -1) {
          // 更新 departmentList
          departmentList.value[indexInDepartmentList] = {
            id: form.id,
            department: form.department
          }
          // 更新 allData
          allData.value[indexInAllData] = {
            id: form.id,
            department: form.department,
            describe: form.describe,
            create_time: now // 更新创建时间
          }
          ElMessage.success('编辑成功') // 显示成功消息
        } else {
          ElMessage.error('编辑失败，科室未找到') // 显示错误消息
        }
      } else {
        // 添加科室
        const newId = allData.value.length
          ? Math.max(...allData.value.map((item) => item.id)) + 1
          : 1 // 生成新的 ID
        const newDepartment = {
          id: newId, // 新科室的 ID
          department: form.department,
          describe: form.describe,
          create_time: now // 设置创建时间
        }
        departmentList.value.push(newDepartment) // 添加到 departmentList
        allData.value.push(newDepartment) // 同时将新科室添加到 allData
        ElMessage.success('添加成功') // 显示成功消息
      }
      beforeClose() // 关闭对话框
      getListData() // 更新列表数据
    } else {
      ElMessage.error('表单验证失败，请检查输入') // 显示错误消息
    }
  })
}

//新增和编辑 异步使用nextTick
const open = (rowData = {}) => {
  dialogFormVisable.value = true
  nextTick(() => {
    //若是编辑则赋值
    if (rowData) {
      Object.assign(form, rowData) //此方法可实现编辑的时候数据回显，确定编辑之后需要更新列表confirm方法中
    } else {
      form.id = '' // 清空 ID
      form.department = ''
      form.describe = ''
    }
  })
}

const selectedDepartment = ref('') //选中的科室
// test
const departmentList = ref([])
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
const getDepartmentData = () => {
  // 这里可以调用 API 来获取科室数据
  departmentList.value = [
    { id: 1, department: '内科' },
    { id: 2, department: '外科' },
    { id: 3, department: '皮肤科' },
    { id: 4, department: '检验科' },
    { id: 5, department: '儿科' },
    { id: 6, department: '急诊科' },
    { id: 7, department: '妇产科' },
    { id: 8, department: '病理科' },
    { id: 9, department: '呼吸科' },
    { id: 10, department: '神经内科' }
  ]
}

const getListData = () => {
  // 计算分页数据
  const start = (paginationData.pageNum - 1) * paginationData.pageSize
  const end = start + paginationData.pageSize
  tableData.list = allData.value.slice(start, end) // 切割数据
  tableData.total = allData.value.length // 更新总数
}

// const handleSearchDepartment = () => {
//   paginationData.pageNum = 1 // 重置为第一页
//   getListData() // 重新获取数据
// }
const handleSearchDepartment = () => {
  paginationData.pageNum = 1 // 重置为第一页

  // 如果没有选择科室，则显示所有科室
  if (!selectedDepartment.value) {
    getListData() // 重新获取数据
    return
  }

  // 根据选中的科室过滤数据
  const filteredData = allData.value.filter((item) => item.id === selectedDepartment.value)

  // 更新表格数据
  tableData.list = filteredData
  tableData.total = filteredData.length // 更新总数
}

//选中的table项
const selectTableData = ref([])
const handleSelectionChange = (val) => {
  selectTableData.value = val.map((item) => ({ id: item.id }))
}
//点击批量删除
// const confirmEvent = () => {
//   //没有选中数据
//   if (!selectTableData) {
//     return ElMessage.warning('请至少选择一项数据')
//   }
//   // const idsToDelete = selectTableData.value.map(item => item.id); // 获取选中的 ID 列表
//   deleteDepartment({ id: selectTableData.value }).then(({ data }) => {
//     //id: array[string] 需要删除的id数组
//     if (data.code === 200) {
//       getListData()
//     }
//   })
// }
//test
const confirmEvent = () => {
  // 检查是否有选中数据
  if (selectTableData.value.length === 0) {
    return ElMessage.warning('请至少选择一项数据')
  }

  // 从 allData 和 departmentList 中删除选中的科室
  selectTableData.value.forEach((selected) => {
    // 从 allData 中删除
    const indexInAllData = allData.value.findIndex((item) => item.id === selected.id)
    if (indexInAllData !== -1) {
      allData.value.splice(indexInAllData, 1) // 删除科室
    }

    // 从 departmentList 中删除
    const indexInDepartmentList = departmentList.value.findIndex((item) => item.id === selected.id)
    if (indexInDepartmentList !== -1) {
      departmentList.value.splice(indexInDepartmentList, 1) // 删除科室
    }
  })

  // 更新列表数据
  getListData()
  ElMessage.success('删除成功') // 显示成功消息
}
</script>
<style lang="less" scoped>
.btns {
  // 设置为弹性容器
  display: flex;
  /* 上下 */
  justify-content: space-between;
  align-items: center;
  /* 垂直方向居中 ，当设置为 center 时，项目将在其容器的交叉轴上居中对齐。*/
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  padding-top: 10px;
  padding-bottom: 30px;

  .header-left {
    height: 100%;
  }

  .header-right {
    margin-left: 10px;
    padding-right: 20px;
    height: 100%;
  }
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
.el-table {
  border: 1px solid #e0e0e0;
}

.el-table th {
  background-color: #f5f5f5;
  color: #333;
}

.el-table tr:hover {
  background-color: #f0f0f0;
}
</style>

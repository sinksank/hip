<template>
  <div>
    <div class="btns">
      <div class="header-left">
        <br />
        <el-select
          v-model="selectedDuties"
          placeholder="选择职位"
          size="default"
          style="width: 200px; margin-left: 10px"
        >
          <el-option label="主任医师" value="主任医师" />
          <el-option label="副主任医师" value="副主任医师" />
        </el-select>
        <el-button type="primary" @click="handleSearchDuties" size="small" style="margin-left: 10px"
          >搜索</el-button
        >
      </div>
      <div>
        <br />
        <!-- 科室这里的数据需要访问后台获取 departmentList-->
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
        <br />
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
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="avatar" label="头像">
        <template #default="scope">
          <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="姓别" />
      <el-table-column prop="duties" label="职位" />
      <el-table-column prop="department" label="科室" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="create_time" label="创建时间">
        <template #default="scope">
          <div class="flex-box">
            <el-icon><Clock /></el-icon>
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
        layout="total, prev, pager, next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="dialogFormVisable" :before-close="beforeClose" title="添加医生" width="500">
      <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
        <el-form-item v-show="false" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisable = true"
            >点击上传</el-button
          >
          <el-image v-else :src="form.avatar" style="width: 100px; height: 100px" />
          <!-- 这里的头像是本地的图片资源 -->
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <!-- 职务 -->
        <el-form-item label="职务" prop="duties">
          <el-select v-model="form.duties" placeholder="请选择职务">
            <el-option label="主任医师" value="主任医师" />
            <el-option label="副主任医师" value="副主任医师" />
          </el-select>
        </el-form-item>
        <el-form-item label="科室" prop="department">
          <!-- 注：科室 有待改 需要请求科室然后渲染 未写-->
          <el-select
            v-model="selectedDepartment"
            placeholder="选择科室"
            size="default"
            style="width: 200px; margin-left: 10px"
          >
            <el-option
              v-for="department in departmentList"
              :key="department.id"
              :label="department.name"
              :value="department.department"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="20" :max="55" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogImgVisable" :before-close="beforeClose" title="选择图片" width="680">
      <div class="image-list">
        <!-- 注：这里根据实际情况改key值 -->
        <div
          v-for="(item, index) in fileList"
          :key="item.id"
          class="img-box"
          @click="selectIndex = index"
        >
          <!-- 选中的效果 -->
          <div v-if="selectIndex === index" class="select">
            <el-icon color="#fff"><Check /></el-icon>
          </div>
          <el-image style="width: 148px; height: 148px" :src="item.url" />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" plain @click="dialogImgVisable = false">取消</el-button>
          <el-button type="primary" @click="confirmImg">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { Plus, DeleteFilled, InfoFilled } from '@element-plus/icons-vue'
import { onMounted, ref, reactive, nextTick } from 'vue'
import { photoList, companion, companionList, deleteCompanion, getDepartmentList } from '../../api'
import { ElMessage } from 'element-plus'
const allData = ref([])
const fileList = ref([])
onMounted(() => {
  allData.value = [
    {
      id: 1,
      name: 'Aurora',
      avatar: '../../../public/默认头像.webp',
      sex: '女',
      duties: '主任医师',
      department: '内科',
      age: 30,
      mobile: '19558286672',
      create_time: '2024/9/2 12:00:00'
    },
    {
      id: 2,
      name: '李四',
      avatar: '../../../public/医生1.webp',
      sex: '男',
      duties: '副主任医师',
      department: '外科',
      age: 35,
      mobile: '12345678902',
      create_time: '2023/9/2 12:00:00'
    },
    {
      id: 3,
      name: '王五',
      avatar: '../../../public/女医生.webp',
      sex: '女',
      duties: '副主任医师',
      department: '妇产科',
      age: 28,
      mobile: '12345678903',
      create_time: '2024/9/3 12:00:00'
    },
    {
      id: 4,
      name: '赵六',
      avatar: '../../../public/男医生2.png',
      sex: '男',
      duties: '主任医师',
      department: '儿科',
      age: 26,
      mobile: '12345678904',
      create_time: '2024/8/24 12:00:00'
    },
    {
      id: 5,
      name: '钱七',
      avatar: '../../../public/女医生2.png',
      sex: '女',
      duties: '副主任医师',
      department: '皮肤科',
      age: 40,
      mobile: '12345678905',
      create_time: '2024/8/15 12:00:00'
    },
    {
      id: 6,
      name: '孙八',
      avatar: '../../../public/男医生3.png',
      sex: '男',
      duties: '副主任医师',
      department: '病理科',
      age: 38,
      mobile: '12345678906',
      create_time: '2024/8/26 12:00:00'
    },
    {
      id: 7,
      name: '周九',
      avatar: '../../../public/女医生3.png',
      sex: '女',
      duties: '主治医师',
      department: '急诊科',
      age: 32,
      mobile: '12345678907',
      create_time: '2024/9/7 12:00:00'
    },
    {
      id: 8,
      name: '吴十',
      avatar: '../../../public/男医生4.png',
      sex: '男',
      duties: '主任医师',
      department: '神经内科',
      age: 29,
      mobile: '12345678908',
      create_time: '2024/8/28 12:00:00'
    },
    {
      id: 9,
      name: '十一',
      avatar: '../../../public/医生女2.webp',
      sex: '女',
      duties: '主任医师',
      department: '呼吸科',
      age: 29,
      mobile: '12345678948',
      create_time: '2024/8/28 12:00:00'
    },
    {
      id: 10,
      name: 'Dream',
      avatar: '../../../public/医生男1.webp',
      sex: '男',
      duties: '副主任医师',
      department: '急诊科',
      age: 29,
      mobile: '12545678948',
      create_time: '2024/8/28 12:00:00'
    }
  ]
  fileList.value = [
    {
      id: 1,
      url: '../../../public/医生女2.webp'
    },
    {
      id: 2,
      url: '../../../public/医生女4.webp'
    },
    {
      id: 3,
      url: '../../../public/医生男1.webp'
    },
    {
      id: 4,
      url: '../../../public/医生女1.webp'
    },
    {
      id: 5,
      url: '../../../public/医生1.webp'
    },
    {
      id: 6,
      url: '../../../public/医生男2.webp'
    }
  ]
  //获取头像信息
  // photoList().then(({ data }) => {
  //   fileList.value = data.data //赋值
  // })
  getListData()
  getDepartmentData()
})

const selectIndex = ref(0) //头像选中的效果
const dialogFormVisable = ref(false)
let dialogImgVisable = ref(false)

const beforeClose = () => {
  dialogFormVisable.value = false
  //清空当前form
  formRef.value.resetFields()
  selectedDepartment.value = '' // 重置科室选择
}
const formRef = ref()
const form = reactive({
  id: '',
  avatar: '', //头像
  name: '',
  sex: '',
  mobile: '',
  age: 28,
  duties: '', //职务
  department: '' //科室
  // 是否生效
})
//确认图片
// const confirmImg = () => {
//   form.avatar = fileList[selectIndex.value].url
//   dialogImgVisable = false
// }

const confirmImg = () => {
  // 检查 selectIndex 是否在有效范围内
  if (selectIndex.value >= 0 && selectIndex.value < fileList.value.length) {
    form.avatar = fileList.value[selectIndex.value].url
    dialogImgVisable.value = false
  } else {
    console.error('选择的索引无效:', selectIndex.value)
  }
}

const rules = reactive({
  name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
  avatar: [{ required: true, message: '请选择头像' }],
  sex: [{ required: true, trigger: 'change', message: '请选择性别' }],
  duties: [{ required: true, trigger: 'change', message: '请选择职务' }],
  // department: [{ required: true, trigger: 'change', message: '请选择科室' }],
  mobile: [{ required: true, trigger: 'blur', message: '请输入手机号' }]
})
const now = new Date()
const currentData = ref('')
currentData.value = now.toLocaleString()

const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const now = new Date().toLocaleString() // 获取当前时间
      if (form.id) {
        const indexInAllData = allData.value.findIndex((dept) => dept.id === form.id)
        if (indexInAllData !== -1) {
          form.department = selectedDepartment.value // 确保将选中的科室赋值给 form.department
          // 更新 allData
          allData.value[indexInAllData] = {
            id: form.id,
            name: form.name,
            avatar: form.avatar,
            sex: form.sex,
            duties: form.duties,
            department: form.department,
            age: form.age,
            mobile: form.mobile,
            create_time: now // 更新创建时间
          }
          ElMessage.success('编辑成功') // 显示成功消息
        } else {
          ElMessage.error('编辑失败，科室未找到') // 显示错误消息
        }
      } else {
        // 添加科室
        form.department = selectedDepartment.value // 确保将选中的科室赋值给 form.department
        const newId = allData.value.length
          ? Math.max(...allData.value.map((item) => item.id)) + 1
          : 1 // 生成新的 ID
        const newDepartment = {
          id: newId,
          name: form.name,
          avatar: form.avatar,
          sex: form.sex,
          duties: form.duties,
          department: form.department,
          age: form.age,
          mobile: form.mobile,
          create_time: now // 更新创建时间
        }
        allData.value.push(newDepartment) // 同时将新科室添加到 allData
        console.log(allData)
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
    }
  })
}
const selectedDuties = ref('') // 选择的职位
const selectedDepartment = ref('') //选中的科室
const departmentList = ref([]) //科室信息列表
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
// const handleSearchDuties = () => {
//   paginationData.pageNum = 1 // 重置为第一页
//   getListData() // 重新获取数据
// }
// test
const handleSearchDuties = () => {
  paginationData.pageNum = 1 // 重置为第一页
  // 如果没有选择职位，则显示所有数据
  if (!selectedDuties.value) {
    getListData() // 重新获取数据
    return
  }
  // 根据选中的职位过滤数据
  const filteredData = allData.value.filter((item) => item.duties === selectedDuties.value)
  // 更新表格数据

  console.log(selectedDuties.value)
  tableData.list = filteredData
  tableData.total = filteredData.length // 更新总数
}

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
  })
  // 更新列表数据
  getListData()
  ElMessage.success('删除成功') // 显示成功消息
}
//点击批量删除
// const confirmEvent = () => {
//   //没有选中数据
//   if (!selectTableData) {
//     return ElMessage.warning('请至少选择一项数据')
//   }
//   // const idsToDelete = selectTableData.value.map(item => item.id); // 获取选中的 ID 列表
//   deleteCompanion({ id: selectTableData.value }).then(({ data }) => {
//     //id: array[string] 需要删除的id数组
//     if (data.code === 200) {
//       getListData()
//     }
//   })
// }
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
</style>

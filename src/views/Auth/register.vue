<template>
  <div>
    <div class="btns">
      <div class="header-left">
        <br />
        <el-select
          v-model="selectedActive"
          placeholder="请选择就诊状态"
          size="default"
          style="width: 200px; margin-left: 10px"
        >
          <el-option label="已就诊" value="已就诊" />
          <el-option label="未就诊" value="未就诊" />
        </el-select>
        <el-button type="primary" @click="handleSearchActive" size="small" style="margin-left: 10px"
          >搜索</el-button
        >
      </div>
      <div class="header-right">
        <br />
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
      <el-table-column prop="name" label="患者姓名" />
      <el-table-column prop="sex" label="姓别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="active" label="状态" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="scope.row.active === '未就诊'"
            type="primary"
            size="small"
            @click="visit(scope.row)"
            >叫号</el-button
          >
          <!-- 若果已就诊则查看病例详情 还没实现-->
          <el-button
            v-if="scope.row.active === '已就诊'"
            type="primary"
            size="small"
            @click="open(scope.row)"
            >查看病例</el-button
          >
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
    <!-- 这里是弹窗显示已就诊的病例 -->
    <el-dialog v-model="dialogFormVisable" :before-close="beforeClose" title="诊断病例" width="700">
      <!-- 动态生成的病例报告 -->
      <div class="patient-info">
        <h2 class="title">sinksank医院门诊病例</h2>
        <div class="flex_box">
          <p><strong>姓名:</strong>{{ patientInfo.name }}</p>
          <p><strong>性别:</strong>{{ patientInfo.sex }}</p>
          <p><strong>年龄:</strong>{{ patientInfo.age }}</p>
          <p><strong>联系方式:</strong>{{ patientInfo.mobile }}</p>
        </div>
        <div class="flex_box">
          <p><strong>医生：</strong>{{ patientInfo.doctor }}</p>
          <p><strong>科室：</strong>{{ patientInfo.depart }}</p>
          <p><strong>就诊时间：</strong>{{ patientInfo.dataTime }}</p>
        </div>
      </div>
      <div style="margin-top: 20px">
        <el-form :model="formData" ref="formRef">
          <el-form-item label="主  诉">
            <el-input v-model="formData.mainComplaint" readonly />
          </el-form-item>
          <el-form-item label="现病史">
            <el-input v-model="formData.currentIllnessHistory" readonly />
          </el-form-item>
          <el-form-item label="既往病史">
            <el-input v-model="formData.pastMedicalHistory" readonly />
          </el-form-item>
          <el-form-item label="过敏史">
            <el-input v-model="formData.allergyHistory" readonly />
          </el-form-item>
          <el-form-item label="个人史">
            <el-input v-model="formData.personalHistory" readonly />
          </el-form-item>
          <el-form-item label="婚姻史">
            <el-input v-model="formData.maritalHistory" readonly />
          </el-form-item>
          <el-form-item label="诊断结果">
            <el-input v-model="formData.assessment" readonly />
          </el-form-item>
          <el-form-item label="治疗计划">
            <el-input v-model="formData.generalCheck" readonly />
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { Plus, DeleteFilled, InfoFilled } from '@element-plus/icons-vue'
import { onMounted, ref, reactive } from 'vue'
import { getPatientList, deletePatient, getDiagnoseRecord } from '../../api'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const allData = ref([])
onMounted(async () => {
  allData.value = [
    {
      id: 1,
      name: '杨晓雪',
      sex: '女',
      age: 19,
      mobile: '19887543326',
      active: '已就诊'
    },
    {
      id: 2,
      name: '胡可',
      sex: '男',
      age: 25,
      mobile: '19888943390',
      active: '未就诊'
    },
    // {
    //   id: 2,
    //   name: '胡可',
    //   sex: '男',
    //   age: 25,
    //   mobile: '19888943390',
    //   active: '已就诊'
    // },
    {
      id: 3,
      name: '路漫漫',
      sex: '女',
      age: 47,
      mobile: '12488943378',
      active: '未就诊'
    },
    {
      id: 4,
      name: '吴飞',
      sex: '男',
      age: 67,
      mobile: '18888943378',
      active: '已就诊'
    },
    {
      id: 5,
      name: '李勇',
      sex: '男',
      age: 51,
      mobile: '13343378567',
      active: '已就诊'
    },
    {
      id: 6,
      name: '赵烨',
      sex: '男',
      age: 45,
      mobile: '19953378567',
      active: '已就诊'
    },
    {
      id: 7,
      name: '何玉',
      sex: '女',
      age: 23,
      mobile: '19958567675',
      active: '已就诊'
    },
    {
      id: 8,
      name: '萧雨',
      sex: '女',
      age: 66,
      mobile: '19953378887',
      active: '未就诊'
    },
    {
      id: 9,
      name: '杨欣',
      sex: '女',
      age: 33,
      mobile: '19966668887',
      active: '未就诊'
    }
  ]
  getListData()
})
const dialogFormVisable = ref(false)
const beforeClose = () => {
  dialogFormVisable.value = false
  formRef.value.resetFields() // 使用正确的调用方式
}

const formRef = ref()
const form = reactive({
  id: '1',
  name: 'trial',
  sex: '男',
  age: 28,
  active: '已就诊', // 状态 --已就诊//未就诊
  mobile: '19558672245'
})
const patientInfo = ref({
  name: '',
  sex: '',
  age: '',
  mobile: '',
  depart: '',
  doctor: '',
  dataTime: ''
})

const formData = ref({
  mainComplaint: '',
  currentIllnessHistory: '',
  pastMedicalHistory: '',
  allergyHistory: '',
  personalHistory: '',
  maritalHistory: '',
  assessment: '',
  generalCheck: ''
})

//如果已就诊则打开病例详情
const open = async (rowData = {}) => {
  dialogFormVisable.value = true
  patientInfo.value = {
    name: '杨晓雪',
    sex: '女',
    age: 19,
    mobile: '19887543326',
    depart: 'Aurora',
    doctor: '内科',
    dataTime: '2024-08-16 12:58:23'
  }
  formData.value = {
    mainComplaint: '头痛',
    currentIllnessHistory: '持续头痛三天',
    pastMedicalHistory: '无',
    allergyHistory: '无',
    personalHistory: '无',
    maritalHistory: '已婚',
    assessment: '无明显异常',
    generalCheck: '建议多休息'
  }
}

const router = useRouter()

const visit = (rowData) => {
  rowData.active.value === '已就诊'
  getListData()
  router.push('/simplified')
}

const selectedActive = ref('') // 选择的就诊状态

const paginationData = reactive({
  pageNum: 1, //当前页码
  pageSize: 8 //每页多少条
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

const handleSearchActive = () => {
  paginationData.pageNum = 1 // 重置为第一页

  // 如果没有选择科室，则显示所有科室
  if (!selectedActive.value) {
    getListData() // 重新获取数据
    return
  }

  // 根据选中的科室过滤数据
  const filteredData = allData.value.filter((item) => item.active === selectedActive.value)
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
.flex_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  p {
    font-size: 16px;
  }
}
.title {
  color: #00796b;
  text-align: center; /* 居中标题 */
  margin-bottom: 40px; /* 底部间距 */
}
.patient-info {
  border-radius: 2px; /* 圆角 */
  margin-bottom: 40px;
}
</style>

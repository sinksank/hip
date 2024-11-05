<template>
  <div>
    <div class="btns">
      <!-- 科室这里的数据需要访问后台获取 departmentList-->
      <div class="header-left">
        <el-input
          v-model="searchMobile"
          placeholder="请输入要查询的手机号"
          size="default"
          style="width: 200px; margin-left: 10px"
        />
        <el-button type="primary" @click="handleSearchCase" size="small" style="margin-left: 10px"
          >搜索</el-button
        >
      </div>
      <div class="header-right">
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
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="mobile" label="联系方式" />
      <el-table-column prop="depart" label="科室" />
      <el-table-column prop="dataTime" label="确诊时间"> </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="open(row)">查看详情</el-button>
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
    <!-- 病例详情对话框 -->
    <el-dialog v-model="dialogFormVisable" :before-close="beforeClose" title="病例详情" width="700">
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
        <el-form :model="formData" ref="formRef" label-width="100px" label-position="left">
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

      <template #footer>
        <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { Plus, DeleteFilled, InfoFilled } from '@element-plus/icons-vue'
// import { deleteCaseRecord, getCaseRecordList, getDiagnoseRecord } from '../../api'
const allData = ref([])
const now = new Date()
onMounted(() => {
  allData.value = [
    {
      id: 1,
      name: '杨晓雪',
      sex: '女',
      age: 19,
      mobile: '19887543326',
      depart: '内科',
      doctor: 'Aurora',
      dataTime: '2024/8/16 12:58:23'
    },
    {
      id: 2,
      name: '吴飞',
      sex: '男',
      age: 67,
      mobile: '18888943378',
      depart: '内科',
      doctor: 'Aurora',
      dataTime: '2024/8/19 12:59:29'
    },
    {
      id: 3,
      name: '李勇',
      sex: '男',
      age: 51,
      mobile: '13343378567',
      depart: '内科',
      doctor: 'Aurora',
      dataTime: '2024/8/21 13:00:13'
    },
    {
      id: 4,
      name: '赵烨',
      sex: '男',
      age: 45,
      mobile: '19953378567',
      depart: '内科',
      doctor: 'Aurora',
      dataTime: '2024/8/24 13:01:45'
    },
    {
      id: 5,
      name: '何玉',
      sex: '女',
      age: 23,
      mobile: '19958567675',
      depart: '内科',
      doctor: 'Aurora',
      dataTime: '2024/8/28 13:01:07'
    },
    {
      id: 6,
      name: '胡可',
      sex: '男',
      age: 25,
      mobile: '19888943390',
      depart: '内科',
      doctor: 'Aurora',
      dataTime: now.toLocaleString()
    }
  ]
  getListData()
})

const dialogFormVisable = ref(false)

const beforeClose = () => {
  dialogFormVisable.value = false
  //清空当前form
  formRef.value.resetFields()
  searchMobile.value = '' // 重置手机号查询
}
const formRef = ref()

// 定义响应式变量
const patientInfo = ref({
  name: '',
  sex: '',
  age: '',
  mobile: '',
  depart: '',
  doctor: '',
  dateTime: ''
}) // 存储患者信息

const formData = ref({
  // 存储预问诊数据
  mainComplaint: '', //主诉
  currentIllnessHistory: '', //现病史
  pastMedicalHistory: '', //既往病史
  allergyHistory: '', //  过敏病史
  personalHistory: '', //个人病史
  maritalHistory: '', //婚姻史
  assessment: '',
  generalCheck: ''
})
//查看病历详情
const open = () => {
  dialogFormVisable.value = true
  // 更新患者信息
  patientInfo.value = {
    name: '胡可',
    sex: '男',
    age: 25,
    mobile: '19888943390',
    depart: '内科',
    doctor: 'Aurora',
    dataTime: now.toLocaleDateString()
  }

  // 更新病例数据
  formData.value = {
    mainComplaint: '胃痛，恶心',
    currentIllnessHistory: '食欲不振，厌食',
    pastMedicalHistory: '无肠胃炎，胰腺炎等病史',
    allergyHistory: '无',
    personalHistory: '饮食好辛辣',
    maritalHistory: '已婚',
    assessment: '慢性胃炎',
    generalCheck: '少食辛辣食品，抗生素一盒'
  }
}

const searchMobile = ref('') //要搜索病例的患者手机号
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
//test
const getListData = () => {
  // 计算分页数据
  const start = (paginationData.pageNum - 1) * paginationData.pageSize
  const end = start + paginationData.pageSize
  tableData.list = allData.value.slice(start, end) // 切割数据
  tableData.total = allData.value.length // 更新总数
}

const handleSearchCase = () => {
  paginationData.pageNum = 1 // 重置为第一页

  // 如果没有选择科室，则显示所有科室
  if (!searchMobile.value) {
    getListData() // 重新获取数据
    return
  }

  // 根据选中的手机号过滤数据
  const filteredData = allData.value.filter((item) => item.mobile === searchMobile.value)
  // 更新表格数据
  tableData.list = filteredData
  tableData.total = filteredData.length // 更新总数
}

//选中的table项
const selectTableData = ref([])
const handleSelectionChange = (val) => {
  selectTableData.value = val.map((item) => ({ id: item.id }))
}
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

<template>
  <el-row>
    <!-- 医生诊断病例部分 -->
    <el-col :span="12" class="painter">
      <div class="left">
        <div class="paint" ref="reportContent">
          <!-- 动态生成的病例报告 -->
          <div class="patient-info">
            <h2 class="title">sinksank医院门诊病例</h2>
            <div class="flex_box">
              <p><strong>姓名:</strong>胡可{{ patientInfo.name }}</p>
              <p><strong>性别:</strong>男{{ patientInfo.sex }}</p>
              <p><strong>年龄:</strong>25{{ patientInfo.age }}</p>
              <p><strong>联系方式:</strong>19888943390 {{ patientInfo.mobile }}</p>
            </div>
            <div class="flex_box">
              <p><strong>医生：</strong>{{ patientInfo.doctor }}</p>
              <p><strong>科室：</strong>{{ patientInfo.depart }}</p>
              <p><strong>就诊时间：</strong>{{ patientInfo.dateTime }}</p>
            </div>
          </div>
          <div style="margin-top: 20px">
            <el-form :model="formData" ref="formRef">
              <el-form-item label="主  诉">
                <el-input v-model="formData.mainComplaint" placeholder="请输入主诉" />
              </el-form-item>
              <el-form-item label="现病史">
                <el-input v-model="formData.currentIllnessHistory" placeholder="请输入现病史" />
              </el-form-item>
              <el-form-item label="既往病史">
                <el-input v-model="formData.pastMedicalHistory" placeholder="请输入既往病史" />
              </el-form-item>
              <el-form-item label="过敏史">
                <el-input v-model="formData.allergyHistory" placeholder="请输入过敏史" />
              </el-form-item>
              <el-form-item label="个人史">
                <el-input v-model="formData.personalHistory" placeholder="请输入个人史" />
              </el-form-item>
              <el-form-item label="婚姻史">
                <el-input v-model="formData.maritalHistory" placeholder="请输入婚姻史" />
              </el-form-item>

              <el-form-item label="诊断结果">
                <el-input v-model="formData.assessment" placeholder="请输入诊断结果" />
              </el-form-item>
              <el-form-item label="治疗计划">
                <el-input v-model="formData.generalCheck" placeholder="请输入治疗计划" />
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="header" style="justify-content: left; margin-top: 50px">
          <!-- 打印和导出按钮 -->
          <el-button type="primary" size="small" @click="printReport">打印病历</el-button>
          <el-button type="primary" size="small" @click="exportReport">导出病历</el-button>
          <el-button
            type="primary"
            plain
            size="small"
            @click="cancelFormData()"
            style="margin-left: 260px"
            >取消</el-button
          >
          <el-button type="primary" size="small" @click="saveCase(formRef)">保存</el-button>
        </div>
      </div>
    </el-col>
    <!-- 预问诊病例部分 -->
    <el-col :span="12">
      <div class="right">
        <h2 class="title">预问诊病例</h2>
        <!-- AI推荐诊断信息 -->
        <p class="recommendation">AI诊断推荐: {{ aiDiagnosisRecommendation }}</p>

        <!-- 循环显示每个预问诊问题 -->
        <div v-for="(item, index) in questions" :key="index">
          <span>{{ item.label }}:</span>
          <!-- 导入和光标导入按钮 -->
          <div class="header">
            <el-button type="primary" plain size="small" @click="importData(item.key)"
              >导入</el-button
            >
            <el-button type="primary" plain size="small" @click="cursorImportData(item.key)"
              >光标导入</el-button
            >
          </div>
          <!-- 显示每个问题的内容 -->
          <p class="recommendation" style="padding-bottom: 10px; padding-left: 30px">
            {{ form[item.key] }}
          </p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPatientCase, savePatientCase } from '../../api'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas' // 如果需要将 HTML 内容转换为图片
import { ElMessage } from 'element-plus'
const reportContent = ref(null)
// 定义一个名为exportReport的异步函数
const exportReport = async () => {
  // 检查reportContent.value是否存在，如果不存在则输出错误信息并返回
  if (!reportContent.value) {
    console.error('Report content is not available.')
    return
  }

  try {
    // 使用html2canvas库将reportContent.value转换为canvas对象，设置跨域访问和缩放比例为2
    const canvas = await html2canvas(reportContent.value, {
      useCORS: true,
      scale: 2
    })
    // 将canvas对象转换为PNG格式的图片数据URL
    const imgData = canvas.toDataURL('image/png')

    // 创建一个jsPDF实例，设置纸张方向为纵向，单位为毫米，纸张格式为A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // 将图片数据添加到PDF中，位置为(10, 10)，宽度为190，高度自动适应
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0)
    // 保存生成的PDF文件，命名为"病例报告.pdf"
    pdf.save('病例报告.pdf')
  } catch (error) {
    // 如果导出过程中出现错误，输出错误信息
    console.error('Error exporting report:', error)
  }
}

const formRef = ref()
const cancelFormData = () => {
  formData.value = {
    mainComplaint: '',
    currentIllnessHistory: '',
    pastMedicalHistory: '',
    allergyHistory: '',
    personalHistory: '',
    maritalHistory: '',
    assessment: '',
    generalCheck: ''
  }
}

// 获取当前路由信息
const route = useRoute()
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

const aiDiagnosisRecommendation = ref('根据患者信息，推荐的诊断是...') // AI推荐诊断信息
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
//接收后端的预问诊数据
const form = ref({
  mainComplaint: '',
  currentIllnessHistory: '',
  pastMedicalHistory: '',
  allergyHistory: '',
  personalHistory: '',
  maritalHistory: '',
  assessment: '',
  generalCheck: ''
})

// 导入功能实现
const importData = (key) => {
  console.log(`导入 ${key}:`, form.value[key])
  // 将数据填充到患者信息的相应字段
  formData.value[key] = form.value[key]
}

const cursorImportData = (key) => {
  console.log(`光标导入 ${key}:`, form.value[key])
  // 光标导入的逻辑
  // 直接更新患者信息的相应字段
  formData.value[key] = form.value[key]
}

// 预问诊问题配置
const questions = ref([
  { label: '主诉', key: 'mainComplaint' },
  { label: '现病史', key: 'currentIllnessHistory' },
  { label: '既往病史', key: 'pastMedicalHistory' },
  { label: '过敏史', key: 'allergyHistory' },
  { label: '个人史', key: 'personalHistory' },
  { label: '婚姻史', key: 'maritalHistory' }
])

onMounted(async () => {
  const now = new Date()
  // await getPatientCase(patientId)
  patientInfo.value = {
    name: '',
    sex: '',
    age: '',
    mobile: '',
    depart: '内科',
    doctor: 'Aurora',
    dateTime: now.toLocaleString()
  }
  //   // 更新预问诊数据
  // form.value = {
  //   mainComplaint: '需导入的主诉',
  //   currentIllnessHistory: '需导入的现病史',
  //   pastMedicalHistory: '需导入的既往病史',
  //   allergyHistory: '需导入的过敏史',
  //   personalHistory: '需导入的个人史',
  //   maritalHistory: '需导入的已婚或者未婚'
  // }
  // 更新预问诊数据
  form.value = {
    mainComplaint: '头疼',
    currentIllnessHistory: '有点发烧',
    pastMedicalHistory: '做过心脏手术',
    allergyHistory: '无',
    personalHistory: '饮食好辛辣',
    maritalHistory: '已婚'
  }
})

// 打印病例
const isPrinting = ref(false)
const printReport = () => {
  isPrinting.value = true
  //等待vue重新渲染
  setTimeout(() => {
    window.print() // 调用浏览器打印功能
    // 打印后可以取消这个状态
    isPrinting.value = false
  }, 500)
}

// 保存病例数据
const saveCase = async () => {
  const caseData = {
    id: route.params.patientId,
    name: patientInfo.value.name,
    sex: patientInfo.value.sex,
    age: patientInfo.value.age,
    mobile: patientInfo.value.mobile,
    depart: patientInfo.value.depart,
    doctor: patientInfo.value.doctor,
    dateTime: patientInfo.value.dateTime,
    mainComplaint: formData.value.mainComplaint,
    currentIllnessHistory: formData.value.currentIllnessHistory,
    pastMedicalHistory: formData.value.pastMedicalHistory,
    allergyHistory: formData.value.allergyHistory,
    personalHistory: formData.value.personalHistory,
    maritalHistory: formData.value.maritalHistory,
    assessment: formData.value.assessment,
    generalCheck: formData.value.generalCheck
  }

  try {
    await savePatientCase(caseData)
    console.log('病例数据保存成功')
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存病例数据失败:', error)
    ElMessage.success('保存成功')
  }
}
</script>

<style lang="less" scoped>
.flex_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  p {
    font-size: 16px;
  }
}
.left {
  height: 87vh;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9; /* 更柔和的背景色 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.right {
  height: 87vh;
  border: 1px solid #b2ebf2;
  border-radius: 8px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: flex-end; /* 右对齐 */
}

.title {
  color: #00796b;
  text-align: center; /* 居中标题 */
  margin-bottom: 40px; /* 底部间距 */
}

.recommendation {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
}

.patient-info {
  border-radius: 2px; /* 圆角 */
  margin-bottom: 40px;
}
@media print {
  .paint {
    width: 90%; /* 确保左边部分在打印时占满整个页面宽度 */
    visibility: visible;
    position: absolute;
    border-radius: 1px;
    margin: 10px;
    padding: 20px;
    background-color: #f9f9f9;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
    left: 0;
    right: 0;
  }
  .right,
  .header,
  .painter {
    visibility: hidden;
  }
}
</style>

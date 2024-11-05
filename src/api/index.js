import request from '../utils/request'
//登录
export const getLogin = (data) => {
  return request.post('/getlogin', data)
}
//医生头像列表
export const photoList = () => {
  return request.get('/photo/list')
}
//医生创建（添加或编辑）
export const companion = (data) => {
  return request.post('/companion', data)
}
//医生列表信息  注意参数按参数查询
export const companionList = (params) => {
  return request.get('/companion/list', { params })
}
//医生删除  /delete/companion
export const deleteCompanion = (data) => {
  return request.post('/delete/companion', data)
}

//科室列表 /departmentList   注意参数按参数查询
export const getDepartmentList = (params) => {
  return request.get('/departmentList', { params })
}

//添加科室  或编辑
export const addDepartment = (data) => {
  return request.post('/addDepartment', data)
}

//科室删除
export const deleteDepartment = (data) => {
  return request.post('/deleteDepartment', data)
}

//用户日志列表
export const getLogList = (params) => {
  return request.get('/getLogList', { params })
}
//用户日志删除
export const deleteLog = (data) => {
  return request.post('/deleteLog', data)
}

//得到折线图数据

// 后端返回的数据类型
// {
//   "xAxis": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
//   "series": [10, 22, 28, 23, 19, 22, 30]
// }
export const getChart = (params) => {
  return request.get('/getChart', { params })
}

//根据查询条件得到患者列表

export const getPatientList = (params) => {
  return request.get('/get/patientlist', { params })
}

//删除患者

export const deletePatient = (data) => {
  return request.post('/deletePatient', data)
}

//将医生问诊后的病例发送到后端添加在数据库中

export const addMedicalRecord = (data) => {
  return request.post('/addMedicalRecord', data)
}

//根据患者id得到后端的预问诊病例
export const getPatientCase = (params) => {
  return request.get('/getPatientCase', { params })
}

// 发送新病例数据到后端
export const savePatientCase = (data) => {
  return request.post('/save/patientcase', data)
}

//根据患者的联系方式查询已问诊病例
export const getDiagnoseRecord = (params) => {
  return request.get('/diagnose/record', { params })
}

//查询所有就诊患者的病例   根据查询条件得到列表

export const getCaseRecordList = (params) => {
  return request.get('/getCaseRecordList', { params })
}

//删除id病历单

export const deleteCaseRecord = (data) => {
  return request.post('/deleteCaseRecord', data)
}

//用户登录之后将登录记录插入数据库
export const addVisitRecord = (data) => {
  return request.post('/visit/record', data)
}

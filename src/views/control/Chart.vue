<!-- 这里注意获取折线图数据方法还未激活 -->

<template>
    <div ref="chart" class="chartInit"></div>
  </template>
  
  <script setup>
  import * as echarts from 'echarts';
  import { ref, reactive, onMounted } from 'vue';
  import { getChart } from '../../api'; // 引入后端 API 函数
  
  const chart = ref(); // 创建 DOM 引用
  
  // 指定图表的配置项和数据
  const option = reactive({
    title: {
      text: '近一周内就诊患者人数分布图',
      textStyle: {
      fontSize: 20 
    }
    },
    tooltip: {},
    xAxis: {
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] // 初始值
    },
    yAxis: {},
    series: [
      {
        data: [10, 22, 28, 23, 19, 22, 30], // 初始值
        type: 'line',
        label: {
          show: true,
          position: 'bottom',
          textStyle: {
            fontSize: 20
          }
        }
      }
    ]
  });
  
  let myChart; // 声明图表实例
  
  onMounted(() => {
    initChart(); // 初始化图表
    // fetchChartData(); // 获取后端数据
  });
  
  // 初始化图表
  const initChart = () => {
    myChart = echarts.init(chart.value);
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };
  
  // 获取后端数据
  const fetchChartData = async () => {
    try {
      const response = await getChart(); // 调用后端 API 获取数据
      const data = response.data; // 返回的数据格式为 { xAxis: [...], series: [...] }
      
      // 更新图表配置项
      option.xAxis.data = data.xAxis; // 更新 x 轴数据
      option.series[0].data = data.series; // 更新系列数据
      updateChart(); // 更新图表
    } catch (error) {
      console.error('获取数据失败:', error);
      // 可以在这里处理错误情况，比如显示一个提示
    }
  };
  
  // 更新图表
  const updateChart = () => {
    myChart.setOption(option); // 更新图表配置项
  };
  </script>
  
  <style lang="less">
  .chartInit {
    padding-top: 50px;
    padding-left: 50px;
    width: 800px;
    height: 400px;
  }
  </style>
  
<!-- IncomesChart.vue -->
<template>
  <div ref="chartContainer" class="w-full h-[600px]"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from 'echarts';

const props = defineProps({
  incomesData: {
    type: Array as () => Array<{
      date: string;
      quantity: number;
      income_id: number;
    }>,
    required: true
  }
});

const chartContainer = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const prepareChartData = () => {
  if (!props.incomesData?.length) return { dates: [], quantities: [] };

  // Сортируем данные по дате
  const sortedData = [...props.incomesData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dates = sortedData.map(item => item.date);
  const quantities = sortedData.map(item => item.quantity);

  return { dates, quantities };
};

const initChart = () => {
  if (!chartContainer.value) return;

  const { dates, quantities } = prepareChartData();

  chartInstance = echarts.init(chartContainer.value);
  
  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0].data;
        return `
          Дата: ${params[0].axisValue}<br/>
          Количество: ${data}<br/>
          ID: ${props.incomesData[params[0].dataIndex]?.income_id || 'N/A'}
        `;
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        formatter: (value: string) => {
          return new Date(value).toLocaleDateString('ru-RU');
        }
      },
      name: 'Дата',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: 'Количество',
      nameLocation: 'middle',
      nameGap: 30
    },
    series: [
      {
        data: quantities,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#3b82f6'
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.6)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
          ])
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      containLabel: true
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ]
  });
};

const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

watch(() => props.incomesData, () => {
  if (chartInstance) {
    const { dates, quantities } = prepareChartData();
    chartInstance.setOption({
      xAxis: {
        data: dates
      },
      series: [
        {
          data: quantities
        }
      ]
    });
  }
}, { deep: true });

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});
</script>
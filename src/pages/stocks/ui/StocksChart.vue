<template>
  <div ref="chartContainer" class="w-full h-[600px]"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from 'echarts';
import type { StockItem } from '@/entities/stocks/types';

const props = defineProps({
  stocksData: {
    type: Array as () => StockItem[],
    required: true
  }
});

const chartContainer = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const prepareChartData = () => {
  if (!props.stocksData?.length) return { dates: [], prices: [], discounts: [] };

  const sortedData = [...props.stocksData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dates = sortedData.map(item => item.date);
  const prices = sortedData.map(item => parseFloat(item.price));
  const discounts = sortedData.map(item => parseFloat(item.discount));

  return { dates, prices, discounts };
};

const initChart = () => {
  if (!chartContainer.value) return;

  const { dates, prices, discounts } = prepareChartData();

  chartInstance = echarts.init(chartContainer.value);
  
  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const stockItem = props.stocksData[dataIndex];
        const price = params[0].data;
        const discount = params[1].data;
        return `
          <strong>${stockItem.supplier_article}</strong><br/>
          Дата: ${new Date(stockItem.date).toLocaleDateString('ru-RU')}<br/>
          Цена: ${price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}<br/>
          Скидка: ${discount}%<br/>
          Склад: ${stockItem.warehouse_name}<br/>
          NM ID: ${stockItem.nm_id}
        `;
      }
    },
    legend: {
      data: ['Цена', 'Скидка']
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        formatter: (value: string) => {
          return new Date(value).toLocaleDateString('ru-RU');
        },
        rotate: 45
      },
      name: 'Дата',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: [
      {
        type: 'value',
        name: 'Цена',
        position: 'left',
        axisLabel: {
          formatter: (value: number) => {
            return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
          }
        }
      },
      {
        type: 'value',
        name: 'Скидка %',
        position: 'right',
        axisLabel: {
          formatter: '{value}%'
        },
        max: 100,
        min: 0
      }
    ],
    series: [
      {
        name: 'Цена',
        type: 'line',
        smooth: true,
        data: prices,
        itemStyle: {
          color: '#3b82f6'
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'Скидка',
        type: 'line',
        yAxisIndex: 1,
        data: discounts,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#10b981'
        },
        itemStyle: {
          color: '#10b981'
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
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
        end: 100,
        bottom: '5%'
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

watch(() => props.stocksData, () => {
  if (chartInstance) {
    const { dates, prices, discounts } = prepareChartData();
    chartInstance.setOption({
      xAxis: {
        data: dates
      },
      series: [
        { data: prices },
        { data: discounts }
      ]
    });
  }
}, { deep: true });

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});
</script>
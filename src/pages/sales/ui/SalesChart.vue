<template>
  <div ref="chartContainer" class="w-full h-[600px]"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from 'echarts';
import type { SaleItem } from '@/entities/sales/types';

const props = defineProps({
  salesData: {
    type: Array as () => SaleItem[],
    required: true
  }
});

const chartContainer = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const prepareChartData = () => {
  if (!props.salesData?.length) return { dates: [], amounts: [], discounts: [] };

  const sortedData = [...props.salesData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dates = sortedData.map(item => item.date);
  const amounts = sortedData.map(item => parseFloat(item.total_price));
  const discounts = sortedData.map(item => parseFloat(item.discount_percent));

  return { dates, amounts, discounts };
};

const initChart = () => {
  if (!chartContainer.value) return;

  const { dates, amounts, discounts } = prepareChartData();

  chartInstance = echarts.init(chartContainer.value);
  
  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const saleItem = props.salesData[dataIndex];
        const amount = params[0].data;
        const discount = params[1].data;
        return `
          <strong>${saleItem.supplier_article}</strong><br/>
          Дата: ${new Date(saleItem.date).toLocaleDateString('ru-RU')}<br/>
          Сумма: ${amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}<br/>
          Скидка: ${discount}%<br/>
          Склад: ${saleItem.warehouse_name}<br/>
          Регион: ${saleItem.region_name}<br/>
          ID: ${saleItem.sale_id}
        `;
      }
    },
    legend: {
      data: ['Сумма продаж', 'Процент скидки']
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
        name: 'Сумма',
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
        name: 'Сумма продаж',
        type: 'line',
        smooth: true,
        data: amounts,
        itemStyle: {
          color: '#3b82f6'
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'Процент скидки',
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
      },
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

watch(() => props.salesData, () => {
  if (chartInstance) {
    const { dates, amounts, discounts } = prepareChartData();
    chartInstance.setOption({
      xAxis: {
        data: dates
      },
      series: [
        { data: amounts },
        { data: discounts },
      ]
    });
  }
}, { deep: true });

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});
</script>
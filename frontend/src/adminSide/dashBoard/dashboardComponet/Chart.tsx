import { useState, useEffect } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { AgPieSeriesOptions } from 'ag-charts-community';

interface ChartData {
  status: string;
  value: number; 
  id: string;
}

const PieChart = ({ data }: { data: any }) => {
  const [chartOptions, setChartOptions] = useState({
    data: [] as ChartData[], 
    title: {
      text: 'Users status',
    },
    background: {
      fill: '#836FFF',
    },
    series: [{
      type: 'pie',
      angleKey: 'value',
      labelKey: 'status',
      calloutLabelKey: 'status',
      innerRadiusRatio: 0.7,
      fills: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99'],
    } as AgPieSeriesOptions], 
  });

  useEffect(() => {
    const processedData = getData(data);
    setChartOptions({ ...chartOptions, data: processedData });
  }, [data]);

  function getData(data: any): ChartData[] { 
    return Object.keys(data).map((status, index) => ({
      status,
      value: data[status],
      id: index.toString(), 
    }));
  }
  
  return (
    <div>
      <div className='flex h-80'>
        <AgChartsReact options={chartOptions} />

      </div>
      <div className='flex h-80'>
        <AgChartsReact options={chartOptions} />

      </div>
    </div>
  );
};

export default PieChart;

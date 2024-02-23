import { useState, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { AgChartsReact } from 'ag-charts-react';
import { AgPieSeriesOptions } from 'ag-charts-community';


// Chart Component
const PieChart = ({ data }: { data: any }) => {
  const [chartOptions, setChartOptions] = useState({
    data: [], // Initialize with empty data
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
      fills: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99'], // Colors for the pie chart segments
    } as AgPieSeriesOptions], 
  });

  useEffect(() => {
    // Process and set data only when `data` prop changes
    const processedData = getData(data);
    setChartOptions({ ...chartOptions, data: processedData });
  }, [data]);

  function getData(data: any) {
    return Object.keys(data).map((status, index) => ({
      status,
      value: data[status],
      id: index.toString(), // Unique identifier for each segment
    }));
  }
  
  

  return (
<div>
    <div className='flex h-80'>
      <AgChartsReact options={chartOptions} />
      <AgChartsReact options={chartOptions} />

    </div>
        <div className='flex h-80'>
        <AgChartsReact options={chartOptions} />
        <AgChartsReact options={chartOptions} />
  
      </div>
      </div>
  );
};

export default PieChart;

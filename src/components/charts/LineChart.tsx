import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartWrapper } from './ChartWrapper';
import { useChartResponsive } from '../../hooks/useChartResponsive';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface LineChartProps {
  title: string;
  subtitle?: string;
  labels: string[];
  data: number[];
  label?: string;
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
  className?: string;
}

export const LineChart: FC<LineChartProps> = ({
  title,
  subtitle,
  labels,
  data,
  label = '',
  borderColor = 'rgba(37, 99, 235, 1)',
  backgroundColor = 'rgba(37, 99, 235, 0.1)',
  fill = true,
  className,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useChartResponsive();

  // Show no data message if empty
  if (!labels.length || !data.length) {
    return (
      <ChartWrapper title={title} subtitle={subtitle} className={className}>
        <div className="h-48 sm:h-64 flex items-center justify-center">
          <p className="text-text/50 text-sm">{t('statistics.noData')}</p>
        </div>
      </ChartWrapper>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor,
        backgroundColor,
        fill,
        tension: 0.4,
        pointRadius: isMobile ? 3 : 4,
        pointHoverRadius: isMobile ? 5 : 6,
        pointBackgroundColor: borderColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 0,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
          font: { size: isMobile ? 9 : 11 },
          maxRotation: 45,
          maxTicksLimit: isMobile ? 6 : 12,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
          font: { size: isMobile ? 10 : 11 },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <ChartWrapper title={title} subtitle={subtitle} className={className}>
      <div className={isMobile ? 'h-48' : 'h-64'}>
        <Line data={chartData} options={options} redraw />
      </div>
    </ChartWrapper>
  );
};

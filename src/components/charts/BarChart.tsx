import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartWrapper } from './ChartWrapper';
import { useChartResponsive } from '../../hooks/useChartResponsive';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  title: string;
  subtitle?: string;
  labels: string[];
  data: number[];
  label?: string;
  backgroundColor?: string;
  horizontal?: boolean;
  className?: string;
}

export const BarChart: FC<BarChartProps> = ({
  title,
  subtitle,
  labels,
  data,
  label = '',
  backgroundColor = 'rgba(37, 99, 235, 0.8)',
  horizontal = false,
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
        backgroundColor,
        borderRadius: 6,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
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
          display: !horizontal,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
          font: { size: isMobile ? 10 : 11 },
        },
      },
      y: {
        grid: {
          display: horizontal,
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
        <Bar data={chartData} options={options} redraw />
      </div>
    </ChartWrapper>
  );
};

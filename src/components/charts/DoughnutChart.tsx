import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChartWrapper } from './ChartWrapper';
import { useChartResponsive } from '../../hooks/useChartResponsive';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  title: string;
  subtitle?: string;
  labels: string[];
  data: number[];
  centerText?: string;
  className?: string;
}

const COLORS = [
  'rgba(37, 99, 235, 0.8)', // Blue
  'rgba(16, 185, 129, 0.8)', // Green
  'rgba(245, 158, 11, 0.8)', // Amber
  'rgba(239, 68, 68, 0.8)', // Red
  'rgba(139, 92, 246, 0.8)', // Purple
];

export const DoughnutChart: FC<DoughnutChartProps> = ({ title, subtitle, labels, data, className }) => {
  const { t } = useTranslation();
  const { isMobile } = useChartResponsive();

  // Show no data message if empty
  if (!labels.length || !data.length) {
    return (
      <ChartWrapper title={title} subtitle={subtitle} className={className}>
        <div className="h-64 sm:h-72 flex items-center justify-center">
          <p className="text-text/50 text-sm">{t('statistics.noData')}</p>
        </div>
      </ChartWrapper>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: COLORS.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#ffffff',
        cutout: '60%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 0,
    plugins: {
      legend: {
        position: isMobile ? ('bottom' as const) : ('right' as const),
        labels: {
          padding: isMobile ? 12 : 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: isMobile ? 11 : 12 },
          color: 'rgba(0, 0, 0, 0.7)',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <ChartWrapper title={title} subtitle={subtitle} className={className}>
      <div className={isMobile ? 'h-72' : 'h-64'}>
        <Doughnut data={chartData} options={options} redraw />
      </div>
    </ChartWrapper>
  );
};

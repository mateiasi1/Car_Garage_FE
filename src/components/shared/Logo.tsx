import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import logo from '../../assets/logo.png';
import { CustomText } from './CustomText';
import { routes } from '../../constants/routes';

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export const Logo: FC<LogoProps> = ({ showText = true, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(routes.HOME);
  };

  return (
    <div className={clsx('flex items-center justify-center mb-8 cursor-pointer', className)} onClick={handleClick}>
      <img src={logo} alt="RoadReady Logo" className="h-14 w-14 mr-3" />

      {showText && (
        <CustomText variant="h3" color="primary">
          RoadReady
        </CustomText>
      )}
    </div>
  );
};

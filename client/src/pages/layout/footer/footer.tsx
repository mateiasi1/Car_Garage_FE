import { FC } from 'react';
import { brandName } from '../../../constants/constants';

const Footer: FC = () => {
    return (
        <footer className="bg-gray-900 fixed w-full bottom-0 text-white border-b border-gray-300 h-14 flex items-center justify-between">
            <div className="container mx-auto flex justify-center items-center">
                <p className="text-sm">© 2024 {brandName}. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
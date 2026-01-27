import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../../../components/customer/CustomerSidebar';

const CustomerLayout = () => {
  return (
    <div className="h-screen lg:min-h-screen w-full bg-page-gradient flex overflow-hidden lg:overflow-visible">
      <CustomerSidebar />

      <div className="flex-1 h-full lg:min-h-screen pb-20 md:pb-0 md:ml-16 flex flex-col">
        <main className="flex-1 overflow-y-auto lg:overflow-x-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;

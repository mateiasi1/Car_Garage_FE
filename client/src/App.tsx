import './App.css';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/authContext';
import { Provider } from 'react-redux';
import { customerStore } from './rtk/stores/customer-store';
import AppRouter from './AppRouter';

function App() {
  const { i18n: { language } } = useTranslation();

  return (
    <div className="App">
      <AuthProvider>
        <Provider store={customerStore}>
          <ToastContainer
               position="top-right"
               autoClose={5000}
               hideProgressBar={false}
               newestOnTop
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
               theme="light"
             />
          <AppRouter />
        </Provider>
      </AuthProvider>
    </div>
  );
}

export default App;

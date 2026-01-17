import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HelmetProvider } from 'react-helmet-async';
import AppRouter from './AppRouter';
import { AuthProvider } from './contexts/authContext';
import PageMessage from './components/shared/PageMessage';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
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
        <PageMessage />
        <AppRouter />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;

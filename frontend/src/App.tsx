import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Home, Signup, Login, PasswordReset, Product, Cart, Checkout, Orders } from 'pages';
import { Layout, ProtectedRoute } from 'components';

function App() {
  return (
    <Layout>
      <ToastContainer position='bottom-right' autoClose={3500} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products/:id' element={<Product />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/orders' element={<Orders />} />
        <Route
          path='/checkout'
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path='/password/reset/:uidb64/:token' element={<PasswordReset />} />
      </Routes>
    </Layout>
  );
}

export default App;

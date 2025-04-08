import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register' 
import SignLogin from '../pages/SignLogin';
import ForgotPassword from '../pages/ForgotPassword';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SignLogin />,
  },
  // {
  //   path: '/',
  //   element: <Home />,
  // },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <SignLogin />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]); 
import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register' 
import SignLogin from '../pages/SignLogin';

export const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <SignLogin />,
  // },
  {
    path: '/',
    element: <Register />,
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
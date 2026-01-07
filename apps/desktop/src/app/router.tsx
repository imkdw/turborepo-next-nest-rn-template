import { createHashRouter } from 'react-router';
import HomePage from './routes/home/page';
import AboutPage from './routes/about/page';

export const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
]);

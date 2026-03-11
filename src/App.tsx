import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ErrorDisplay from './components/Error';
import Login from './pages/Login'
import Register, {loader as registerLoader} from './pages/Register'


const router = createBrowserRouter([
  
  {path: '/',element:<Login/>},
  {
    path:'/auth/register',
    element:<Register/>,
    loader: registerLoader,
    errorElement: <ErrorDisplay/>
  },
  {
    path:'/auth/login',
    element:<Login/>
  }
])

function App() {

  return (
    <MantineProvider>
      <RouterProvider router={router}/>
    </MantineProvider>
  )
}

export default App

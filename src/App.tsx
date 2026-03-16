import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ErrorDisplay from './components/Error';
import AllCenter from './components/AllCenter';

import Login from './pages/LoginPage'
import Register from './pages/Register'
import MainPage from './pages/app/MainPage'
import WorkgroupPage, {loader as workgroupPageLoader} from './pages/WorkgroupPage'
import UserInfoPage from './pages/app/UserInfoPage';

import AppLayout, {loader as appLoader} from './components/AppLayout'
import AuthLayout from './components/AuthLayout';

import Error404 from './pages/Error404';
import OncologoPage, {loader as oncologoLoader} from './pages/app/OncologoPage'
import AnalystPage, {loader as analystLoader} from './pages/app/AnalystPage'
import CourierPage, {loader as courierLoader} from './pages/app/CourierPage'
import PatientsPage, {loader as patientsLoader} from './pages/app/PatientsPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout/>,
    loader: appLoader,
    errorElement: (
      <AllCenter>
          <ErrorDisplay
            width={300}
            iconSize={150} 
            textSize="lg" 
            text="Errore di comunicazione col server"/>
      </AllCenter>
    ),
    children:[
      {
        path:'/',
        element: <MainPage/>
      },
      {
        path:'/oncologo',
        element: <OncologoPage/>,
        loader: oncologoLoader,
        errorElement: (
          <AllCenter>
              <ErrorDisplay
                width={300}
                iconSize={150} 
                textSize="lg" 
                text="Errore di comunicazione col server"/>
          </AllCenter>
        )
      },
      {
        path:'/analyst',
        element: <AnalystPage/>,
        loader: analystLoader,
        errorElement: (
          <AllCenter>
              <ErrorDisplay
                width={300}
                iconSize={150} 
                textSize="lg" 
                text="Errore di comunicazione col server"/>
          </AllCenter>
        )
      },
      {
        path:'/courier',
        element: <CourierPage/>,
        loader: courierLoader,
        errorElement: (
          <AllCenter>
              <ErrorDisplay
                width={300}
                iconSize={150} 
                textSize="lg" 
                text="Errore di comunicazione col server"/>
          </AllCenter>
        )
      },
      {
        path:'/patient',
        element: <PatientsPage/>,
        loader: patientsLoader,
        errorElement: (
          <AllCenter>
              <ErrorDisplay
                width={300}
                iconSize={150} 
                textSize="lg" 
                text="Errore di comunicazione col server"/>
          </AllCenter>
        )
      },
      {
        path:'/user',
        element: <UserInfoPage/>
      }
    ],
  },
  {
    path:'auth',
    element: <AuthLayout/>,
    children:[
      {
        path:'',
        element:<Login/>
      },
      {
        path:'login',
        element:<Login/>
      },
      {
        path:'register',
        element:<Register/>
      }
    ]
  },
  {
    path:'user/setup',
    element: <WorkgroupPage/>,
    loader: workgroupPageLoader,
    errorElement: (
      <AllCenter>
          <ErrorDisplay 
            width={300}
            iconSize={150} 
            textSize="lg" 
            text="Errore di comunicazione col server"/>
      </AllCenter>)
  },
  {
    path:'*',
    element: <Error404/>
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

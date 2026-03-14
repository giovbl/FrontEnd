import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ErrorDisplay from './components/Error';
import AllCenter from './components/AllCenter';

import Login from './pages/Login'
import Register, {loader as registerLoader} from './pages/Register'

import AppLayout from './components/AppLayout'
import MainPage from './pages/MainPage';
import PatientsPage from './pages/PatientsPage';
import AuthLayout from './components/AuthLayout';
import Error404 from './pages/Error404';

/*
Only for test
import DataTable from './components/datatable/DataTable';
const patientData = [{fiscalCode:"RSSMRR2323DSD",name:"Mario",surname:"Rossi",phone:"666"},{fiscalCode:"BNCGLA7373HGD",name:"Giulia",surname:"Bianchi",phone:"333"}]
const sampOncData = [{id:1,status:'unanalyzed',referto:1,patient:"AABB32323CC",shipment:{status:"arrived", expectedTakenDate: new Date(),effectiveTakenDate: new Date(),expectedDeliveryDate:new Date(),effectiveDeliveryDate:new Date()},analystWorkgroup:{groupName:"Gruppo Analisi",facility:{nome:"Centro Analisi"}}}]
const sampAnData = [{id:1,status:'unanalyzed',referto:1,patient:"AABB32323CC",shipment:{status:"arrived", expectedTakenDate: new Date(),effectiveTakenDate: new Date(),expectedDeliveryDate:new Date(),effectiveDeliveryDate:new Date()},oncologiWorkgroup:{groupName:"Gruppo Analisi",facility:{nome:"Centro Analisi"}}}]
const shipData = [{id:1,sample:1,status:"received",sender:{cap:'00128',residenceCity:'Marigliano',residenceProvince:'Napoli',residenceRegion:'Campania',address:'Via A. Berni',civicNumber:6},recipient:{cap:'00128',residenceCity:'Marigliano',residenceProvince:'Napoli',residenceRegion:'Campania',address:'Via A. Berni',civicNumber:6}}]
*/


const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout/>,
    errorElement: (
      <AllCenter>
          <ErrorDisplay 
            width={300}
            iconSize={150} 
            textSize="lg" 
            text="Errore di comunicazine col server"/>
      </AllCenter>
    ),
    children:[
      {
        path:'/',
        element: <MainPage/>
      },
      {
        path:'/patient',
        element: <PatientsPage/>
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
        path:'login/workgroup',
        element: <MainPage/>
      },
      {
        path:'register',
        element:<Register/>,
        loader: registerLoader,
        errorElement: (
          <AllCenter>
              <ErrorDisplay 
                width={300}
                iconSize={150} 
                textSize="lg" 
                text="Errore di comunicazine col server"/>
          </AllCenter>)
      }
    ]
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

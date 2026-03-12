import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ErrorDisplay from './components/Error';
import AllCenter from './components/AllCenter';

import Login from './pages/Login'
import Register, {loader as registerLoader} from './pages/Register'

//Only for test
import DataTable from './components/datatable/DataTable';

//Only for test
const patientData = [{fiscalCode:"RSSMRR2323DSD",name:"Mario",surname:"Rossi",phone:"666"},{fiscalCode:"BNCGLA7373HGD",name:"Giulia",surname:"Bianchi",phone:"333"}]
const sampOncData = [{id:1,status:'unanalyzed',referto:1,patient:"AABB32323CC",shipment:{status:"arrived", expectedTakenDate: new Date(),effectiveTakenDate: new Date(),expectedDeliveryDate:new Date(),effectiveDeliveryDate:new Date()},analystWorkgroup:{groupName:"Gruppo Analisi",facility:{nome:"Centro Analisi"}}}]
const sampAnData = [{id:1,status:'unanalyzed',referto:1,patient:"AABB32323CC",shipment:{status:"arrived", expectedTakenDate: new Date(),effectiveTakenDate: new Date(),expectedDeliveryDate:new Date(),effectiveDeliveryDate:new Date()},oncologiWorkgroup:{groupName:"Gruppo Analisi",facility:{nome:"Centro Analisi"}}}]


const router = createBrowserRouter([
  
  {path: '/',element:<DataTable type="sampleAnalyst" data={sampAnData}/>},
  {
    path:'/auth/register',
    element:<Register/>,
    loader: registerLoader,
    errorElement: (
                    <AllCenter>
                        <ErrorDisplay 
                          iconSize={400} 
                          textSize="lg" 
                          text="Errore di comunicazine col server"/>
                    </AllCenter>
                  )
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

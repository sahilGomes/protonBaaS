import { createHashRouter,createRoutesFromElements,RouterProvider,Route} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Editorpage from "./pages/Editorpage";
import Settingspage from "./pages/Settingspage";
import Logspage from "./pages/Logspage";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Homepage/>}/>
      <Route path="login" element={<Loginpage/>}/>
      <Route path="editor" element={<Editorpage/>}/>
      <Route path="logs" element={<Logspage/>}/>
      <Route path="settings" element={<Settingspage/>}/>
    </Route>
  )
);

export default function App(){
  return <RouterProvider router={router} />
}
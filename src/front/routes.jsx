// Import necessary components and functions from react-router-dom.
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Navigate,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Register } from "./pages/Register";
import { RecoveryPassword } from "./pages/RecoveryPassword"
import { Pets } from "./pages/Pets"
import { AddPet } from "./pages/AddPet";
import { EditPet } from "./pages/EditPet";


import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<NotFound/>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path= "/" element={<Home />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/register" element={<Register/>} />
         <Route path="/login" element={<Login />} />
        <Route path="/recovery-password" element={<RecoveryPassword />} />
        <Route path="/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} /> 
        <Route path="/pets" element={<ProtectedRoute><Pets/></ProtectedRoute>} />
        <Route path="/edit-pet/:id" element={<EditPet />} />
        
      </Route>
    )
);
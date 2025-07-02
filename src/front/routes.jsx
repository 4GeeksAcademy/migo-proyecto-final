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
import Login from "./pages/Login";
import { RecoveryPassword } from "./pages/RecoveryPassword"
import { AddPet } from "./pages/AddPet";
import { PetDetail } from "./pages/PetDetail";
import { EditPet } from "./pages/EditPet";
import NotFound from "./pages/NotFound";
import { AddNote } from "./pages/AddNote";
import { EditNote } from "./pages/EditNote"

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Rutas públicas que NO usan Layout ni Navbar */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recovery-password" element={<RecoveryPassword />} />

      {/* Rutas con Layout */}
      <Route path="/" element={<Layout />} errorElement={<NotFound />}>
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/single/:theId" element={<ProtectedRoute><Single /></ProtectedRoute>} />
        <Route path="/demo" element={<ProtectedRoute><Demo /></ProtectedRoute>} />
        <Route path="/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} />
        <Route path="/pet-detail/:theId" element={<ProtectedRoute><PetDetail /></ProtectedRoute>} />
        <Route path="/edit-pet/:id" element={<ProtectedRoute><EditPet /></ProtectedRoute>} />
        <Route path="/add-note" element={<ProtectedRoute><AddNote /></ProtectedRoute>} />
        <Route path="/edit-note/:id" element={<ProtectedRoute><EditNote /></ProtectedRoute>} />
      </Route>
    </>
  )
);

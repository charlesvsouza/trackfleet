import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import { PrivateRoute } from "./PrivateRoute";

function Home() {
  return <h1>Dashboard</h1>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

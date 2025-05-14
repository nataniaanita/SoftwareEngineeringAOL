import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

import Generate from "./pages/Generate";

function App() {
  return (
   
    <BrowserRouter>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Generate />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadPage from "./pages/Upload";
// import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

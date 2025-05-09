import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import UploadPage from "./pages/Upload";
import Navbar from "./components/Navbar";
import { DatabasePage } from "./pages/Database";
import DetailPage from "./pages/Detail";
import { useParams } from "react-router-dom";


function App() {
  return (
   
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/database" element={<DatabasePage />}/>
        <Route path="/details/:type" element={<DetailPageWrapper />}/>
      </Routes>
    </BrowserRouter>
  );
}

function DetailPageWrapper(){
  const { type } = useParams<{type: string}>();
  return <DetailPage type={type || ""} />;
}

export default App;

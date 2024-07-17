import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Swiping from "./components/SwipingView";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Swiping />} />
        <Route path='/login' exact element={<Login email='asd@b.com' password='1Aa_12345' />} />
        <Route path='*' exact element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SwipingWrapper from "./components/SwipingWrapper";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<SwipingWrapper />} />
        <Route path='/login' exact element={<Login email='asd@b.com' password='1Aa_12345' />} />
        <Route path='/register' exact element={<Register />} />
        <Route path='*' exact element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

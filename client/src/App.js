import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import SwipingView from "./components/SwipingView";
import Login from "./components/Login";
import Register from "./components/Register";
import EditProfile from "./components/EditProfile";
import Chat from "./components/Chat";
import NavWrapper from "./components/NavWrapper";
import { useEffect, useState } from "react";
import getMatches from "./apiRequests/getMatches";
import Test from "./components/Test";

function App() {
  const [targetUserId, setTargetUserId] = useState("");

  const [matchedUsers, setMatchedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (targetUserId != "") {
      navigate("/chat");
    }
  }, [targetUserId]);

  return (
    <Routes>
      <Route path='/test' exact element={<Test />} />
      <Route
        path='/'
        exact
        element={
          <NavWrapper
            element={<SwipingView setMatchedUsers={setMatchedUsers} />}
            targetUserId={targetUserId}
            setTargetUserId={setTargetUserId}
            matchedUsers={matchedUsers}
            setMatchedUsers={setMatchedUsers}
          />
        }
      />
      <Route path='/login' exact element={<Login email='asd@b.com' password='1Aa_12345' />} />
      <Route path='/register' exact element={<Register />} />
      <Route
        path='/edit'
        exact
        element={
          <NavWrapper
            element={<EditProfile />}
            targetUserId={targetUserId}
            setTargetUserId={setTargetUserId}
            matchedUsers={matchedUsers}
            setMatchedUsers={setMatchedUsers}
          />
        }
      />
      <Route
        path='/chat'
        element={
          <NavWrapper
            element={<Chat targetUserId={targetUserId} />}
            targetUserId={targetUserId}
            setTargetUserId={setTargetUserId}
            matchedUsers={matchedUsers}
            setMatchedUsers={setMatchedUsers}
          />
        }
      />

      <Route path='*' exact element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default App;

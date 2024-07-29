import "./App.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import SwipingView from "./components/SwipingView";
import Login from "./components/Login";
import Register from "./components/Register";
import EditProfile from "./components/EditProfile";
import Chat from "./components/Chat";
import NavWrapper from "./components/NavWrapper";
import { useEffect, useState } from "react";

function App() {
  const [targetUserId, setTargetUserId] = useState("");
  const [matchedUsers, setMatchedUsers] = useState([]);
  const navigate = useNavigate();

  // this listens for changes in teagerUserId
  // and navigates to the chatpage if the id is not empty
  useEffect(() => {
    if (targetUserId != "") {
      navigate("/chat");
    }
  }, [targetUserId]);

  // most components are wrapped in NavWrapper which includes the navbar and sidenav
  // it also handles setting the targetUserId which controls which chat is shown if any
  // it also fetches matched users
  return (
    <Routes>
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
      <Route path='/login' exact element={<Login />} />
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

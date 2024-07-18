import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SwipingView from "./SwipingView";
import checkAuthentication from "../apiRequests/checkAuthentication";

function SwipingWrapper() {
  const navigate = useNavigate();
  useEffect(() => {
    checkAuthentication(localStorage.getItem("token")).then((isAuthenticated) => {
      if (!isAuthenticated) {
        navigate("/login");
      }
    });
  });
  return <SwipingView />;
}

export default SwipingWrapper;

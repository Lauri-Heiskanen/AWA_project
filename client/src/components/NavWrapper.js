import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkAuthentication from "../apiRequests/checkAuthentication";
import getMatches from "../apiRequests/getMatches";
import M from "materialize-css";

function NavWrapper({ element, targetUserId, setTargetUserId, matchedUsers, setMatchedUsers }) {
  const navigate = useNavigate();

  let matchRefreshInterval = () => {};

  const elemes = document.querySelectorAll(".sidenav");
  const instances = M.Sidenav.init(elemes, {});

  useEffect(() => {
    checkAuthentication(localStorage.getItem("token")).then((isAuthenticated) => {
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        getMatches(navigate).then((matches) => {
          setMatchedUsers(matches);
        });

        const matchRefreshTime = 5000; // time (ms) between matcehs are passively refreshed
        matchRefreshInterval = setInterval(() => {
          getMatches(navigate).then((matches) => {
            setMatchedUsers(matches);
          });
        }, matchRefreshTime);
      }

      // return a function to clear interval on unmount to prevent memory leak
      // from https://stackoverflow.com/a/67337887
      return () => clearInterval(matchRefreshInterval);
    });
  }, []);

  return (
    <>
      <nav></nav>
      <div className='chat-wrapper'>
        <div>
          <ul id='slide-out' className='sidenav sidenav-fixed'>
            {matchedUsers.map((m) => {
              return (
                <li>
                  <a
                    className='btn'
                    key={m.id}
                    onClick={(e) => {
                      setTargetUserId(m.id);
                    }}
                  >
                    {m.name}
                  </a>
                </li>
              );
            })}
          </ul>
          <a href='#' data-target='slide-out' className='sidenav-trigger'>
            <i className='material-icons'>menu</i>
          </a>
        </div>
        {element}
      </div>
    </>
  );
}

export default NavWrapper;

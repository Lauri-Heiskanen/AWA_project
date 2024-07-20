import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkAuthentication from "../apiRequests/checkAuthentication";
import getMatches from "../apiRequests/getMatches";
import M from "materialize-css";

function NavWrapper({ element, targetUserId, setTargetUserId, matchedUsers, setMatchedUsers }) {
  const navigate = useNavigate();

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
      }
    });
  }, []);

  return (
    <>
      <nav>
        <div className='nav-wrapper'>
          <a href='#' data-target='matches' className='sidenav-trigger left'>
            Matches
          </a>
          <ul className='right'>
            <li>
              <a href='/'>Main</a>
            </li>
            <li>
              <a href='/edit' className='right'>
                Edit
              </a>
            </li>
            <li>
              <a href='/login' className='right'>
                Log out
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className='chat-wrapper'>
        <div style={{ maxHeight: "75vh", overflowY: "scroll", overflowX: "clip" }}>
          <ul id='matches' className='sidenav sidenav-fixed'>
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
        </div>
        {element}
      </div>
    </>
  );
}

export default NavWrapper;

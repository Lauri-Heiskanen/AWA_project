import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkAuthentication from "../apiRequests/checkAuthentication";
import getMatches from "../apiRequests/getMatches";
import logout from "../apiRequests/logout";
import M from "materialize-css";

function NavWrapper({ element, targetUserId, setTargetUserId, matchedUsers, setMatchedUsers }) {
  // most components are wrapped in NavWrapper which includes the navbar and sidenav
  // it also handles setting the targetUserId which controls which chat is shown if any
  // it also fetches matched users

  const navigate = useNavigate();

  const elemes = document.querySelectorAll(".sidenav");
  const instances = M.Sidenav.init(elemes, {});

  useEffect(() => {
    checkAuthentication().then((isAuthenticated) => {
      if (isAuthenticated) {
        getMatches(navigate).then((matches) => {
          setMatchedUsers(matches);
        });
      } else {
        navigate("/login");
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
              <a
                className='right'
                onClick={() => {
                  logout(navigate);
                }}
              >
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getChat from "../apiRequests/getChat";
import sendMessage from "../apiRequests/sendMessage";

function Chat({ targetUserId }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  let messageRefreshInterval = () => {};

  useEffect(() => {
    const messageRefreshTime = 1000; // time (ms) between matcehs are passively refreshed

    getChat(targetUserId, navigate).then((res) => {
      setChatInfo({ name: res.name, targetUserId: res.targetUserId, chatId: res.chatId });
      setChatMessages(res.messages);
    });

    messageRefreshInterval = setInterval(() => {
      getChat(targetUserId, navigate).then((res) => {
        setChatInfo({ name: res.name, targetUserId: res.targetUserId, chatId: res.chatId });
        setChatMessages(res.messages);
      });
    }, messageRefreshTime);

    // return a function to clear interval on unmount to prevent memory leak
    // from https://stackoverflow.com/a/67337887
    return () => clearInterval(messageRefreshInterval);
  }, [targetUserId]);

  return (
    <>
      <div className='container'>
        <div>
          <div>{chatInfo.name}</div>
          <div id='messages-container' style={{ maxHeight: "75vh", overflowY: "scroll", overflowX: "clip" }}>
            {chatMessages.map((m) => MessageElement({ text: m.text, sentBySeld: m.sender != targetUserId }))}
          </div>
          <div className='row'>
            <div className=' col s10'>
              <textarea
                className='materialize-textarea'
                placeholder='Send a message...'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              ></textarea>
            </div>
            <div className='col s2'>
              <button
                className='btn'
                onClick={() => {
                  sendMessage(chatInfo.chatId, newMessage, navigate).then((res) => {
                    setNewMessage("");
                    getChat(targetUserId, navigate).then((res) => {
                      setChatInfo({ name: res.name, targetUserId: res.targetUserId, chatId: res.chatId });
                      setChatMessages(res.messages);
                    });
                  });
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MessageElement({ text, sentBySeld }) {
  return (
    <>
      <p
        style={{
          textAlign: sentBySeld ? "right" : "left",
          margin: sentBySeld ? "10px 0px 10px 15vw" : "10px 15vw 10px 0px",
          padding: "5px",
          wordWrap: "break-word",
        }}
      >
        {text}
      </p>
    </>
  );
}

export default Chat;

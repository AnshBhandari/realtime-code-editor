import React, { useState, useRef, useEffect } from "react";
import User from "../Components/User.jsx";
import Editor from "../Components/Editor.jsx";
import { initSocket } from "../socket.js";
import { ACTIONS } from "../Actions.js";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigate = useNavigate();
  const { roomId } = useParams();
  const codeRef = useRef(null);

  const [users, setUsers] = useState([]);

  function handleLeaveButton() {
    reactNavigate("/");
  }

  function handleCopyButton() {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        toast.dismiss();
        toast.success("Room ID copied to clipboard!");
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Failed to copy Room ID.");
      });
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => {
        // console.error("Socket connection error:", err);
        handleErrors(err);
      });
      socketRef.current.on("connect_failed", (err) => {
        // console.error("Socket connection failed:", err);
        handleErrors(err);
      });

      function handleErrors(e) {
        console.error("Socket connection failed:", e);
        toast.error("Socket connection failed, please try again later.");
        reactNavigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ users, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.dismiss();
          toast.success(`${username} joined the room.`);
        }
        setUsers(users);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.socketId !== socketId),
        );
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, [roomId, location.state, reactNavigate]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            {/* <img src="/CodeZ.png" alt="CodeZ" /> */}
            <h1 style={{ color: "#fff", fontFamily: "cursive" }}>CodeZ</h1>
          </div>
          <h3>Connected</h3>
          <div className="usersList">
            {users.map((user) => (
              <User username={user.username} key={user.socketId} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={handleCopyButton}>
          Copy Room ID
        </button>
        <button className="btn leaveBtn" onClick={handleLeaveButton}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;

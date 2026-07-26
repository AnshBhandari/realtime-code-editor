import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = async (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    console.log(id);
    try {
      await navigator.clipboard.writeText(id);
      toast.dismiss();
      toast.success("Room ID copied to clipboard!");
      toast.success("Created a new room");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to copy Room ID");
      console.error(err);
    }
    // toast.success(`Room ID: ${id}`, {
    //   id: "create-room-toast", // 👈 prevents duplicates
    // });
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.dismiss();
      toast.error("Room ID & username is required");
      return;
    }
    // localStorage.setItem("username", username);
    // localStorage.setItem("roomId", roomId);
    navigate(`/editor/${roomId}`, {
      state: {
        username,
        roomId,
      },
    });
  };

  function handleInputEnter(e) {
    if (e.code === "Enter") {
      joinRoom();
    }
  }

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
          className="homePageLogo"
          src="/code-sync.png"
          alt="code-sync-logo"
        />
        <h4 className="mainLabel">Paste invitation Room ID</h4>
        <div className="inputGroup">
          {/* <label htmlFor="roomId" className="label">
            Room ID
          </label> */}
          <input
            type="text"
            name="roomId"
            id="roomId"
            className="inputBox"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          {/* <label htmlFor="username" className="username">
            Username
            </label> */}
          <input
            type="text"
            name="username"
            id="username"
            className="inputBox"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <button
            className="btn joinBtn"
            // disabled={!roomId || !username}
            onClick={joinRoom}
          >
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite then create one &nbsp;
            <a onClick={createNewRoom} href="">
              <span className="createNewBtn">new room</span>
            </a>
          </span>
        </div>
      </div>

      <footer>
        <p>&copy; 2026 Code Sync. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

import React from "react";
import Avatar from "react-avatar";

const User = (props) => {
  return (
    <div className="user">
      <Avatar name={props.username} size={50} round="14px" />
      <span>{props.username}</span>
    </div>
  );
};

export default User;

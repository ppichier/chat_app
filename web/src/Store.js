import React from "react";
import io from "socket.io-client";

export const CTX = React.createContext();

const initialState = {
  general: [
    /* { from: "aarom", msg: "hello" },
    { from: "arnold", msg: "hello" },
    { from: "ppichier", msg: "hello" } */
  ],
  finance: [
    /* { from: "aarom", msg: "hello" },
    { from: "aarom", msg: "hello" },
    { from: "aarom", msg: "hello" } */
  ],
  dev: [
    /* { from: "aarom", msg: "hello" },
    { from: "aarom", msg: "hello" },
    { from: "aarom", msg: "hello" } */
  ]
};

function reducer(state, action) {
  const { from, msg, topic } = action.payload;
  switch (action.type) {
    case "RECEIVE_MESSAGE":
      return {
        ...state,
        [topic]: [
          ...state[topic],
          {
            from,
            msg
          }
        ]
      };
    default:
      return state;
  }
}

let socket;
function sendChatAction(value) {
  socket.emit("chat message", value);
}
let user = null;

export default function Store(props) {
  const [allChats, dispatch] = React.useReducer(reducer, initialState);
  if (!socket) {
    console.log("SOCKER INIT");
    user = "aaron" + Math.floor(Math.random() * 100);
    socket = io(":3001");
    socket.on("chat message", function(msg) {
      dispatch({ type: "RECEIVE_MESSAGE", payload: msg });
    });
  }

  return (
    <CTX.Provider value={{ allChats, sendChatAction, user }}>
      {props.children}
    </CTX.Provider>
  );
}

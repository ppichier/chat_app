import React, { useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

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
  switch (action.type) {
    case "RECEIVE_MESSAGE":
      const { from, msg, topic } = action.payload;
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
    case "LOAD_DB_MESSAGES_GENERAL":
      let general_messages = action.payload.filter(
        data => data.topic === "general"
      );
      let finance_messages = action.payload.filter(
        data => data.topic === "finance"
      );
      let dev_messages = action.payload.filter(data => data.topic === "dev");
      return {
        general: [...state["general"], ...general_messages],
        finance: [...state["finance"], ...finance_messages],
        dev: [...state["dev"], ...dev_messages]
      };
    default:
      return state;
  }
}

let socket;
function sendChatAction(value) {
  axios
    .post("http://localhost:3001/messages", value)
    .then(res => console.log(res))
    .catch(err => console.error(err));
  socket.emit("chat message", value);
}
let user = null;

export default function Store(props) {
  const [allChats, dispatch] = React.useReducer(reducer, initialState);

  useEffect(() => {
    axios
      .get("http://localhost:3001/messages")
      .then(res => {
        dispatch({ type: "LOAD_DB_MESSAGES_GENERAL", payload: res.data });
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
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

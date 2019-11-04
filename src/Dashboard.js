import React, { useState, useContext } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CTX } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
    margin: "50px",
    padding: theme.spacing(3, 2)
  },
  flex: {
    display: "flex",
    alignItems: "center"
  },
  topicsWindow: {
    width: "30%",
    height: "300px",
    borderRight: "1px solid grey"
  },
  chatWindow: { width: "70%", height: "300px", padding: "20px" },
  chatBox: { width: "85%" },
  button: { width: "15%" }
}));

export default function Dashboard() {
  const classes = useStyles();

  //CTX store
  const { allChats, sendChatAction, user } = useContext(CTX);
  const topics = Object.keys(allChats);

  // local state
  const [activeTopic, setActiveTopic] = useState(topics[0]);
  const [textValue, setTextValue] = useState("");

  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h4" component="h4">
          Chat App
        </Typography>
        <Typography variant="h5" component="h5">
          {activeTopic}
        </Typography>
        <div className={classes.flex}>
          <div className={classes.topicsWindow}>
            <List>
              {topics.map((topic, i) => (
                <ListItem
                  key={i}
                  button
                  onClick={e => {
                    setActiveTopic(e.target.innerText);
                  }}
                >
                  <ListItemText primary={topic} />
                </ListItem>
              ))}
            </List>
          </div>
          <div className={classes.chatWindow}>
            {allChats[activeTopic].map((chat, i) => (
              <div className={classes.flex} key={i}>
                <Chip label={chat.from} />
                <Typography variant="subtitle1">{chat.msg}</Typography>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.flex}>
          <TextField
            label="Send a chat"
            className={classes.chatBox}
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              sendChatAction({
                from: user,
                msg: textValue,
                topic: activeTopic
              });
              setTextValue("");
            }}
          >
            Send
          </Button>
        </div>
      </Paper>
    </div>
  );
}

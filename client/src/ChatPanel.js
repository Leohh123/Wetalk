import React from "react";

import LetterAvatar from "./LetterAvater";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

class Message extends React.Component {
    render() {
        return (
            <Box>
                <ListItem>
                    <ListItemAvatar>
                        <LetterAvatar name={this.props.name} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={this.props.name}
                        secondary={this.props.time}
                    />
                </ListItem>
                <Typography variant="body1" gutterBottom sx={{ ml: 2 }}>
                    {this.props.content}
                </Typography>
            </Box>
        );
    }
}

class MessagePanel extends React.Component {
    render() {
        return (
            <Box
                sx={{ p: 1 }}
                style={{
                    height: "calc(100% - 88px)",
                }}
            >
                <Paper
                    style={{
                        height: "100%",
                        maxHeight: "100%",
                        overflowY: "scroll",
                    }}
                    variant="outlined"
                >
                    <Stack sx={{ p: 1 }} spacing={2}>
                        {this.props.messages.map(
                            ({ uid, timestamp, content }) => (
                                <Message
                                    name={uid}
                                    time={new Date(timestamp).toLocaleString()}
                                    content={content}
                                />
                            )
                        )}
                    </Stack>
                </Paper>
            </Box>
        );
    }
}

class InputPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
        };
    }

    render() {
        return (
            <Box sx={{ p: 1 }}>
                <Grid container spacing={1} sx={{ height: 1 }}>
                    <Grid item xs={9}>
                        <TextField
                            fullWidth
                            label="我想说..."
                            value={this.state.text}
                            onChange={(ev) =>
                                this.setState({ text: ev.target.value })
                            }
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            endIcon={<SendIcon />}
                            sx={{ height: "56px" }}
                            onClick={() => this.props.onSend(this.state.text)}
                        >
                            发送
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

class ChatPanel extends React.Component {
    // componentDidMount() {
    //     this.whileID = setInterval(() => {
    //         console.log("toFriend", this.props.toFriend);
    //     }, 5000);
    // }

    // componentWillUnmount() {
    //     clearInterval(this.whileID);
    // }

    handleSend(text) {
        if (this.props.toFriend === true) {
            this.handleSendToFriend(text);
        } else if (this.props.toFriend === false) {
            this.handleSendToRoom(text);
        }
    }

    async handleSendToFriend(text) {
        try {
            let { code, data } = await window.wetalkAPI.messageToFriend(
                this.props.currentId,
                text
            );
            if (code !== 0) {
                window.wetalkAPI.dialog(data);
            }
            console.log("handleSendToFriend", code, data);
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    async handleSendToRoom(text) {
        try {
            let { code, data } = await window.wetalkAPI.messageToRoom(
                this.props.currentId,
                text
            );
            if (code !== 0) {
                window.wetalkAPI.dialog(data);
            }
            console.log("handleSendToRoom", code, data);
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    render() {
        return (
            <Box sx={{ height: 1 }}>
                <MessagePanel messages={this.props.messages} />
                <InputPanel onSend={(text) => this.handleSend(text)} />
            </Box>
        );
    }
}

export default ChatPanel;

import ContactList from "./ContactList";
import ChatPanel from "./ChatPanel";
import React from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            rooms: [],
            messageDict: {
                r: [
                    {
                        uid: "UID",
                        timestamp: new Date().getTime(),
                        content: "hahaha",
                    },
                ],
            }, // FIX: uid can't equals to any rid
            toFriend: null,
            currentId: null,
        };
    }

    get showMessage() {
        if (!this.state.messageDict[this.state.currentId]) {
            return [];
        }
        return this.state.messageDict[this.state.currentId];
    }

    componentDidMount() {
        this.loadData();
        this.whileID = setInterval(() => {
            console.log(this.state);
        }, 3000);
        // console.log(window.wetalkAPI.onMessageFromFriend);
        window.wetalkAPI.onMessageFromFriend(
            (ev, { uid, timestamp, content, id }) =>
                this.pushMessage(id, { uid, timestamp, content })
        );
        window.wetalkAPI.onMessageFromRoom(
            (ev, { uid, timestamp, content, id }) =>
                this.pushMessage(id, { uid, timestamp, content })
        );
        // window.wetalkAPI.onMessageFromFriend((...args) => console.log(1, args));
        // window.wetalkAPI.onMessageFromFriend((...args) =>
        //     console.log(22, args)
        // );
        // window.wetalkAPI.onMessageFromFriend((...args) =>
        //     console.log(3333, args)
        // );
        // window.wetalkAPI.onMessageFromRoom((...args) => console.log(1, args));
        // window.wetalkAPI.onMessageFromRoom((...args) => console.log(22, args));
        // window.wetalkAPI.onMessageFromRoom((...args) =>
        //     console.log(3333, args)
        // );
    }

    pushMessage(id, msg) {
        let newList = [...this.getMessageListOf(id), msg];
        let newDict = { ...this.state.messageDict };
        newDict[id] = newList;
        console.log("pushMessage", id, msg, newDict);
        this.setState({ messageDict: newDict });
    }

    componentWillUnmount() {
        clearInterval(this.whileID);
    }

    loadData() {
        (async () => {
            try {
                let { code, data } = await window.wetalkAPI.getFriendList();
                console.log(data);
                if (code === 0) {
                    this.setState({ friends: data });
                }
            } catch (e) {
                window.wetalkAPI.dialog(e);
            }
        })();
        (async () => {
            try {
                let { code, data } = await window.wetalkAPI.getRoomList();
                console.log(data);
                if (code === 0) {
                    this.setState({ rooms: data });
                }
            } catch (e) {
                window.wetalkAPI.dialog(e);
            }
        })();
    }

    getMessageListOf(id) {
        // console.log("getMessageListOf", id);
        if (!this.state.messageDict[id]) {
            // console.log("enter if");
            let newDict = { ...this.state.messageDict };
            newDict[id] = [];
            // console.log("newDict", newDict);
            this.setState({ messageDict: newDict });
            return [];
        }
        return this.state.messageDict[id];
    }

    handleClick(id, toFriend) {
        // console.log("handleClick", id, toFriend, this.getMessageListOf);
        // console.log("msgList", msgList);
        this.setState({
            toFriend,
            currentId: id,
        });
    }

    render() {
        return (
            <Grid container sx={{ height: "100%" }}>
                <Grid item xs={4} sx={{ height: "100%" }}>
                    <ContactList
                        friends={this.state.friends}
                        rooms={this.state.rooms}
                        onClickFriend={(id) => this.handleClick(id, true)}
                        onClickRoom={(id) => this.handleClick(id, false)}
                    />
                </Grid>
                <Divider
                    orientation="vertical"
                    flexItem
                    style={{ marginRight: "-1px" }}
                />
                <Grid item xs={8} sx={{ height: "100%" }}>
                    <ChatPanel
                        messages={this.showMessage}
                        toFriend={this.state.toFriend}
                        currentId={this.state.currentId}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default Home;

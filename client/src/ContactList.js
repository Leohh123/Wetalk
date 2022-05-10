import React from "react";

import LetterAvatar from "./LetterAvater";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";

import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import GroupsIcon from "@mui/icons-material/Groups";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

class NestedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
    }

    handleClick() {
        this.setState({ open: !this.state.open });
    }

    render() {
        return (
            <>
                <ListItemButton onClick={() => this.handleClick()}>
                    <ListItemIcon>{this.props.icon}</ListItemIcon>
                    <ListItemText primary={this.props.primary} />
                    {this.state.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {this.props.children}
                    </List>
                </Collapse>
            </>
        );
    }
}

class ContactItem extends React.Component {
    render() {
        return (
            <ListItemButton sx={{ pl: 4 }} onClick={this.props.onClick}>
                <ListItemAvatar>
                    <LetterAvatar name={this.props.name} />
                </ListItemAvatar>
                <ListItemText primary={this.props.name} />
            </ListItemButton>
        );
    }
}

class ContactList extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <List
                sx={{ width: "100%" }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                <NestedList
                    name="friends"
                    primary="好友"
                    icon={<PermContactCalendarIcon />}
                >
                    {this.props.friends &&
                        this.props.friends.map((friendId) => (
                            <ContactItem
                                key={friendId}
                                name={friendId}
                                onClick={() =>
                                    this.props.onClickFriend(friendId)
                                }
                            />
                        ))}
                </NestedList>
                <NestedList name="rooms" primary="房间" icon={<GroupsIcon />}>
                    {this.props.rooms &&
                        this.props.rooms.map(({ rid, own }) => (
                            <ContactItem
                                key={rid}
                                name={rid}
                                onClick={() => this.props.onClickRoom(rid)}
                            />
                        ))}
                </NestedList>
            </List>
        );
    }
}

export default ContactList;

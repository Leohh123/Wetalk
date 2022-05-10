import React from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteIcon from "@mui/icons-material/Delete";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

class FriendPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friendId: "",
        };
    }

    async handleAddFriend() {
        try {
            let { code, data } = await window.wetalkAPI.addFriend(
                this.state.friendId
            );
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                window.location.reload();
            }
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    async handleAcceptFriend(uid) {
        try {
            let { code, data } = await window.wetalkAPI.acceptFriend(uid);
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                window.location.reload();
            }
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    async handleRejectFriend(uid) {
        try {
            let { code, data } = await window.wetalkAPI.rejectFriend(uid);
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                window.location.reload();
            }
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    async handleDeleteFriend(uid) {
        try {
            let { code, data } = await window.wetalkAPI.deleteFriend(uid);
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                window.location.reload();
            }
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    renderForm() {
        return (
            <Paper sx={{ p: 2 }}>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    alignItems="top"
                    justifyContent="center"
                >
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="好友用户名"
                            value={this.state.friendId}
                            onChange={(ev) =>
                                this.setState({ friendId: ev.target.value })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ height: "56px" }}
                            onClick={() => this.handleAddFriend()}
                        >
                            添加好友
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    renderReqTable() {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>申请人</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.friendReqs.map((uid) => (
                            <TableRow
                                key={uid}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {uid}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        aria-label="accept-friend"
                                        onClick={() =>
                                            this.handleAcceptFriend(uid)
                                        }
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="reject-friend"
                                        onClick={() =>
                                            this.handleRejectFriend(uid)
                                        }
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    renderFriendTable() {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>已添加的好友</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.friends.map((uid) => (
                            <TableRow
                                key={uid}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {uid}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        aria-label="delete-friend"
                                        onClick={() =>
                                            this.handleDeleteFriend(uid)
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    render() {
        return (
            <Stack p={2} xs={12} md={12} spacing={2}>
                {this.renderForm()}
                {this.renderReqTable()}
                {this.renderFriendTable()}
            </Stack>
        );
    }
}

class RoomPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rid: "",
        };
    }

    async handleJoinRoom() {
        try {
            let { code, data } = await window.wetalkAPI.joinRoom(
                this.state.rid
            );
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                window.location.reload();
            }
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    async handleCreateRoom() {
        try {
            let { code, data } = await window.wetalkAPI.createRoom(
                this.state.rid
            );
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                window.location.reload();
            }
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    async handleAcceptRoommate(uid, rid) {
        try {
            let { code, data } = await window.wetalkAPI.acceptRoommate(
                uid,
                rid
            );
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                window.location.reload();
            }
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    async handleRejectRoommate(uid, rid) {
        try {
            let { code, data } = await window.wetalkAPI.rejectRoommate(
                uid,
                rid
            );
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                window.location.reload();
            }
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    async handleLeaveRoom(rid) {
        try {
            let { code, data } = await window.wetalkAPI.leaveRoom(rid);
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                window.location.reload();
            }
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    async handleDeleteRoom(rid) {
        try {
            let { code, data } = await window.wetalkAPI.deleteRoom(rid);
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                window.location.reload();
            }
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    renderForm() {
        return (
            <Paper sx={{ p: 2 }}>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    alignItems="top"
                    justifyContent="center"
                >
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="房间号"
                            value={this.state.rid}
                            onChange={(ev) =>
                                this.setState({ rid: ev.target.value })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ height: "56px" }}
                            onClick={() => this.handleJoinRoom()}
                        >
                            加入房间
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            size="large"
                            sx={{ height: "56px" }}
                            onClick={() => this.handleCreateRoom()}
                        >
                            创建房间
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    renderTable() {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>申请人</TableCell>
                            <TableCell>房间号</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.roomReqs.map(({ uid, rid }) => (
                            <TableRow
                                key={uid}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {uid}
                                </TableCell>
                                <TableCell>{rid}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        aria-label="accept-roommate"
                                        onClick={() =>
                                            this.handleAcceptRoommate(uid, rid)
                                        }
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="reject-roommate"
                                        onClick={() =>
                                            this.handleRejectRoommate(uid, rid)
                                        }
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    renderRoomTable() {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>已加入的房间</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.rooms.map(({ rid, own }) => (
                            <TableRow
                                key={rid}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell>{rid}</TableCell>
                                <TableCell align="right">
                                    {own ? (
                                        <IconButton
                                            aria-label="delete-room"
                                            onClick={() =>
                                                this.handleDeleteRoom(rid)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            aria-label="leave-room"
                                            onClick={() =>
                                                this.handleLeaveRoom(rid)
                                            }
                                        >
                                            <ExitToAppIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    render() {
        return (
            <Stack p={2} xs={12} md={12} spacing={2}>
                {this.renderForm()}
                {this.renderTable()}
                {this.renderRoomTable()}
            </Stack>
        );
    }
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: ["jy", "bugui"],
            rooms: [
                { rid: "room1", own: false },
                { rid: "room2", own: true },
                { rid: "room3", own: false },
            ],
            friendReqs: ["Leohh", "yyxzhj"],
            roomReqs: [
                { uid: "Leohh", rid: "ROOM1" },
                { uid: "yyszhj", rid: "ROOM2" },
            ],
            friendId: "",
            rid: "",
            tabValue: 0,
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        (async () => {
            try {
                let { code, data } = await window.wetalkAPI.getFriendList();
                if (code === 0) {
                    this.setState({ friends: data });
                }
            } catch (e) {
                window.wetalkAPI.dialog(e);
            }
        })();
        (async () => {
            try {
                let { code, data } = await window.wetalkAPI.getFriendReqList();
                if (code === 0) {
                    this.setState({ friendReqs: data });
                }
            } catch (e) {
                window.wetalkAPI.dialog(e);
            }
        })();
        (async () => {
            try {
                let { code, data } = await window.wetalkAPI.getRoomList();
                if (code === 0) {
                    this.setState({ rooms: data });
                }
            } catch (e) {
                window.wetalkAPI.dialog(e);
            }
        })();
        (async () => {
            try {
                let { code, data } = await window.wetalkAPI.getRoomReqList();
                if (code === 0) {
                    this.setState({ roomReqs: data });
                }
            } catch (e) {
                window.wetalkAPI.dialog(e);
            }
        })();
    }

    render() {
        return (
            <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                        value={this.state.tabValue}
                        onChange={(event, newValue) =>
                            this.setState({ tabValue: newValue })
                        }
                        aria-label="basic tabs example"
                        variant="fullWidth"
                    >
                        <Tab label="好友管理" {...a11yProps(0)} />
                        <Tab label="房间管理" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={this.state.tabValue} index={0}>
                    <FriendPanel
                        friends={this.state.friends}
                        friendReqs={this.state.friendReqs}
                    />
                </TabPanel>
                <TabPanel value={this.state.tabValue} index={1}>
                    <RoomPanel
                        rooms={this.state.rooms}
                        roomReqs={this.state.roomReqs}
                    />
                </TabPanel>
            </Box>
        );
    }
}

export default Dashboard;

import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ForumIcon from "@mui/icons-material/Forum";
import LetterAvatar from "./LetterAvater";

const pages = [
    { label: "Home", to: "/" },
    { label: "Dashboard", to: "/dashboard" },
];
const settings = [
    // { label: "Profile", to: "/profile" },
    // { label: "Logout", to: "/logout" },
];

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorElNav: null,
            anchorElUser: null,
        };
    }

    setAnchorElNav(value) {
        this.setState({ anchorElNav: value });
    }

    setAnchorElUser(value) {
        this.setState({ anchorElUser: value });
    }

    async handleLogout() {
        console.log("handleLogout");
        try {
            let { code, data } = await window.wetalkAPI.logout();
            window.wetalkAPI.dialog(data);
            if (code === 0) {
                this.props.onLogout();
            }
            this.props.navigate("/login");
        } catch (e) {
            window.wetalkAPI.dialog(e);
        }
    }

    render() {
        const handleOpenNavMenu = (event) => {
            console.log("handleOpenNavMenu");
            this.setAnchorElNav(event.currentTarget);
        };
        const handleOpenUserMenu = (event) => {
            console.log("handleOpenUserMenu");
            this.setAnchorElUser(event.currentTarget);
        };

        const handleCloseNavMenu = () => {
            console.log("handleCloseNavMenu");
            this.setAnchorElNav(null);
        };

        const handleCloseUserMenu = () => {
            console.log("handleCloseUserMenu");
            this.setAnchorElUser(null);
        };

        return (
            <AppBar position="static" sx={{ height: 70, maxHeight: 70 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* MD LOGO */}
                        <ForumIcon
                            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                        />
                        {/* MD WETALK */}
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            // href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                // fontFamily: "monospace",
                                fontWeight: 700,
                                // letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Wetalk
                        </Typography>
                        {/* MD ITEMS */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            {this.props.uid !== null &&
                                pages.map(({ label, to }) => (
                                    <Button
                                        key={label}
                                        onClick={handleCloseNavMenu}
                                        sx={{
                                            my: 2,
                                            color: "white",
                                            display: "block",
                                        }}
                                        component={Link}
                                        to={to}
                                    >
                                        {label}
                                    </Button>
                                ))}
                        </Box>

                        {/* XS MENU ICON */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            {this.props.uid !== null && (
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={this.state.anchorElNav}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                    open={Boolean(this.state.anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: "block", md: "none" },
                                    }}
                                >
                                    {pages.map(({ label, to }) => (
                                        <MenuItem
                                            key={label}
                                            onClick={handleCloseNavMenu}
                                            component={Link}
                                            to={to}
                                        >
                                            <Typography textAlign="center">
                                                {label}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            )}
                        </Box>
                        {/* XS LOGO */}
                        <ForumIcon
                            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                        />
                        {/* XS WETALK */}
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            // href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                // fontFamily: "monospace",
                                fontWeight: 700,
                                // letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Wetalk
                        </Typography>

                        {/* MD & XS AVATAR */}
                        {this.props.uid !== null ? (
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <LetterAvatar name={this.props.uid} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={this.state.anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(this.state.anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map(({ label, to }) => (
                                        <MenuItem
                                            key={label}
                                            onClick={() => handleCloseUserMenu}
                                            component={Link}
                                            to={to}
                                        >
                                            <Typography textAlign="center">
                                                {label}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                    <MenuItem
                                        key="Logout"
                                        onClick={() => {
                                            handleCloseUserMenu();
                                            this.handleLogout();
                                        }}
                                    >
                                        <Typography textAlign="center">
                                            注销
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            <Button
                                key="Login"
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                }}
                                component={Link}
                                to="/login"
                            >
                                登录
                            </Button>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
        );
    }
}
export default NavBar;

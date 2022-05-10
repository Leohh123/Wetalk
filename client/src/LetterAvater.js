import React from "react";
import Avatar from "@mui/material/Avatar";

class LetterAvatar extends React.Component {
    stringToColor() {
        if (!this.props.name) {
            return "#BDBDBD";
        }
        let hash = 0;
        for (let i = 0; i < this.props.name.length; i++) {
            hash = this.props.name.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = "#";
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }

    render() {
        return (
            <Avatar
                sx={{
                    bgcolor: this.stringToColor(),
                }}
            >
                {this.props.name && this.props.name[0]}
            </Avatar>
        );
    }
}

export default LetterAvatar;

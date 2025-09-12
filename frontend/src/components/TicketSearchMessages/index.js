import React, { useContext, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Drawer, IconButton, InputBase, Paper } from "@material-ui/core";
import { Close } from "@material-ui/icons";

// import { i18n } from "../../translate/i18n";
// import api from "../../services/api";
// import TicketOptionsMenu from "../TicketOptionsMenu";
// import ButtonWithSpinner from "../ButtonWithSpinner";
// import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const drawerWidth = 320;

const useStyles = makeStyles(theme => ({
	header: {
		display: "flex",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		backgroundColor: "#eee",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		minHeight: "73px",
		justifyContent: "flex-center",
		paddingTop: '49px'
	},
	drawerPaper: {
		width: drawerWidth,
		display: "flex",
		borderTop: "1px solid rgba(0, 0, 0, 0.12)",
		borderRight: "1px solid rgba(0, 0, 0, 0.12)",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		borderTopRightRadius: 4,
		borderBottomRightRadius: 4,
	},
	content: {
		display: "flex",
		backgroundColor: "#eee",
		flexDirection: "column",
		padding: "8px 0px 8px 8px",
		height: "100%",
		overflowY: "scroll",
		...theme.scrollbarStyles,
	},
	searchInput: {
		background: "#fff",
		border: "1px solid rgba(0, 0, 0, 0.12)",
		padding: "4px 17px",
		flexGrow: 1,
		borderRadius: "5px"
	},
	searchInputOnFocus: {
		background: "#eee",
		border: "1px solid rgba(0, 0, 0, 1)",
		padding: "4px 17px",
		flexGrow: 1,
		borderRadius: "5px"
	},
	drawerOpened: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerClosed: {
		width: 0,
		flexShrink: 0,
	}
}));

const TicketSearchMessages = ({ ticket, open, handleSearchClose }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [searchInputIsOnFocus, setSearchInputIsOnFocus] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [finalSearchQuery, setFinalSearchQuery] = useState("");
	const [currentTimeoutId, setCurrentTimeoutId] = useState();
	const { user } = useContext(AuthContext);

	useEffect(() =>{
		const timeoutId = setTimeout(() => {
			if (searchQuery !== "")
				setFinalSearchQuery(searchQuery)
			else if (searchQuery === "" && finalSearchQuery !== "")
				setFinalSearchQuery("")
		}, 900, [])
		setCurrentTimeoutId(timeoutId)
	}, [searchQuery])

	return (
		<Drawer
			className={ open ? classes.drawerOpened : classes.drawerClosed }
			variant="persistent"
			anchor="right"
			open={open}
			classes={{
				paper: classes.drawerPaper,
			}}
		>
			<div className={classes.header}>
				<IconButton onClick={handleSearchClose}>
					<Close />
				</IconButton>
				<InputBase
					className={searchInputIsOnFocus ? classes.searchInputOnFocus : classes.searchInput}
					placeholder={searchInputIsOnFocus ? "" : "Buscar"}
					onFocus={() => setSearchInputIsOnFocus((previousValue) => !previousValue)}
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
						if (currentTimeoutId)
							clearTimeout(currentTimeoutId)
					}}
				/>
			</div>
			<p>Valor Final: {finalSearchQuery}</p>
		</Drawer>
	);
};

export default TicketSearchMessages;

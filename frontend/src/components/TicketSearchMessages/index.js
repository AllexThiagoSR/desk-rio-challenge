import React, { useContext, useState } from "react";
// import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Drawer, IconButton, Paper } from "@material-ui/core";
import { Close } from "@material-ui/icons";

// import { i18n } from "../../translate/i18n";
// import api from "../../services/api";
// import TicketOptionsMenu from "../TicketOptionsMenu";
// import ButtonWithSpinner from "../ButtonWithSpinner";
// import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles(theme => ({
	drawer: {
		borderTop: 60,
		width: 320,
		flexShrink: 0,
	},
	header: {
		display: "flex",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		backgroundColor: "#eee",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		minHeight: "73px",
		justifyContent: "flex-center",
	},
	drawerPaper: {
		width: 320,
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
}));

const TicketSearchMessages = ({ ticket, open, handleSearchClose }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const { user } = useContext(AuthContext);
	
	return (
		<Drawer
			className={classes.drawer}
			variant="persistent"
			anchor="right"
			open={open}
			PaperProps={{ style: { position: "absolute" } }}
			BackdropProps={{ style: { position: "absolute" } }}
			ModalProps={{
				container: document.getElementById("drawer-container"),
				style: { position: "absolute" },
			}}
			classes={{
				paper: classes.drawerPaper,
			}}
		>
			<div className={classes.header}>
				<IconButton onClick={handleSearchClose}>
					<Close />
				</IconButton>
			</div>
			<Paper square variant="outlined">
				Teste
			</Paper>
		</Drawer>
	);
};

export default TicketSearchMessages;

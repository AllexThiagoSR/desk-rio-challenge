import React, { useContext, useEffect, useRef, useState } from "react";
// import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Card, Drawer, IconButton, InputBase, List, Paper, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";

// import { i18n } from "../../translate/i18n";
// import api from "../../services/api";
// import TicketOptionsMenu from "../TicketOptionsMenu";
// import ButtonWithSpinner from "../ButtonWithSpinner";
// import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import toastError from "../../errors/toastError";
import api from "../../services/api";

const drawerWidth = 320;

const useStyles = makeStyles(theme => ({
	header: {
		display: "flex",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		backgroundColor: "#eee",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		minHeight: "80px",
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
		flexDirection: "column",
		justifyContent: "space-between",
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
	},
	messageDate: {
		alignSelf: "flex-start",
		fontSize: "11px"
	},
	messageContainer: {
		display: "flex",
		flexDirection: "column",
		padding: "4px 8px",
		minHeight: "50px",
		marginBottom: "2px"
	},
	messagesList: {
		maxHeight: "90%",
		overflowY: "scroll",
	},
	loadingList: {
		display: "flex",
		flexGrow: "1",
		justifyContent: "center",
		alignItems: "center"
	}
}));

const TicketSearchMessages = ({ ticket, open, handleSearchClose }) => {
	const classes = useStyles();
	const [messages, setMessages] = useState([]);
	const [_, setTotalMessages] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const lastMessageRef = useRef();
	const [loading, setLoading] = useState(false);
	const [loadingFirstSearch, setLoadingFirstSearch] = useState(false);
	const [searchInputIsOnFocus, setSearchInputIsOnFocus] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [finalSearchQuery, setFinalSearchQuery] = useState("");
	const [currentTimeoutId, setCurrentTimeoutId] = useState();

	useEffect(() =>{
		const timeoutId = setTimeout(() => {
			if (searchQuery !== "")
				setFinalSearchQuery(searchQuery)
			else if (searchQuery === "" && finalSearchQuery !== "")
				setFinalSearchQuery("")
		}, 900, [])
		setCurrentTimeoutId(timeoutId)
	}, [searchQuery]);

	useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchMessagesByQueryLoadMore = async () => {
        try {
					if (!finalSearchQuery || !hasMore) return;
          const { data } = await api.get(
						`/messages/${ticket.id}/search`,
						{ params: { q: finalSearchQuery, pageNumber } }
					);
					setMessages((previousMessages) => [...previousMessages, ...data.messages])
					setHasMore(data.hasMore);
					setTotalMessages(data.total)
					setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchMessagesByQueryLoadMore();
    }, 200);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [pageNumber]);

	useEffect(() => {
    setLoadingFirstSearch(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchMessagesByQueryPage1 = async () => {
        try {
					if (!finalSearchQuery) {
						setMessages([]);
						setHasMore(false);
						setTotalMessages(0)
						setLoadingFirstSearch(false);
						setPageNumber(1);
						return;
					}
          const { data } = await api.get(`/messages/${ticket.id}/search`, {
            params: { q: finalSearchQuery },
          });
					setMessages(data.messages)
					setHasMore(data.hasMore);
					setTotalMessages(data.total)
					setLoadingFirstSearch(false);
        } catch (err) {
          setLoadingFirstSearch(false);
          toastError(err);
        }
      };
      fetchMessagesByQueryPage1();
    }, 200);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [finalSearchQuery]);

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
			{
				loadingFirstSearch
					? (<div className={classes.loadingList}>Carregando</div>)
					: (<List className={classes.messagesList}>
						{
							messages.map((message) => (
								<Card key={message.id} className={classes.messageContainer}>
									<Typography
										className={classes.messageDate}
									>
										{new Date(message.createdAt).toLocaleDateString('pt-br')}
									</Typography>
									<Typography>
										{message.body}
									</Typography>
								</Card>
							))
						}
					</List>)
			}
		</Drawer>
	);
};

export default TicketSearchMessages;

import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import ReportIcon from "@mui/icons-material/Assessment";
import CourseRegIcon from "@mui/icons-material/EditNote";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import AboutUs from "@mui/icons-material/Info";
import { Paper } from "@mui/material";
import CourseIcon from "@mui/icons-material/AutoStories";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useNavigate } from "react-router-dom";
import { Height, Logout } from "@mui/icons-material";
import { useState, useEffect } from "react";

const drawerWidth = 260;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
	borderRadius: "25px",
	marginLeft: "20px",
	marginTop: "20px", // Added top margin
	marginBottom: "20px", // Added bottom margin
	height: "calc(100% - 40px)", // Adjust height to account for margins
	maxHeight: "calc(100vh - 40px)", // Prevent overflow
	boxShadow: theme.shadows[5],
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
	borderRadius: "25px",
	marginLeft: "20px",
	marginTop: "20px", // Added top margin
	marginBottom: "20px", // Added bottom margin
	height: "calc(100% - 40px)", // Adjust height to account for margins
	maxHeight: "calc(100vh - 40px)", // Prevent overflow
	boxShadow: theme.shadows[5],
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(
	// Change here

	({ theme }) => ({
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
		boxSizing: "border-box",
		overflow: "hidden", // Prevent scrolling
		"& .MuiDrawer-paper": {
			overflow: "hidden", // Prevent scrolling in the drawer paper
		},
		variants: [
			{
				props: { open: true },
				style: {
					...openedMixin(theme),
					"& .MuiDrawer-paper": openedMixin(theme),
				},
			},
			{
				props: { open: false },
				style: {
					...closedMixin(theme),
					"& .MuiDrawer-paper": closedMixin(theme),
				},
			},
		],
	})
);

export default function Navbar() {
	const [open, setOpen] = React.useState(
		window.screen.width < "900" ? false : true
	);
	const isAbove900px = useMediaQuery("(max-width:900px)");

	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState({});
	useEffect(() => {
		const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
		setUserInfo(storedUserInfo);
		// console.log(storedUserInfo);
	}, []);
	const handleLogout = () => {
		localStorage.removeItem("userInfo");
		localStorage.removeItem("_grecaptcha");

		navigate("/");
	};

	const handleDrawer = () => {
		setOpen((prev) => !prev);
	};

	return (
		<Box
			sx={{
				display: "flex",
				height: "0%",
				maxHeight: "100vh",
				overflow: "hidden",
			}}
		>
			<CssBaseline />
			<Drawer variant="permanent" open={open}>
				<DrawerHeader>
					{isAbove900px && (
						<IconButton onClick={handleDrawer}>
							<MenuIcon />
						</IconButton>
					)}
				</DrawerHeader>
				<Divider />
				<List>
					{[
						userInfo.role === "student"
							? "Dashboard"
							: userInfo.role === "faculty"
								? "profdashboard"
								: "admindashboard",
						
						"Mycourses",
						"AboutUs",
					].map((text, index) => (
						<ListItem key={text} disablePadding sx={{ display: "block" }}>
							<Link
								to={`/${text.toLowerCase()}`}
								style={{ textDecoration: "none" }}
							>
								<ListItemButton
									sx={[
										{
											minHeight: 48,
											px: 2.5,
											color: "blue",
										},
										open
											? { justifyContent: "initial" }
											: { justifyContent: "center" },
									]}
								>
									<ListItemIcon
										sx={[
											{
												minWidth: 0,
												justifyContent: "center",
											},
											open
												? {
														mr: 3,
													}
												: {
														mr: "auto",
													},
										]}
									>
										{index === 0 && <DashboardIcon />}
										{/* {index === 1 && <SchoolIcon />} */}
										
										{index === 1 && <CourseIcon />}
										{index === 2 && <AboutUs />}
									</ListItemIcon>
									<ListItemText
										primary={text}
										sx={[
											open
												? {
														opacity: 1,
													}
												: {
														opacity: 0,
													},
										]}
									/>
								</ListItemButton>
							</Link>
						</ListItem>
					))}
				</List>
				<Divider />
				{userInfo.role === "student" && (
					<List>
						{["Result","FeesPayment", "CourseRegistration"].map(
							(text, index) => (
								<ListItem key={text} disablePadding sx={{ display: "block" }}>
									<Link
										to={`/${text.toLowerCase()}`}
										style={{ textDecoration: "none" }}
									>
										<ListItemButton
											sx={[
												{
													minHeight: 48,
													px: 2.5,
													color: "blue",
												},
												open
													? {
															justifyContent: "initial",
														}
													: {
															justifyContent: "center",
														},
											]}
										>
											<ListItemIcon
												sx={[
													{
														minWidth: 0,
														justifyContent: "center",
													},
													open
														? {
																mr: 3,
															}
														: {
																mr: "auto",
															},
												]}
											>  
											{index === 0 && <ReportIcon />}
											{index === 1 && <PaymentIcon />}
											{index === 2 && <CourseRegIcon />}
											</ListItemIcon>
											<ListItemText
												primary={text}
												sx={[
													open
														? {
																opacity: 1,
															}
														: {
																opacity: 0,
															},
												]}
											/>
										</ListItemButton>
									</Link>
								</ListItem>
							)
						)}
					</List>
				)}

				{/* <Logout onClick={handleLogout}></Logout> */}
				<img
					src="../Images/student.png"
					alt="Student"
					style={{ minHeight: "60px" }}
				/>

				<List sx={{ bottom: 0 }}>
					<ListItem key={Logout} disablePadding>
						<ListItemButton
							sx={[
								{
									minHeight: 48,
									px: 2.5,
									color: "blue",
								},
								open
									? {
											justifyContent: "initial",
										}
									: {
											justifyContent: "center",
										},
							]}
							onClick={handleLogout}
						>
							<ListItemIcon
								sx={[
									{
										minWidth: 0,
										justifyContent: "center",
									},
									open
										? {
												mr: 3,
											}
										: {
												mr: "auto",
											},
								]}
							>
								<Logout />
							</ListItemIcon>
							<ListItemText
								sx={[
									open
										? {
												opacity: 1,
											}
										: {
												opacity: 0,
											},
								]}
							>
								Log Out
							</ListItemText>
						</ListItemButton>
					</ListItem>
				</List>
			</Drawer>
			{/* </Paper> */}
		</Box>
	);
}

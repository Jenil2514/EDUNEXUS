import React, { useEffect, useState } from "react";
import {
	Tabs,
	Tab,
	Box,
	Card,
	// CardContent,
	Typography,
	// Avatar,
	Tooltip,
} from "@mui/material";
// import { Divider, Button } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import NoteIcon from "@mui/icons-material/Note";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PeopleIcon from "@mui/icons-material/People";
// import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";

import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
// const StyledCard = styled(Card)({
// 	border: "1px solid #e0e0e0",
// 	borderRadius: "10px",
// 	padding: "20px",
// 	marginBottom: "20px",
// 	boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
// });
import { Modal } from "@mui/material";
import Publish from "./Publish";

import PropTypes from "prop-types";
import useAPI from "../../hooks/api";
import axios from "axios";
import LabSubmission from "./LabSubmission";
import AnnouncementDetails from "./AnnouncementDetails";
import ClassNotes from "./ClassNotes";


const TabPanel = (props) => {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
};

TabPanel.propTypes = {
	children: PropTypes.node,
	value: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
};
const parentstyle = {
	marginTop: "100px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "5px",
	margin: "5px",
};

// const Api = "http://localhost:3001/api/user/dashboard/mycourses/1/lab";

const CourseDetails = () => {
	const ENDPOINT = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

	const userInfo = localStorage.getItem("userInfo");
	const ID = userInfo ? JSON.parse(userInfo).SID : null;
	const role = userInfo ? JSON.parse(userInfo).role : null;

	// let cid = 1;
	const { course_id: cid } = useParams(); // Matches the route parameter name
	// console.log("course_id", cid);
	let Api = null;
	if (role === "student") {
		Api = `${ENDPOINT}/api/user/dashboard/Mycourses/${cid}/lab`; // Use course_id
	} else if (role === "faculty") {
		Api = `${ENDPOINT}/api/user/profdashboard/Mycourses/${cid}/lab`; // Use course_id
	}

	// const { GET, POST } = useAPI();

	const [lab, setLab] = useState("");

	const fetchApiData = async () => {
		try {
			const response = await axios.get(Api); // Corrected typo here
			// console.log(response.data); // Ensure this line is uncommented to print data
			setLab(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	let Api2 = null;
	if (role === "student") {
		Api2 = `${ENDPOINT}/api/user/dashboard/Mycourses/${cid}/notes`; // Use course_id
	} else if (role === "faculty") {
		Api2 = `${ENDPOINT}/api/user/profdashboard/Mycourses/${cid}/notes`; // Use course_id
	}

	// const { GET, POST } = useAPI();

	const [notes, setNotes] = useState("");

	const fetchApiData2= async () => {
		try {
			const response = await axios.get(Api2); // Corrected typo here
			// console.log(response.data); // Ensure this line is uncommented to print data
			setNotes(response.data.notes);
		} catch (error) {
			console.log(error);
		}
	};



	useEffect(() => {
		// Fetch labs and notes when the course id (cid) changes
		fetchApiData();
		fetchApiData2();
	}, [cid]);
	


	const [value, setValue] = useState(0);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile view

	const handleChange = (event, newValue) => setValue(newValue);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};
	useEffect(() => {
		fetchApiData();
	}, [isModalOpen]);
	return (
		<div style={{ marginTop: "20px" }}>
			<Grid container>
				{/* Sidebar with Navbar */}

				{/* Course Cards Section */}
				<Grid
					item
					md={12}
					xs={9}
					sm={10}
					sx={{ position: "relative" }}
					style={parentstyle}
				>
					<Grid container spacing={4} style={{ padding: "5px", margin: "5px" }}>
						<Box sx={{ width: "100%" }}>
							<Tabs
								value={value}
								onChange={handleChange}
								variant={isMobile ? "scrollable" : "standard"}
								scrollButtons={isMobile ? "auto" : false}
								centered={!isMobile}
							>
								{/** Tab Icons and Tooltips */}
								<Tooltip title="Lab" arrow>
									<Tab
										icon={<FolderIcon />}
										label={value === 0 ? "Lab" : ""}
										aria-label="Lab"
									/>
								</Tooltip>
								<Tooltip title="Notes" arrow>
									<Tab
										icon={<NoteIcon />}
										label={value === 1 ? "Notes" : ""}
										aria-label="Notes"
									/>
								</Tooltip>
								<Tooltip title="Announcements" arrow>
									<Tab
										icon={<AnnouncementIcon />}
										label={value === 2 ? "Announcements" : ""}
										aria-label="Announcements"
									/>
								</Tooltip>
								<Tooltip title="Students" arrow>
									<Tab
										icon={<PeopleIcon />}
										label={value === 3 ? "Students" : ""}
										aria-label="Students"
									/>
								</Tooltip>
								{/* <Tooltip title="Attendance" arrow>
                                            <Tab
                                                icon={<EventAvailableIcon />}
                                                label={value === 3 ? "Attendance" : ""}
                                                aria-label="Attendance"
                                            />
                                        </Tooltip> */}

								<div
									style={{
										display: "flex",
										alignItems: "center",
										padding: "0 20px",
									}}
								>
									{role === "faculty" && (
										<button
											// disabled={}
											className="add"
											style={{
												marginLeft: "auto",
												marginRight: "20px", // Adds space between the button and the edge of the screen
												padding: "13px 26px", // Adjusts the padding inside the button
												fontSxize: "16px", // Sets a good font size
												borderRadius: "4px", // Rounded corners
												backgroundColor: "#1976d2", // Primary blue color
												color: "#fff", // White text color
												border: "none", // Removes any border
												cursor: "pointer", // Changes the cursor to pointer on hover
											}}
											onClick={handleOpenModal}
										>
											Announcement Something
										</button>
									)}
									<Modal open={isModalOpen} onClose={handleCloseModal}>
										<Box
											sx={{
												position: "absolute",
												top: "50%",
												left: "50%",
												transform: "translate(-50%, -50%)",
												// width: {
												// 	xs: "90vw",
												// 	sm: "80vw",
												// 	md: "60vw",
												// 	lg: "50vw",
												// }, // Responsive width
												height: { xs: "80vh", sm: "70vh", md: "auto" }, // Responsive height with flexibility for larger screens
												maxHeight: "90vh", // Ensures it doesn't overflow on small screens
												bgcolor: "background.paper",
												boxShadow: 24,
												// p: 4,
												borderRadius: "8px",
												overflowY: "auto", // Adds scroll if content overflows vertically
											}}
										>
											<Publish
												// addAnnouncement={addAnnouncement}
												handleClose={handleCloseModal}
											/>
										</Box>
									</Modal>
								</div>
							</Tabs>

							<TabPanel value={value} index={0}>
								<Typography>
									{/* <LabSubmission /> */}
									<AnnouncementDetails category="Lab" Lists={lab.Labs} />
								</Typography>
							</TabPanel>
							<TabPanel value={value} index={1}>
								<Typography>
								<ClassNotes notes={notes} />
								</Typography>
							</TabPanel>
							<TabPanel value={value} index={2}>
								<Typography>Announcements Content</Typography>
							</TabPanel>
							{/* <TabPanel value={value} index={3}>
								<Typography>Attendance Content</Typography>
							</TabPanel> */}
							<TabPanel value={value} index={3}>
								<Typography>Students List Content</Typography>
							</TabPanel>
						</Box>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default CourseDetails;

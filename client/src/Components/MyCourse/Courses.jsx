import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import CourseCard2 from "./CourseCard2"; // Import the ClassroomCard component
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import useAPI from "../../hooks/api";
import Loader from "../../Pages/Loding"; // Import the Loader component
//integration
import axios from "axios";


//  import dotenv from 'dotenv';
//  dotenv.config();

const ENDPOINT = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

const userInfo = localStorage.getItem("userInfo");
const ID = userInfo ? JSON.parse(userInfo).SID : null;
const role = userInfo ? JSON.parse(userInfo).role : null;

const parentstyle = {
    marginTop: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px",
    margin: "5px",
};
const Courses = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [mycourses, setMycourses] = useState([]);
	const [semester, setSemester] = useState(7);
	const { GET, POST } = useAPI();

	const handleChange = (event) => {
		setSemester(event.target.value);
	};

	useEffect(() => {
		const fetchApiData = async () => {
			setIsLoading(true);
			try {
				// Try to read userInfo; if not present (navigated too quickly after login), retry a few times
				let parsed = null;
				for (let attempt = 0; attempt < 8; attempt++) {
					const stored = localStorage.getItem("userInfo");
					parsed = stored ? JSON.parse(stored) : null;
					if (parsed) break;
					// wait a short while before retrying
					// eslint-disable-next-line no-await-in-loop
					await new Promise((r) => setTimeout(r, 80));
				}

				const ID = parsed?.SID || null;
				const role = parsed?.role || null;

				let apiUrl = null;
				if (role === "student") {
					apiUrl = `${ENDPOINT}/api/user/dashboard/mycourses?ID=${ID}&Semester=${semester}`;
				} else if (role === "faculty") {
					apiUrl = `${ENDPOINT}/api/user/profdashboard/mycourses?ID=${ID}`;
				}

				if (!apiUrl) {
					console.warn('No API URL for role or missing user info, skipping fetch');
					setMycourses([]);
					setIsLoading(false);
					return;
				}

				const response = await axios.get(apiUrl);
				console.log(response.data);
				setMycourses(response.data?.mycourses || []);
			} catch (error) {
				console.log(error);
				setMycourses([]);
			} finally {
				setIsLoading(false);
			}
		};
		fetchApiData();
	}, [semester]);

	useEffect(() => {
		console.log(mycourses);
	}, [mycourses]);

	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					padding: "0 20px",
					marginTop: "15px",
				}}
			>
				<h1 style={{ zIndex: "1", width: "100%", margin: 0 }}>My Courses</h1>

				<FormControl
					sx={{
						m: 1,
						minWidth: 120,
						borderRadius: "8px",
						backgroundColor: "#f5f5f5",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
						"& .MuiSelect-root": {
							padding: "10px",
							border: "1px solid #ccc",
							"&:hover": {
								borderColor: "#3f51b5",
							},
						},
						"& .Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "#3f51b5",
						},
					}}
					size="medium"
				>
					<InputLabel id="demo-select-small-label">Semester</InputLabel>
					<Select
						labelId="demo-select-small-label"
						id="demo-select-small"
						value={semester}
						label="Semester"
						onChange={handleChange}
						sx={{
							"& .MuiSelect-icon": {
								color: "#3f51b5",
							},
						}}
					>
						{[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
							<MenuItem key={sem} value={sem}>
								{sem}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			<div style={{ marginTop: "40px" }}>
				<Grid container>
					<Grid
						item
						md={12}
						xs={9}
						sm={10}
						sx={{ position: "relative" }}
						style={parentstyle}
					>
						<Grid
							container
							spacing={4}
							style={{ padding: "5px", margin: "5px" }}
						>
							{isLoading ? (
								<div>Loading courses...</div>
							) : mycourses.length === 0 ? (
								<div>No courses available for the selected semester.</div>
							) : (
								mycourses.map((course, index) => (
									<div key={index} style={{ padding: "5px", margin: "5px" }}>
										<CourseCard2
											cid={course.cid}
											courseName={course.course_code}
											instructor={course.course_code}
											avatarLetter={course.avatarLetter}
											courseCode={course.course_code}
										/>
									</div>
								))
							)}
						</Grid>
					</Grid>
				</Grid>
			</div>
		</>
	);
};
export default Courses;
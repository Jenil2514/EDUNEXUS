import React, { useState, useEffect } from "react";
import {
	TextField,
	Button,
	Box,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	IconButton,
	Chip,
	Stack,
} from "@mui/material";
import {
	AttachFile as AttachFileIcon,
	Close as CloseIcon,
	Announcement as AnnouncementIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import useAPI from "../../hooks/api";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const initialValues = {
	title: "",
	content: "",
	category: "",
	date: "",
	time: "",
	url: "",
};
const AnnouncementForm = ({ addAnnouncement, handleClose }) => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [category, setCategory] = useState("General");
	const [attachedFiles, setAttachedFiles] = useState([]);

	const { POST } = useAPI();

	const [attachedLinks, setAttachedLinks] = useState([]);
	const [link, setLink] = useState("");
    const [formError, setFormError] = useState("");
		const [savedLink, setSavedLink] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [dateError, setDateError] = useState("");
	const [formValues, setFormValues] = useState(initialValues);
	const [formErrors, setFormErrors] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);

	const handleDateChange_ = (e) => {
		const selectedDate = new Date(e.target.value);
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison

		if (selectedDate < currentDate) {
			setDateError("Selected date cannot be in the past.");
		} else {
			setDateError("");
			setDate(e.target.value);
		}
	};

	const handleTimeChange = (e) => {
		let inputTime = e.target.value;
		if (inputTime) {
			// Convert to 12-hour format
			const [hours, minutes] = inputTime.split(":");
			let period = "AM";
			let formattedHours = parseInt(hours, 10);

			if (formattedHours >= 12) {
				period = "PM";
				if (formattedHours > 12) {
					formattedHours -= 12;
				}
			} else if (formattedHours === 0) {
				formattedHours = 12;
			}

			setTime(`${formattedHours}:${minutes} ${period}`);
		}
	};

	const handleAddLink = () => {
		if (link.trim() !== "") {
			setAttachedLinks([...attachedLinks, link]);
			setLink(""); // Clear the input after submission
		}
	};
	const handleLinkRemove = (linkToRemove) => {
		setAttachedLinks(attachedLinks.filter((link) => link !== linkToRemove));
	};
	const [dueDate, setDueDate] = useState(null);
	const handleDateChange = (newDate) => {
		setDueDate(newDate);
	};

	const [isAdding, setIsAdding] = useState(false);

	const ENDPOINT = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

	const userInfo = localStorage.getItem("userInfo");
	const ID = userInfo ? JSON.parse(userInfo).SID : null;
	const role = userInfo ? JSON.parse(userInfo).role : null;

	// let cid = 1;
	const { course_id: cid } = useParams(); // Matches the route parameter name
	console.log("course_id", cid);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errors = validate(formValues);

		setFormErrors(errors);

		// Check if there are any errors
		if (Object.keys(errors).length === 0) {
			setIsSubmit(true);
			setIsAdding(true);
			try {
				const announcement = {
					link,
					ID: cid, // Use course_id
					title,
					description: content,
					due_time: date ,
					category, // Include category in the announcement object
				};

				// const results = await POST(
				// 	`/api/user/profdashboard/mycourses/${cid}/lab/assignment`, // Adjust the API endpoint for general announcements
				// 	announcement
				// );
				console.log("cid", announcement);
				const results = await axios.post(
					`${ENDPOINT}/api/user/profdashboard/mycourses/${cid}/lab/assignment`,
					announcement,
					{
						headers: { "Content-Type": "application/json" },
						withCredentials: true,
					}
				);

				console.log("results---->", results);
				handleClose(); // Close the form only if submission is successful
				toast.success("Added successful!");
			} catch (error) {
				console.log(error);
			} finally {
				setIsAdding(false);
			}
		} else {
			setIsSubmit(false); // Ensure form is not submitted if there are errors
		}
	};

	
	const handleSaveLink = () => {
		if (!link) {
			setFormError("Please enter a valid URL.");
			return;
		}
		setSavedLink(link); // Save the entered link
		setLink(""); // Clear the input field
	};

	const handleChange = (e) => {
		setFormError(""); // Clear the error as the user type
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });

		// Specific logic for each field
		switch (name) {
			case "title":
				setTitle(value);
				break;
			case "content":
				setContent(value);
				break;
			case "category":
				setCategory(value);
				break;
			case "link":
				setLink(value);
				break;
			case "date":
				handleDateChange_(e);
				break;
			case "time":
				handleTimeChange(e);
				break;
			default:
				break;
		}
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		const errors = validate({ ...formValues, [name]: value });
		setFormErrors(errors);
	};

	// useEffect(() => {
	// 	console.log(formErrors);
	// 	if (Object.keys(formErrors).length === 0 && isSubmit) {
	// 		// console.log(formValues);
	// 	}
	// 	validate(formValues);
	// }, [formErrors]);

	const validate = (values) => {
		const errors = {};
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
		if (!values.title) {
			errors.title = "Title is required!";
		} else if (values.title.length < 5) {
			errors.title = "Title must be more than 5 characters";
		} else if (values.title.length > 20) {
			errors.title = "Title cannot exceed more than 20 characters";
		}

		if (!values.content) {
			errors.content = "Content is required!";
		} else if (values.content.length < 5) {
			errors.content = "Content must be more than 5 characters";
		} else if (values.content.length > 100) {
			errors.content = "Content cannot exceed more than 100 characters";
		}

		if (!values.category) {
			errors.category = "Please choose any category";
		}

		// if (link) {
		// 	if (!regex.test(link)) {
		// 		errors.link = "Invalid URL";
		// 	}
		// }

		const currentDate = new Date();
		const selectedDate = new Date(date);
		// const selectedTime = new Date(`${date}T${time}`);
		
		if (selectedDate < currentDate) {
			errors.date = "Date is required! Enter valid date";
		} else if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
			errors.date = "Selected date cannot be in the past.";
		} else if (!date) {
			errors.date = "Date is required!";
		}

		// if (selectedTime < selectedTime) {
		// 	errors.time = "Time is required!";
		// } else if (
		// 	selectedDate.toDateString() === currentDate.toDateString() &&
		// 	selectedTime < currentDate
		// ) {
		// 	errors.time = "Selected time cannot be in the past.";
		// } else if (!time) {
		// 	errors.time = "Time is required!";
		// }

		return errors;
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			mb={3}
			sx={{
				backgroundColor: "#ffffff",
				padding: "20px",
				borderRadius: "12px",
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
				border: "1px solid #e0e0e0",
				maxWidth: "600px",
				margin: "0 auto",
				position: "relative",
			}}
		>
			{/* Close Button */}
			<IconButton
				onClick={handleClose}
				sx={{ position: "absolute", top: "10px", right: "10px" }}
			>
				<CloseIcon />
			</IconButton>

			<div
				style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
			>
				<AnnouncementIcon style={{ color: "#1976d2", marginRight: "8px" }} />
				<h2 style={{ margin: 0, color: "#1976d2", fontSize: "24px" }}>
					Create an Announcement
				</h2>
			</div>
			<TextField
				label="Title"
				variant="outlined"
				fullWidth
				margin="dense"
				name="title"
				value={title}
				onChange={handleChange}
				onBlur={handleBlur}
				error={!!formErrors.title} // Set error to true if there is an error
				helperText={formErrors.title} // Display the error message
			/>
			<TextField
				label="Content"
				variant="outlined"
				fullWidth
				multiline
				rows={3}
				margin="dense"
				name="content"
				value={content}
				onChange={handleChange}
				onBlur={handleBlur}
				error={!!formErrors.content} // Set error to true if there is an error
				helperText={formErrors.content} // Display the error message
			/>
			<FormControl variant="outlined" fullWidth margin="dense">
				<InputLabel>Category</InputLabel>
				<Select
					name="category"
					value={category}
					onChange={handleChange}
					onBlur={handleBlur}
					label="Category"
					error={!!formErrors.category} // Set error to true if there is an error
				>
					<MenuItem value="Lab">Lab</MenuItem>
					<MenuItem value="Exam">Class Note</MenuItem>
					<MenuItem value="Assignment">Assignment</MenuItem>
				</Select>
				{formErrors.category && (
					<div style={{ color: "red" }}>{formErrors.category}</div>
				)}
			</FormControl>
			{category === "Lab" ? (
				<div>
					<label htmlFor="calendar">Select a date:</label>
					<input
						type="date"
						id="calendar"
						name="date"
						value={date}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{/* {formErrors.date && <p style={{ color: "red" }}>{formErrors.date}</p>}
					<label htmlFor="time">Select a time:</label>
					<input
						type="time"
						id="time"
						name="time"
						value={time}
						onChange={handleChange}
						onBlur={handleBlur}
					/> */}
					{/* {formErrors.time && <p style={{ color: "red" }}>{formErrors.time}</p>} */}
					<div>
						<div>Selected Date: {date}</div>
						{/* <div>Selected Time: {time}</div> */}
					</div>
				</div>
			) : null}

			<div>
				<TextField
					label="Paste URL"
					variant="outlined"
					fullWidth
					margin="dense"
					name="link"
					value={link}
					onChange={handleChange}
					error={!!formError}
					helperText={formError}
				/>
				<Button
					onClick={handleSaveLink}
					variant="outlined"
					color="primary"
					sx={{
						marginTop: "10px",
						borderColor: "#1976d2",
						color: "#1976d2",
						"&:hover": {
							backgroundColor: "#f0f4ff",
							borderColor: "#1565c0",
						},
					}}
				>
					Save Link
				</Button>

				{/* Display Saved Link */}
				{savedLink && (
					<div style={{ marginTop: "10px" }}>
						<strong>Saved Link:</strong>
						<div>{savedLink}</div>
					</div>
				)}
			</div>

			<Button
				type="submit"
				variant="contained"
				color="primary"
				fullWidth
				sx={{
					marginTop: "20px",
					padding: "10px 0",
					fontSize: "16px",
					backgroundColor: "#1976d2",
					"&:hover": {
						backgroundColor: "#1565c0",
					},
				}}
				disabled={Object.keys(formErrors).length > 0} // Disable if there are errors
				onClick={handleSubmit}
			>
				Add Announcement{" "}
				{isAdding ? (
					<CircularProgress size={20} sx={{ color: "black" }} />
				) : null}
			</Button>
			<div>
				{Object.keys(formErrors).length > 0 ? (
					<div style={{ color: "red" }}>Please fill all the fields</div>
				) : null}
			</div>
		</Box>
	);
};

export default AnnouncementForm;

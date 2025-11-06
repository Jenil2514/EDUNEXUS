// AnnouncementDetails.js
import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import AnnouncementItem from './AnnouncementItem';

// const announcements = [
//   { facultyName: "Dr. Smith", title: "Class Rescheduled", content: "Math class moved to 3 PM", date: "2024-11-13", category: "General" },
//   { facultyName: "Prof. Lee", title: "Assignment Due", content: "Submit assignment 2 by next Monday.", date: "2024-11-15", category: "Assignment" },
//   { facultyName: "Dr. Smith", title: "Guest Lecture", content: "Guest lecture by Prof. Anderson on Quantum Physics.", date: "2024-11-20", category: "Lecture" },
// ];

const AnnouncementDetails = ({ category, Lists }) => {
	// console.log("categaaaory");
	// console.log(Lists);
  return (
		<Container maxWidth="md" sx={{ pt: 4, color: "#003366" }}>
			{/* Page Header */}
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={4}
			>
				<Typography variant="h4" fontWeight="bold" color="primary">
					{category}
				</Typography>
			</Box>

			{/* Announcements List */}
			{Lists && Array.isArray(Lists)
				? Lists.map((List, index) => (
						<Box key={index} mb={3}>
						<AnnouncementItem
								LabId={List.lab_id}
								title={List.title}
								date={List.due_time}
								/* server currently returns prof_id (number) here; cast to string for the component */
								facultyName={List.prof_id ? String(List.prof_id) : 'Unknown'}
								content={List.description}
								category={category}
							/>
							{index < Lists.length - 1 && <Divider sx={{ my: 3 }} />}
						</Box>
					))
				: null}
		</Container>
	);
};

export default AnnouncementDetails;

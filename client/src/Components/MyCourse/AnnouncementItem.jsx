// AnnouncementItem.js
import React, { useState } from 'react';
import { Box, Typography, IconButton, Card, CardContent, Chip, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import PropTypes from "prop-types";
import LabSubmission from "./LabSubmission";
const AnnouncementItem = ({ LabId,title, date, facultyName, content, category }) => {
  // State for Modal (hook should be called unconditionally)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedDate = date ? new Date(date).toLocaleDateString() : "No Date Provided";
  // const facultyName = facultyName || "Unknown Faculty";

  // Handlers for opening and closing modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
	// console.log("LabId",LabId);
  return (
		<>
			{/* Main Announcement Card */}
			<div>
				<Card
					onClick={handleOpenModal}
					sx={{
						mb: 3,
						borderRadius: 3,
						overflow: "hidden",
						transition: "transform 0.2s, box-shadow 0.2s",
						boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
						"&:hover": {
							transform: "scale(1.02)",
							boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
							cursor: "pointer",
						},
					}}
				>
					<CardContent sx={{ p: 3 }}>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography
								variant="h6"
								fontWeight="bold"
								color="text.primary"
								sx={{ mb: 1 }}
							>
								{title}
							</Typography>
						</Box>

						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							mb={2}
						>
							<Typography variant="body2" color="textSecondary">
								{date}
							</Typography>
							<Chip label={facultyName} color="primary" size="small" />
						</Box>

						<Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
							{content.length > 120
								? `${content.substring(0, 120)}...`
								: content}
						</Typography>
					</CardContent>
				</Card>

				<Modal open={isModalOpen} onClose={handleCloseModal}>
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							// width: { xs: "90vw", sm: "80vw", md: "60vw", lg: "50vw" }, // Responsive width
							// height: { xs: "80vh", sm: "70vh", md: "auto" }, // Responsive height with flexibility for larger screens
							maxHeight: "90vh", // Ensures it doesn't overflow on small screens
							bgcolor: "background.paper",
							boxShadow: 24,
							p: 4,
							borderRadius: "8px",
							overflowY: "auto", // Adds scroll if content overflows vertically
						}}
					>
						{category === "Lab" ? (
							<LabSubmission
								LabId={LabId}
								labTitle={title}
								labDescription={content}
								labDueDate={date}
								facultyName={facultyName}
								handleCloseModal={handleCloseModal}
							/>
						) : (
							<div>
								<IconButton
									onClick={handleCloseModal}
									sx={{ position: "absolute", top: 8, right: 8 }}
								>
									<CloseIcon />
								</IconButton>

								<Typography
									variant="h5"
									fontWeight="bold"
									color="text.primary"
									mb={2}
								>
									{title}
								</Typography>

								<Typography
									variant="subtitle2"
									color="textSecondary"
									gutterBottom
								>
									{formattedDate} • {facultyName}
								</Typography>

								<Typography variant="body1" color="text.primary" mt={2}>
									{content}
								</Typography>
							</div>
						)}
					</Box>
				</Modal>
			</div>
		</>
	);
};


AnnouncementItem.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
  facultyName: PropTypes.string,
	// formattedDate: PropTypes.string,
  content: PropTypes.string,
  category: PropTypes.string,
};

AnnouncementItem.defaultProps = {
  title: "No Title Provided",
  date: "N/A",
	facultyName: "Unknown Faculty",
	// formattedDate: "N/A",
  content: "No content available",
  category: "Announcement",
};

export default AnnouncementItem;

import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import SchoolIcon from '@mui/icons-material/School';
import HouseIcon from '@mui/icons-material/House';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const icons = {
  tution: <SchoolIcon style={{ fontSize: "32px", color: "#ffffff" }} />,
  hostel: <HouseIcon style={{ fontSize: "32px", color: "#ffffff" }} />,
  medical: <LocalHospitalIcon style={{ fontSize: "32px", color: "#ffffff" }} />,
};

const FeeCardContainer = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  padding: "20px",
  background: "#ffffff",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25)",
  },
  width: "100%", // Ensure consistent width in the grid
  maxWidth: "340px", // Optional max width for larger screens
}));

const IconContainer = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #2196f3, #21cbf3)",
  borderRadius: "50%",
  width: "50px", // Increase size of icon container
  height: "50px", // Increase size of icon container
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "10px",
}));

const FeeCard = ({ fee = {}, onPayment = () => {} }) => {
  // Defensive defaults
  const { type = 'unknown', due_date = null, is_paid = false, amount = 0, id = null } = fee || {};

  const [remainingDays, setRemainingDays] = useState(0);
  const [isPaid, setIsPaid] = useState(Boolean(is_paid));

  useEffect(() => {
    const calculateRemainingDays = (dueDate) => {
      if (!dueDate) return 0;
      const currentDate = new Date();
      const due = new Date(dueDate);
      const diffTime = due - currentDate;
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };
    setRemainingDays(calculateRemainingDays(due_date));
  }, [due_date]);

  const handlePayment = () => {
    if (id !== null) onPayment(id);
    setIsPaid(true);
  };

  return (
    <FeeCardContainer>
      <CardContent style={{ textAlign: "center" }}>
        <IconContainer>
          {icons[type] || (
            <Typography variant="h6" style={{ color: "#fff" }}>
              ?
            </Typography>
          )}
        </IconContainer>
          <Typography variant="h6" style={{ fontWeight: "bold", color: "#333" }}>
            {typeof type === 'string' && type.length > 0 ? (type.charAt(0).toUpperCase() + type.slice(1)) : 'Unknown'} Fee
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{
            fontSize: "0.95rem",
            fontWeight: "500",
            marginTop: "8px",
          }}
        >
          {remainingDays > 0 ? `${remainingDays} days remaining` : "Past Due"}
        </Typography>
      </CardContent>

      <Typography
        variant="h5"
        style={{
          margin: "16px 0",
          fontWeight: "600",
          textAlign: "center",
          color: "#1976d2",
        }}
      >
        Amount: ${amount}
      </Typography>

      {isPaid ? (
        <Typography
          variant="body1"
          style={{
            backgroundColor: "#4caf50",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          Paid
        </Typography>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handlePayment}
          style={{
            width: "100%",
            fontWeight: "bold",
            textTransform: "none",
            marginTop: "10px",
          }}
        >
          Pay Now
        </Button>
      )}
    </FeeCardContainer>
  );
};

export default FeeCard;

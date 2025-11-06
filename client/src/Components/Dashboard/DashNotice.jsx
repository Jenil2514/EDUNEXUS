import React, { useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import '../../CSS/DashNotice.css'

const colorPalette = [
  '#1976d2',  // Blue
  '#ff4081',  // Pink
  '#4caf50',  // Green
  '#ff9800',  // Orange
  '#9c27b0',  // Purple
  '#f44336',  // Red
  '#00bcd4',  // Cyan
  '#1abc9c',  // Turquoise
  '#2ecc71',  // Emerald
  '#3498db',  // Peter River (Blue)
  '#9b59b6',  // Amethyst (Purple)
  '#e74c3c',  // Alizarin (Red)
  '#f39c12',  // Orange
  '#d35400',  // Pumpkin
  '#7f8c8d',  // Asbestos (Gray)
  '#e67e22',  // Carrot (Dark Orange)
  '#34495e',  // Wet Asphalt (Dark Blue)
];

// Function to get random color
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[randomIndex];
}

function DashNotice({notice}) {
  useEffect(() => {
    // console.log('Notice data:', notice);
  }, [notice]);
  return (  // Corrected: Added the return statement
    <>
      <h3 className='noticeHead'>Notice Board</h3>
      <Box
        sx={{
          padding: '2px',
          maxHeight: '150px',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
        }}
      >
        {notice && notice.length > 0 ? (
          notice.map(({lab_id, title, due_time,description}, index) => {
            const randomColor = getRandomColor();
            // Ensure key uniqueness: prefer lab_id when available, otherwise fall back to a title+index combo
            const itemKey = lab_id ? `lab-${lab_id}` : `notice-${index}-${title}`;
            
            return (
              <Paper
                key={itemKey}
                data-testid="notice"
                sx={{
                  paddingLeft: '10px',
                  margin: '10px',
                  borderBottom: `5px solid ${randomColor}`,
                  borderBottomLeftRadius: '20px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)', // Slightly scale up on hover
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Add shadow on hover
                  },
                }}
              >
                <Typography variant="h6">Due: {title}</Typography>
                <Typography variant="body1">Left Time: {due_time}</Typography>
                <Typography variant="body1">{description}</Typography>
              </Paper>
            );
          })
        ) : (
          <Typography variant="body1">No notices available</Typography>
        )}
      </Box>
    </>
  );
}

export default DashNotice;

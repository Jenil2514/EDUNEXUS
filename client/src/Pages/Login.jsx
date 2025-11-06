import * as React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import StudentLogin from "../Images/student_login.png";
import FacultyLogin from "../Images/faculty.png";
import AdminLogin from "../Images/admin.png";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import Loader from "./Loding"; // Import Loader component
import Background from "../Images/add.png"; // Import the background image

const ENDPOINT = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const defaultTheme = createTheme();
const UserRole = {
  STUDENT: "student",
  FACULTY: "faculty",
  ADMIN: "admin"
};

export default function Login() {
  const navigate = useNavigate();
  const [capVal, setcapVal] = useState(null);
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(UserRole.STUDENT);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.token) {
      navigate('/');
    } else {
      roleCheck(userInfo);
    }
  }, [navigate]);

  const roleCheck = async (userInfo) => {
    console.log("Current User Role:", currentUser);
    try {
      const response = await axios.post(
        `${ENDPOINT}/api/user/authRole`,
        {
          SID: userInfo.SID,
          role: userInfo.role
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      if (response.data.success) {
        toast.success("Login Successful", response.data);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        if (response.data.role === "student") {
          navigate("/dashboard");
        } else if (response.data.role === "faculty") {
          navigate("/profdashboard");
        } else if (response.data.role === "admin") {
          navigate("/admindashboard");
        }
      }
    } catch (error) {
      toast.error(error.response.data);
      navigate('/'); // Redirect to login on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Current User Role:", currentUser);
    localStorage.removeItem("userinfo");
    setIsLoading(true); // Set loading state to true
    try {
      // Send login request to the server
      const response = await axios.post(`${ENDPOINT}/api/user/login`, {
        SID: userid,
        password: password,
        role: currentUser,
      });

      // Check if login was successful
      if (response.data.success) {
        // Store user info in local storage
        localStorage.setItem("userInfo", JSON.stringify(response.data));

        // Display success toast
        toast.success("Login Successful");

        // Navigate to the appropriate dashboard
        if (currentUser === UserRole.STUDENT) {
          navigate("/dashboard");
        } else if (currentUser === UserRole.FACULTY) {
          navigate("/profdashboard");
        } else if (currentUser === UserRole.ADMIN) {
          navigate("/admindashboard");
        }
      }
    } catch (error) {
      // Display error toast if login fails
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userinfo");
    navigate('/');
  };

  const handleStudentLogin = () => {
    setCurrentUser(UserRole.STUDENT);
  };

  const handleFacultyLogin = () => {
    setCurrentUser(UserRole.FACULTY);
  };

  const handleAdminLogin = () => {
    setCurrentUser(UserRole.ADMIN);
  };

  // Define a border style for the selected avatar
  const avatarStyle = (role) => ({
    boxShadow: currentUser === role ? "5px 3px 10px black" : "none",
    cursor: "pointer",
  });

  const handlePassword = (event) => {
    const inputPassword = event.target.value; // Extract the input value
    setPassword(inputPassword); // Update state
  };

  return (
    <>
    <span style={{backgroundColor:"red",color:"white",justifyContent:"center",alignItems:"center",width:"100%",marginLeft:"10px"}}>Notic: Use "student id" = S001, "Faculty id" = F001 & password  = password for visitors</span>
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "80%",
          height: "80%",
          // boxShadow: "0px 0px 8px black",
          borderRadius: "2em",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 0.5, // 50% of the width
            position: "relative",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          ></div>
          <div
            style={{
              backgroundImage: `url(${Background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
            }}
          ></div>
        </div>
        <div
          style={{
            flex: 0.5, // 50% of the width
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <ThemeProvider theme={defaultTheme}>
            <Container
              component="main"
              maxWidth="sm"
              sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
            >
              <CssBaseline />
              <Box
                style={{
                  // boxShadow: "0px 0px 8px black",
                  // background: "transparent",
                }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  // backgroundColor: "rgba(255, 255, 255, 0.6)",
                  borderRadius: "2em",
                  padding: "3em",
                  height: "auto",
                }}
              >
                {isLoading && <Loader />} {/* Display Loader when loading */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    sx={{ mr: 4, width: 56, height: 56 }}
                    style={{ backgroundColor: "#25396F", ...avatarStyle(UserRole.STUDENT) }} // Apply border style
                    src={StudentLogin}
                    onClick={handleStudentLogin}
                  />
                  <Avatar
                    sx={{ mr: 4, ml: 4, width: 56, height: 56 }}
                    style={{ backgroundColor: "#25396F", ...avatarStyle(UserRole.FACULTY) }} // Apply border style
                    src={FacultyLogin}
                    onClick={handleFacultyLogin}
                  />
                  <Avatar
                    sx={{ ml: 4, width: 56, height: 56 }}
                    style={{ backgroundColor: "#25396F", ...avatarStyle(UserRole.ADMIN) }} // Apply border style
                    src={AdminLogin}
                    onClick={handleAdminLogin}
                  />
                </Box>

                <Typography
                  component="h1"
                  variant="h5"
                  sx={{ fontFamily: "Quicksand", fontWeight: "bold", m: 3 }}
                >
                  Login in As {currentUser}
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1, width: "100%" }}
                >
                  <TextField
                    id="filled-basic"
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    label="User Id "
                    name="userid"
                    autoFocus
                    value={userid}
                    onChange={(e) => {
                      setUserId(e.target.value);
                    }}
                    InputProps={{
                      style: {
                        fontFamily: "Quicksand",
                        fontWeight: "bold",
                        color: "#25396F",
                      },
                    }}
                    autoComplete="off"
                  />
                  <TextField
                    id="filled-basic"
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    onChange={handlePassword}
                    value={password}
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    style={{
                      fontFamily: "Quicksand",
                      fontWeight: "bold",
                      backgroundColor: "#25396F",
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </div>
      </Box>
    </div>
    </>
  );
}
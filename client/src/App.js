import './App.css';
import React from 'react'; 
import ProtectedRoute from './ProtectedRoute';
// import Chat from './Components/Chat/Chat'; 
import { Grid } from "@mui/material";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Components/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Avatar, Box } from "@mui/material";
import ProfDashboard from "./Pages/ProfDashboard";
import Courses from "./Components/MyCourse/Courses";
import CourseRegistration from './Pages/CourseRegistration';
import FeesPayment from './Pages/FeePays';
import Scholarship from './Pages/Scholarship';
import Profile from './Pages/Profile'
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './Pages/adminDash';
import Result from './Pages/Result'
import LabSubmission from "./Components/MyCourse/LabSubmission";
import CourseDetails from "./Components/MyCourse/CourseDetails";
import FeePayments from './Components/FeesPayment/FeePayments';
import NotFound from './Components/404NotFound';
import AboutUs from './Components/AbousUs/AboutUs';
function Layout() {
  const navigate = useNavigate();
	let role = null;
	try {
		const stored = localStorage.getItem('userInfo');
		const parsed = stored ? JSON.parse(stored) : null;
		role = parsed?.role || null;
	} catch (err) {
		role = null;
	}
    const handleAvatarClick = () => {
        navigate('/Profile'); // Navigate to the profile page
    };

  	return (
		<Grid container spacing={2}>
			<Grid item md={2.5} xs={3} sm={2} >
        <Navbar />
      </Grid>

			<Grid item md={8.5} xs={7} sm={8} sx={{ position: "relative" }} >
				
				<Outlet />
			</Grid>
			<Grid item md={1} xs={2} sm={2} sx={{ position: "relative" }} >
			<Box
					sx={{
						position: "fixed",
						top: 0,
						right: 0,
						padding: "16px",
						display: "flex",
					}}
				>
					{
            role === 'student' && <Avatar alt="User image" src="./favicon.ico"onClick={handleAvatarClick} 
            style={{ cursor: "pointer" }}/>
          }
					
					{/* <Chat></Chat> */}

				</Box>
			</Grid>
		</Grid>
	);
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
	},
	{
		path: "/AboutUs",
		element: (
			<ProtectedRoute element={AboutUs} allowedRoles={["faculty", "student"]} />
		),
	},
	{
		element: <Layout />,
		children: [
			// {
			//   path: '/',
			//   element: <Dashboard />,
			// },
			{
				path: "/dashboard",
				element: (
					<ProtectedRoute element={Dashboard} allowedRoles={["student"]} />
				),
			},

			{
				path: "/ProfDashboard",
				element: (
					<ProtectedRoute element={ProfDashboard} allowedRoles={["faculty"]} />
				),
			},

			{
				path: "/Mycourses",
				element: (
					<ProtectedRoute
						element={Courses}
						allowedRoles={["faculty", "student"]}
					/>
				),
			},
			{
				path: "/Mycourses/:course_id",
				element: (
					<ProtectedRoute
						element={CourseDetails}
						allowedRoles={["faculty", "student"]}
					/>
				),
			},
			{
				path: "/CourseRegistration",
				element: (
					<ProtectedRoute
						element={CourseRegistration}
						allowedRoles={["student"]}
					/>
				),
			},
			{
				path: "/FeesPayment",
				element: (
					<ProtectedRoute element={FeePayments} allowedRoles={["student"]} />
				),
			},
			{
				path: "/scholarship",
				element: (
					<ProtectedRoute element={Scholarship} allowedRoles={["student"]} />
				),
			},
			{
				path: "/Profile",
				element: (
					<ProtectedRoute
						element={Profile}
						allowedRoles={["faculty", "admin", "student"]}
					/>
				),
			},
			{
				path: "/Result",
				element: <ProtectedRoute element={Result} allowedRoles={["student"]} />,
			},
			{
				path: "/adminDashboard",
				element: (
					<ProtectedRoute element={AdminDashboard} allowedRoles={["admin"]} />
				),
			},
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
]);


function App() {
	return (
		<>
    
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<RouterProvider router={router}></RouterProvider>
			</ThemeProvider>
      
		</>
	);
}
Layout.propTypes = {};
export default App;

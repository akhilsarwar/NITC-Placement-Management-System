import Home from './pages/home.js'
import AboutUs from './pages/aboutUs.js';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate} from "react-router-dom";
import NavBar from './components/navbar.js';
import Login from './pages/login.js';
import SignUp from './pages/signup.js';
import { AuthProvider } from './context/AuthContext.js';
import PrivateRoute from './components/PrivateRoute.js';
import ResetPassword from './pages/passwordReset.js';
import UpdateProfile from './pages/updateProfile.js';
import UserInfo from './pages/userInfo.js';
import AddRecruiter from './pages/addRecruiter.js';
import Recruiter from './pages/recruiter.js';
import ViewRecruiter from './pages/viewRecruiter.js';


function App() {
  return (
    
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element = {<PrivateRoute><NavBar/><Home/></PrivateRoute>} />
            <Route path='/aboutUs' element = {<PrivateRoute><NavBar/><AboutUs/></PrivateRoute>} />
            <Route path='/userInfo' element = {<PrivateRoute><NavBar/><UserInfo/></PrivateRoute>}/>
            <Route path='/updateProfile' element = {<PrivateRoute><NavBar/><UpdateProfile/></PrivateRoute>}/>
            <Route path='/addRecruiter' element = {<PrivateRoute><NavBar/><AddRecruiter/></PrivateRoute>}/>
            <Route path='/viewRecruiter' element = {<PrivateRoute><NavBar/><ViewRecruiter/></PrivateRoute>}/>
            <Route path='/recruiter' element = {<PrivateRoute><NavBar/><Recruiter/></PrivateRoute>}/>
            <Route path='/login' element = {<Login/>} />
            <Route path='/signup' element = {<SignUp/>}/>
            <Route path='/resetPassword' element = {<ResetPassword/>}/>
          </Routes>
          
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

import Home from './pages/home.js'
import AboutUs from './pages/aboutUs.js';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate} from "react-router-dom";
import NavBar from './components/navbar.js';
import Login from './pages/login.js';
import SignUp from './pages/signup.js';
import { AuthProvider } from './context/AuthContext.js';
import PrivateRoute from './components/PrivateRoute.js';
import ResetPassword from './pages/passwordReset.js';
import UserInfoStudent from './pages/userInfoStudent.js';
import UpdateProfile from './pages/updateProfile.js';

function App() {
  return (
    
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element = {<PrivateRoute><NavBar/><Home/></PrivateRoute>} />
            <Route path='/aboutUs' element = {<PrivateRoute><NavBar/><AboutUs/></PrivateRoute>} />
            <Route path='/userInfoStudent' element = {<PrivateRoute><NavBar/><UserInfoStudent/></PrivateRoute>}/>
            <Route path='/updateProfile' element = {<PrivateRoute><NavBar/><UpdateProfile/></PrivateRoute>}/>
            
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

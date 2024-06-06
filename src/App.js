import { Routes, Route } from 'react-router-dom';
import React, { useContext} from 'react'

import './App.css';
import logo from './TaskTrackLogo.png';
import HomePage from './Pages/HomePage';
import LoginSignUpPage from './Pages/LoginSignUpPage';
import { Firebase } from './Context/Firebase';
import CreateTaskPage from './Pages/CreateTaskPage';

function App() {
  const {isLoggedIn}=useContext(Firebase);
  return (
    <div className="wrapper app">
      <div className='navbar'>
        <div className='logo'>
          <img src={logo} alt='logo img' />
        </div>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {isLoggedIn?(<Route path="/createtask" element={<CreateTaskPage/>} />):(<>
        <Route path="/login" element={<LoginSignUpPage auth="login" />} />
        <Route path="/signup" element={<LoginSignUpPage auth="signup" />} />
        </>)}
        
      </Routes>
    </div>
  );
}

export default App;

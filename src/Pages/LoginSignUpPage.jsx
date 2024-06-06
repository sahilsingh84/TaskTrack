import React, { useContext, useState, useEffect } from 'react';
import { Firebase } from '../Context/Firebase';
import { useNavigate } from 'react-router-dom';

const LoginSignUpPage = ({ auth }) => {
  const { login, setLogin, auth: firebaseAuth,signupwithEmailAndPassword,signInWithEmailAndPass, signinWithGoogle, isLoggedIn,user} = useContext(Firebase);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate=useNavigate();

  useEffect(() => {
    if (auth === "signup") {
      setLogin(false);
    } else if (auth === "login") {
      setLogin(true);
    }
  }, [auth, setLogin]);

  const clickHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(()=>{
      if(isLoggedIn) navigate("/");
  },[isLoggedIn])

  const submitHandler = async (e) => {
    e.preventDefault();
    if (login) {
      const loginRes=await signInWithEmailAndPass(formData.email,formData.password);
    } else {
        const result=await signupwithEmailAndPassword(formData.email,formData.password);
    }
  };

  const authwithGoogle = async () => {
        const googleauth=await signinWithGoogle();
  }

  return (
   <div className='loginPage contentPart'>
      <div className='leftPart'>
        <div className='Heading'>{login ? "LogIn" : "SignUp"}</div>
        {!login && (
          <div className='FormInput'>
            <label htmlFor='name'>Name</label>
            <input
              type="text"
              id='name'
              name='name'
              placeholder='Enter Your Name'
              value={formData.name}
              onChange={clickHandler}
              required
            />
          </div>
        )}
        <div className='FormInput'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={clickHandler}
            required
          />
        </div>
        <div className='FormInput'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='Enter Password'
            value={formData.password}
            onChange={clickHandler}
            required
          />
        </div>
        <div className='buttons'>
          <div className='signup' onClick={submitHandler}>{login ? "Login" : "SignUp"}</div>
        </div>
        <div className='buttons'>
          <div className='signup withGoogle' onClick={authwithGoogle}>{login ? "Login" : "SignUp"} With <img src="googleIcon.png"></img></div>
        </div>
      </div>
      <div className='rightPart'>
        <div className='rightPartImage'>
          <img src="loginImage.png" alt="loginImageImage" />
        </div>
      </div>
    </div>
   
  );
}

export default LoginSignUpPage;

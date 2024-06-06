import React, { useContext} from 'react'
import { TypeAnimation } from 'react-type-animation'
import { useNavigate } from 'react-router-dom'
import { Firebase } from '../Context/Firebase'

const HomePage = () => {
  const {setLogin}=useContext(Firebase);
  const navigate=useNavigate();


  const clickHandlerSignup=()=>{
        setLogin(false);
        navigate("/signup");
  }
  const clickHandlerLogin=()=>{
    setLogin(true);
    navigate("/login");
  }
  const {isLoggedIn}=useContext(Firebase);

  return (
         
           <div className='contentPart'>
            
            <div className='leftPart'>
                <div className='Heading'>TaskTrack : <span className='movingCharacter'> 
                <TypeAnimation
                    sequence={["Organize Your Day, Master Your Life",3000,""]}
                    repeat={Infinity}
                    // omitDeletionAnimation={true}      
                ></TypeAnimation></span></div>
                <div className='Paragraph'>Effortlessly manage tasks, stay organized, and achieve your goals with TaskTrack.</div>
                {isLoggedIn?(<div className='buttons'>
          <div className='signup' onClick={()=>navigate("/createtask")}>Create Task</div>
        </div>):(<div className='buttons'>
                     <div className='signup' onClick={()=>clickHandlerSignup()}>SignUp</div>
                     <div className='login' onClick={()=>clickHandlerLogin()}>LogIn</div>
                </div>)}
            </div>
            <div className='rightPart'>
                   <div className='rightPartImage'>
                       <img src="girlImage.png" alt="girlImage"/>
                   </div>
            </div>
         </div>
        
  )
}

export default HomePage

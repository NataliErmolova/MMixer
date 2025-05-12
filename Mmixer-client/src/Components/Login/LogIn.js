import { useNavigate } from 'react-router';
import './LogIn.css';
import { useState } from 'react';
import RegisterUser from '../../API/User/RegisterUser';
import LoginUser from '../../API/User/LoginUser';

function LogIn({setIsAuthenticated}){
 const[isRegister, setIsRegister] = useState(false);

 const[email, setEmail] = useState('');
 const[password, setPassword] = useState('');
 const[confirmPassword, setConfirmPassword] = useState('');
 const[error, setError] = useState(false);
 const[username, setUsername] = useState('');
 const[userid, setUserId] = useState('');

 const navigate = useNavigate();

  async function confirmAccount(){  
    console.log("Form values at submission:", { email, password });
    try{
      if(isRegister){
        if(!email.includes("@gmail.com")){
          alert("A gmail account must be used!");
          setError(true);
          return;
        }else{
          setError(false);
        }
        if(password.length < 8){
          alert("Password isnt long enough!");
          setError(true);
          return;
        } else {
          setError(false);
        }
        if(confirmPassword !== password){
          alert("Passwords do not match!")
          setError(true);
          return;
        } else {
          setError(false);
        }
          const registerResult = await RegisterUser(username, email, password);

          if (registerResult && registerResult.response) {
            setIsAuthenticated(true);
            setUserId(registerResult.response); 
            navigate('/');                   
          } else {
            alert("Registration failed: No user ID returned.");
          }

      } else {
        if ((!username && !email) || !password) {
          alert("Please enter your credentials");
          return;
        }

        console.log("PAASSWOOOOORDDDD: ", password);
        const result = await LoginUser(email, password);
        console.log("Login result:", result);
        
        if (result && result.user_id) {
            setUserId(result.user_id);
            setIsAuthenticated(true);
            navigate('/');
        } else {
            alert("Login failed: Invalid response from server");
        }
      }
    } catch (error) {
      alert("Authentication failed: " + error.message);
      // Don't set isAuthenticated to true when there's an error
  }
  }



  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      confirmAccount();
    }
  }

 return (
    <div className='LogIn'>
      <div className={`login-container ${isRegister ? 'register' : 'log-in'}`}>
        <div className={isRegister ? 'register' : 'log-in'}>
          <button 
            onClick={() => setIsRegister(false)} 
            className='log-in-button'
          >Log in</button>
          <button 
            onClick={() => setIsRegister(true)} 
            className='register-button'
          >Register</button>
        </div>
        <input placeholder="Enter New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}></input>
        <input placeholder={isRegister ? "Enter email" : "Enter email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}></input>


        <input type="password" placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}/>



        <input type="password" placeholder='Confirm password'
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        ></input>

        <button className='confirmation-btn' onClick={() => 
          {console.log("Confirm button clicked");
        console.log("PAASSWOOOOORDDDD: ", {password});

          confirmAccount()}}>Confirm</button>

        <button className='forgot-pass'>Forgot Your password?</button>
      </div>
    </div>
  );
};

export default LogIn;
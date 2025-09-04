import React, { useContext } from 'react'
import assets from '../assets/assets'
import { useState } from 'react'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {

  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if(currentState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }

    login(currentState === "Sign Up" ? 'signup' : 'login', {fullName, email, password, bio});
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
        <img src={assets.logo_big} alt="" className='w-[min(30vh,250px)]' />

        <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
            <h2 className='font-medium text-2xl flex justify-between items-center'>
              {currentState}
              {isDataSubmitted && (
                <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />
              )}
            </h2>
            {currentState === "Sign Up" && !isDataSubmitted && (
              <input
              onChange={(event) => setFullName(event.target.value)}
              value={fullName} 
              type="text" 
              className='p-2 border border-gray-500 rounded-md focus:outline-none' 
              placeholder='Full Name' 
              required 
              />
            )}
            {!isDataSubmitted && (
              <>
                <input 
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                type="email"
                placeholder='Email Address' 
                className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                required 
                />
                <input 
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                type="password"
                placeholder='Password' 
                className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                required
                />
              </>
            )}

            {currentState === "Sign Up" && isDataSubmitted && (
              <textarea
              onChange={(event) => setBio(event.target.value)} 
              value={bio}
              rows={4} 
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Provide a short bio...'
              required
              ></textarea>
            )}

            <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
              {currentState === "Sign Up" ? "Create Account" : "Login"}
            </button>

            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <input type="checkbox" />
              <p>Agree to the terms of use and Privacy Policy.</p>
            </div>

            <div className='flex flex-col gap-2'>
              {currentState === "Sign Up" ? (
                <p className='text-sm text-gray-600'>Already have an account? <span onClick={() => {setCurrentState("Login"); setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Login Here</span></p>
              ) : (
                <p className='text-sm text-gray-600'>Create an account <span onClick={() => {setCurrentState("Sign Up")}} className='font-medium text-violet-500 cursor-pointer'>Click Here</span></p>
              )}
            </div>

        </form>
    </div>
  )
}

export default LoginPage
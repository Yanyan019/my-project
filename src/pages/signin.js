import React, { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import taskifyLogo from '../img/signinlog.svg';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
/* import '../pages/signin.css'; */

const Signin = () => {
  const { googleSignIn, user } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/Home');
    }
  }, [navigate, user]);

  return (
    <div className='flex items-center justify-center h-screen bg-gray-200'>
      <form className='flex flex-col items-center p-10 bg-white rounded shadow-md'>
        <img className='w-24 h-24 mb-5' src={taskifyLogo} alt='Taskify Logo' />
        <p className='mb-5 text-center text-gray-600'>Get organized, Achieve more <br /> with Taskify</p>
        <button onClick={handleGoogleSignIn} className='flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500'>
          <FcGoogle className='mr-2'/> Continue with Google
        </button>
      </form>
    </div>
  );
};

export default Signin;

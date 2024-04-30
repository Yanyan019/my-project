import React, { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import taskifyLogo from '../img/signinlog.svg';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../pages/signin.css';

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
    <div className='container-signin'>
      <form className='signin-box'>
        <img src={taskifyLogo} alt='Taskify Logo' />
        <p>Get organized, Achieve more <br /> with Taskify</p>
        <button onClick={handleGoogleSignIn}><FcGoogle/> Continue with Google</button>
      </form>
    </div>
  );
};

export default Signin;

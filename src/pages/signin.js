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
    <div className='signin'>
      <div className='container'>
        <div className='content'>
          <img src={taskifyLogo} alt='Taskify Logo' className='logo' />
          <p>Get organized, Achieve more <br /> with Taskify</p>
        </div>
        <div className='button-signin'>
          <button onClick={handleGoogleSignIn}>
            <FcGoogle /> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;

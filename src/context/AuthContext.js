import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, signOut,  signInWithPopup} from 'firebase/auth';
import { auth } from './firebaseconfig';



const AuthContext = createContext({
  user: null,
  setUser: (user) => {},
  logOut: () => {}, // Add logOut to exports
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

   const logOut = async () => {
    // Your logout logic here
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn,logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext };

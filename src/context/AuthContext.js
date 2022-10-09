import React, {useContext, useEffect, useState} from "react";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider ({children}) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState();

    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password)
    }   

    function signUp (email, password){
        return auth.createUserWithEmailAndPassword(email, password);
    }

    function logout (){
        return auth.signOut();
    }

    function resetPassword(email){
        return auth.sendPasswordResetEmail(email);
    }

    async function getUserRole(uid){
        const docRef = doc(db, "Roles", uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            return docSnap.data().role;
        }
        else{
            console.log('Role fetching failed for ' + uid);
            return null;
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            setCurrentUser(user);
            console.log('auth state changed');
            if(user){
                let userRole = await getUserRole(user.uid);
                console.log(userRole);
                setRole(userRole);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signUp,
        login,
        logout,
        resetPassword,
        role
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} 
        </AuthContext.Provider>
    );
}

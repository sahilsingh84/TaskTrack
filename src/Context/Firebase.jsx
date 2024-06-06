import { createContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, addDoc, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export const Firebase = createContext();

const firebaseConfig = {
    apiKey: "AIzaSyDYUlH2rmTzhxZGPFjYZg1TLr9gX3CttI4",
    authDomain: "todo-app-690b6.firebaseapp.com",
    databaseURL: "https://todo-app-690b6-default-rtdb.firebaseio.com",
    projectId: "todo-app-690b6",
    storageBucket: "todo-app-690b6.appspot.com",
    messagingSenderId: "10104227712",
    appId: "1:10104227712:web:187989d3504dc696456365",
    measurementId: "G-P226MHBKP3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuth = new GoogleAuthProvider();
const firestore = getFirestore(app);

const FirebaseProvider = ({ children }) => {
    const [login, setLogin] = useState(true);
    const [user, setUser] = useState(null);

    const signupwithEmailAndPassword = (email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                console.log('Signup successful:', userCredential);
            })
            .catch(error => {
                console.error('Error signing up:', error);
            });
    };

    const signInWithEmailAndPass = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                console.log('Signin successful:', userCredential);
            })
            .catch(error => {
                console.error('Error Login up:', error);
            });
    };

    const signinWithGoogle = () => {
        signInWithPopup(auth, googleAuth);
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) setUser(user);
            else setUser(null);
        })
    }, []);

    const addTaskToDatabase = async (taskName, taskDescription, date) => {
        return await addDoc(collection(firestore, "tasks"), {
            taskName: taskName,
            taskDescription: taskDescription,
            date: date,
            email: user.email,
            completed: false // Ensure the completed field is always set
        });
    };

    const getTasksByDate = async (email, date) => {
        const tasksRef = collection(firestore, "tasks");
        const q = query(tasksRef, where("email", "==", email), where("date", "==", date));
        const querySnapshot = await getDocs(q);
        const tasks = [];
        querySnapshot.forEach((doc) => {
            tasks.push({ id: doc.id, completed: false, ...doc.data() });
        });
        return tasks;
    };

    const updateTaskInDatabase = async (taskId, taskName, taskDescription, completed) => {
        const taskRef = doc(firestore, "tasks", taskId);
        await updateDoc(taskRef, {
            taskName: taskName,
            taskDescription: taskDescription,
            completed: completed
        });
    };

    const deleteTaskFromDatabase = async (taskId) => {
        const taskRef = doc(firestore, "tasks", taskId);
        await deleteDoc(taskRef);
    };

    const isLoggedIn = user ? true : false;

    const value = { login, setLogin, auth, signupwithEmailAndPassword, signInWithEmailAndPass, signinWithGoogle, isLoggedIn, user, addTaskToDatabase, getTasksByDate, updateTaskInDatabase, deleteTaskFromDatabase };
    return (
        <Firebase.Provider value={value}>
            {children}
        </Firebase.Provider>
    );
}

export default FirebaseProvider;

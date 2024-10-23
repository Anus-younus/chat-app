import { useEffect, useState } from 'react'
import AppRouter from './config/routes'
import './index.css';  // Make sure this line exists
import User from './context/user'
import { Provider } from 'react-redux'
import { db, auth, doc, getDoc, onAuthStateChanged } from './config/firebase'
import { BrowserRouter } from "react-router-dom";

function App() {
  const [user, setUser] = useState({})

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data())
        } else {
          console.log("No such document!");
        }
      }
    })
  }, [])
  return (
    <BrowserRouter>
        <User.Provider value={{ user }}>
          <AppRouter />
        </User.Provider>
    </BrowserRouter>
  )
}

export default App
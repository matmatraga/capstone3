import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavBar from './components/AppNavbar';
import Home from './pages/Home';
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Products from './pages/Products';
import Specific from './pages/Specific';
import Profile from './pages/Profile';
import MyCart from './pages/MyCart';
import Orders from './pages/Orders';
import Error from './pages/Error';
import './App.css';
import 'bootswatch/dist/cosmo/bootstrap.min.css';
import { UserProvider } from './context/UserContext';

export default function App() {

    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    useEffect(() => {
        fetch(`${ import.meta.env.VITE_API_URL }/users/details`, {
            headers: { Authorization: `Bearer ${ localStorage.getItem('token') }`}
        })
        .then(res => res.json())
        .then(data => {

            if (typeof data._id !== 'undefined') {
                setUser({ id: data._id, isAdmin: data.isAdmin });
            } else {
                setUser({ id: null, isAdmin: null });
            }
        })

    }, [])

  return (
    <UserProvider value={{user, setUser}}>
        <Router>
            <AppNavBar />
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/products" element={<Products />}/>
                <Route path="/products/:productId" element={<Specific />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/cart" element={<MyCart />}/>
                <Route path="/orders" element={<Orders />}/>
                <Route path="/logout" element={<Logout />}/>
                <Route element={Error}/>
            </Routes>
        </Router>
    </UserProvider>
  );
}

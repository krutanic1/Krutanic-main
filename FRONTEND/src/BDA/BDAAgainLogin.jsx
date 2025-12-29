import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link , useNavigate } from 'react-router-dom';
import API from '../API';
import axios from "axios";

const BDAAgainLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API}/checkbdaauth`, {
                email, password,
            });
            if (response.status === 200) {
                toast.success('Login successful!');
                 const loginTime = new Date().getTime();
                setTimeout(() => {
                localStorage.setItem("bdaId", response.data.bdaId);
                localStorage.setItem("bdaName", response.data.bdaName);
                localStorage.setItem("bdaToken", response.data.token);
                 localStorage.setItem("sessionStartTime", loginTime);
                navigate("/Home");
                }, 1500);
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error('An error occurred while logging in');
        }
    };

    return (
        <div id='loginpage'>
            <Toaster position="top-center" reverseOrder={false} />
            <div className='loginform'>
                <h2>BDA Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Company Email:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder='Enter company mail id '
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            required
                            placeholder='Enter your password'
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button type='submit'>Login</button>
                    </div>
                </form>
                <p>--------------------or--------------------</p>
                <div className='loginwith'>
                    <Link to="/BDALogin">Login with OTP</Link>
                </div>
            </div>
        </div>
    );
};

export default BDAAgainLogin;

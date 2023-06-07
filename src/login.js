import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GetComments from './getComments';
import { API_BASE_URL, USERS_ENDPOINT } from './api';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);

  
  const usersUrl = `${API_BASE_URL}:3500${USERS_ENDPOINT}`;

  useEffect(() => {
    axios
      .get(usersUrl)
      .then(response => {
        setExistingUsers(response.data)
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user && user !== '{}') {
      setIsLoggedIn(true);
    }
    /*const a = existingUsers.map(existingUser => {
      console.log(existingUser.username);
    });*/
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userExists = existingUsers.some(existingUser => existingUser.username === username);
    
    if (userExists) {
        const existingUser = existingUsers.find(existingUser => existingUser.username === username);
        localStorage.setItem('user', JSON.stringify(existingUser));
        setIsLoggedIn(true);
        return;
    }
  
    try {
      const response = await fetch(usersUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
          const user = await response.json();
          localStorage.setItem('user', JSON.stringify(user));
          setIsLoggedIn(true);
      } else {
          console.log('Error:', response.status);
      }
    } catch (error) {
        console.log('Error:', error);
    }
  };

  if (isLoggedIn) {
    return <GetComments/>
  }

  return (
    <div className='form-wrapper'>
      <form className='loginForm' onSubmit={handleSubmit}>
        <div className='form-col'>
          <label>
            <span>
              Username:
            </span>
            <input
              type="text"
              placeholder='enter username'
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div className='form-col'>
          <label>
            <span>
              Password:
            </span>
            <input
              type="password"
              placeholder='enter password'
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div className='sbm-button-center'>
          <button type="submit" className='sbm-button'>Submit</button>
        </div>
      </form>
    </div>
    
  );
}

export default LoginForm;
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../static/appStrings';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const SignUpForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [hasSocialAuthLogin, sethasSocialAuthLogin] = useState(false);

  const submitForm = event => {
    event.preventDefault();

    if (password1 !== password2) {
      alert('Passwords are not the same. Please fix.');
      setPassword1('');
      setPassword2('');
      return;
    }

    const options: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `email=${email}&password=${password1}&currentCity=${currentCity}&hasSocialAuthLogin=${hasSocialAuthLogin}`
    };

    fetch(url + 'signup', options)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            // TODO: Remove these
            alert('SignUp 404 Error');
          }
          if (response.status === 401) {
            // TODO: Remove these
            alert('SignUp 401 Error');
          }
        }
        return response;
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.cookie = 'signedin=true';
          window.location.replace(url + 'main');
        }
      })
  }

  return (
    <div>
      <form onSubmit={submitForm}>
        <p>Email: <input type="text" onChange={event => setEmail(event.target.value)} autoComplete="on" required /></p>
        <p>Current City: <input type="text" onChange={event => setCurrentCity(event.target.value)} required /></p>
        <p>Password: <input type="password" onChange={event => setPassword1(event.target.value)} value={password1} required /></p>
        <p>Re-enter Password: <input type="password" onChange={event => setPassword2(event.target.value)} value={password2} required /></p>
        <p><button type="submit">Sign Up</button></p>
      </form>
    </div>
  )
}

export default SignUpForm
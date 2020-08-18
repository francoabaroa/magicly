import React, { useState } from 'react';
import { useRouter } from 'next/router';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = 'http://localhost:3000/signin';
} else {
  url = 'https://magiclyapp.herokuapp.com/signin';
}

const Form = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = event => {
    event.preventDefault();

    const options: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `email=${email}&password=${password}`
    };

    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            // TODO: Remove these
            alert('Email not found, please retry');
          }
          if (response.status === 401) {
            // TODO: Remove these
            alert('Email and password do not match, please retry');
          }
        }
        return response;
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.cookie = 'signedin=true';
          router.push('/main', undefined, { shallow: true });
        }
      })
  }

  return (
    <div>
      <form onSubmit={submitForm}>
        <p>Email: <input type="text" onChange={event => setEmail(event.target.value)} autoComplete="on" required /></p>
        <p>Password: <input type="password" onChange={event => setPassword(event.target.value)} autoComplete="on" required /></p>
        <p><button type="submit">Sign In</button></p>
      </form>
    </div>
  )
}

export default Form
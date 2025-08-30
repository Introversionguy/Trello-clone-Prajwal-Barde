import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Auth(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = () => {
    console.log('Signup',email,'Email',password,'Password')
    createUserWithEmailAndPassword(auth, email, password)
      .then((Credential) => {
        props.onLogin(Credential.user);
      })
      .catch((err) => {
        console.log(err,'Error');
        alert(err.message);
      });
  };

  const login = () => {
    console.log('Login',email,'Email',password,'Password')
    signInWithEmailAndPassword(auth, email, password)
      .then((Credential) => {
        props.onLogin(Credential.user);
      })
      .catch((err) => {
       console.log(err,'Error');
        alert(err.message);
      });
  };

  return (
     <div className="card w-25 mx-auto mt-5">
     <div className="d-flex flex-column card-body">
     <h3>Login / Signup </h3>
      <input className="form-control mb-2" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="form-control mb-2" type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary mb-2" onClick={signup}>Sign Up</button>
      <button className="btn btn-success" onClick={login}>Log In</button>
    </div>
    </div>
  );
}

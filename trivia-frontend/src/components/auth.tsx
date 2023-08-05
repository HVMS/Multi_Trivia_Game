import React from 'react';
import  {auth, db}  from '../firebase-config/firebase-config';
import {  signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import '../components/User_Registration/register.css'
import { useState } from 'react';
import { Formik,Form } from 'formik';
import { collection, getDocs, addDoc } from '@firebase/firestore';

export const Auth = () => {
    const googleProvider = new GoogleAuthProvider();
    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
                console.log(user);
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
            });
    }
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [answerOne, setAnswerOne] = useState('');
    const [answerTwo, setAnswerTwo] = useState('');
    const [answerThree, setAnswerThree] = useState('');

    const facebookProvider = new FacebookAuthProvider();
    const signInWithFacebook = () => {
        signInWithPopup(auth, facebookProvider)
            .then((result) => {
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential?.accessToken;
                const user = result.user;
                console.log(user);

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = FacebookAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
            });
    }


    const Signup =  (e:any) => {
        e.preventDefault();
        console.log(email, password);
         createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user);
                const userDataRef= collection(db, 'UserData');
                //add user to firestore database
                const data = await getDocs(userDataRef);
                console.log(data);
                await addDoc(userDataRef, {
                    email: email,
                    password: password,
                    answerOne: answerOne,
                    answerTwo: answerThree,
                    answerThree: answerThree,
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                
            });
    }

    return (
        <div className='register-body'>
            <div className='register-container'>
                <Formik                     
                initialValues={{email:'',password:''}}
                    onSubmit={Signup}>
                    <Form>
                    <div className='form-group' style={{marginRight:'30px'}}>
                    <input type="text" placeholder="Email" onChange={(e)=> setEmail(e.target.value)}/>
                    <br/>
                    <br/>
                    <input type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)}/>
                    <br/>
                    <br/>
                    <label className='register-label'>Question one: Where were you born?</label>
                    <input type="text" placeholder='answer one...' required={true} onChange={(e)=>setAnswerOne(e.target.value)}/>
                    <br/>
                    <br/>
                    <label className='register-label'>Question two: What is your favorite color?</label>
                    <input type="text" placeholder='answer two...' required={true} onChange={(e)=>setAnswerThree(e.target.value)}/>
                    <br/>
                    <br/>
                    <label className='register-label'>Question three: What is your favorite food?</label>
                    <input type="text" placeholder='answer three...' required={true} onChange={(e)=>setAnswerThree(e.target.value)}/>
                    <br/>
                    <br/>
                    <button type="submit" className='register-button' onClick={Signup}>Sign up</button>
                    <br/>
                    <br/>
                    <br/>

                    <div className='social-login'>
                        <button className='social-login-button' onClick={signInWithGoogle}>
                            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Logo_Gmail_%282015-2020%29.svg/512px-Logo_Gmail_%282015-2020%29.svg.png?20161130183601' alt="Gmail Logo" style={{ maxHeight: '25px', maxWidth: '25px' }} />
                            Signup with Gmail</button>
                            <br/>
                
                        <button className='social-login-button' onClick={signInWithFacebook}>
                            <img src='https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/1920px-Facebook_f_logo_%282021%29.svg.png?20210818083032' alt="Facebook Logo" style={{ maxHeight: '25px', maxWidth: '25px' }} />
                            Signup with Facebook</button>
                    </div>
                </div>
                    </Form>
                </Formik>

            </div>
        </div>
    )
}

export default Auth;


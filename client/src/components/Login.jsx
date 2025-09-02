import React, { useState , useEffect} from "react";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
// eslint-disable-next-line
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("login");
  const {setShowLogin, backendURL,setToken,setUser} = useContext(AppContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      if(state === 'login'){
        // login api call
        const {data} =  await axios.post(backendURL + '/api/users/login', {
          email, password});

          if(data.success){
             setToken(data.token);
             setUser(data.user);
              localStorage.setItem('token', data.token);
              setShowLogin(false);
          }else{
            toast.error(data.message, { autoClose: 3000 });
          }
      }else{
        // signup api call
        const {data} =  await axios.post(backendURL + '/api/users/register', {
          name, email, password});

          if(data.success){
             setToken(data.token);
             setUser(data.user);
              localStorage.setItem('token', data.token);
              setShowLogin(false);
          }else{
            toast.error(data.message, { autoClose: 3000 });
          }
      }

    } catch (error) {
      console.log("Error in login/signup", error);
    }
  }

   useEffect(() => {

    document.body.style.overflow ='hidden';

    return () => {
      document.body.style.overflow = 'unset';
    }


  },[])




  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form onSubmit={onSubmitHandler}
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-white p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state !== "login" && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <img width={20} src={assets.profile_icon} alt=""></img>
            <input onChange={(e) => setName(e.target.value)} value = {name}
              type="text"
              className="outline-none text-sm"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img width={20} src={assets.email_icon} alt=""></img>
          <input  onChange={(e) => setEmail(e.target.value)} value = {email}
            type="email"
            className="outline-none text-sm"
            placeholder="Email Id"
            required
          />
        </div>
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img width={15} src={assets.lock_icon} alt=""></img>
          <input  onChange={(e) => setPassword(e.target.value)} value = {password}
            type="password"
            className="outline-none text-sm"
            placeholder="Password"
            required
          />
        </div>

        <p className="text-sm text-blue-600 my-4 cursor-pointer">
          Forget Password?
        </p>

        <button className="bg-blue-600 w-full text-white py-2 rounded-full cursor-pointer">
          {state === "login" ? "login" : "create account"}
        </button>

        { state === 'login' ? <p className="mt-5 text-center">
          Don't have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => setState('signup')}>Sign up</span>
        </p> :
        <p className="mt-5 text-center">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => setState('login')}>Login</span>
        </p>}

        <img onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
        />
      </motion.form>
    </div>
  );
};

export default Login;

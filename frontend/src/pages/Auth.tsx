import { useState } from "react";
import { CiLock, CiUser } from "react-icons/ci";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { APIError } from "../api/client";

export default function Auth() {
    
    const [ mode, setMode ] = useState<'login' | 'register'>('login');
    const [ formData, setFormData ] = useState({
        email: "",
        password: ""
    });
    const [ error, setError ] = useState<String | null>(null);
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const storeLogin = useAuthStore((state) => state.login)

    const navigate = useNavigate();

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async(e: any) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await login(formData);
            storeLogin(response.access_token, response.user);
            navigate('/');
        } catch (err) {
            if (err instanceof APIError) {
                setError(err.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return(
        <div className="bg-page-bg h-screen text-center flex flex-col justify-center items-center">

            <div className=" justify-center relative flex items-center w-100 rounded-3xl mb-12 bg-card-bg py-8 px-0 ">
                <button 
                    onClick={() => setMode('login')} 
                    type='button'
                    className={`text-primary-text rounded-md px-4 py-3 w-42 transition-all duration-200 ${
                        mode === 'login' ? 'bg-primary font-bold' : 'bg-elevated-bg'
                    }`}
                >
                    Log In
                </button>


                <button 
                    onClick={()=> setMode('register')} 
                    type="button"
                    className={`text-primary-text rounded-md px-4 py-3 w-42 transition-all duration-200 ${
                        mode === 'register' ? 'bg-primary font-bold' : 'bg-elevated-bg'
                    }`}
                >
                    Sign Up
                </button>
            </div>

            {mode === 'login' &&(
            <div className="bg-card-bg p-20 rounded-3xl h-1/3 flex items-center justify-center" id='login'>

                <form onSubmit={handleSubmit}>
                    <div className="relative flex items-center pb-3">
                        <CiUser className="absolute left-3 text-primary-text" />
                        <input 
                            onChange={handleChange}
                            value={formData.email}
                            name='email'
                            className="w-full text-primary-text bg-elevated-bg p-2 pl-10 rounded-md" 
                            id='email' 
                            placeholder='Enter Email...' 
                            type='email' 
                        />
                    </div>

                    <div className="relative flex items-center pb-3">
                        <CiLock className="absolute left-3 text-primary-text" />
                        <input 
                            onChange={handleChange}
                            value={formData.password}
                            name='password'
                            className="w-full text-primary-text bg-elevated-bg p-2 pl-10 rounded-md" 
                            id='password' 
                            placeholder='Enter Password...' 
                            type='password' 
                        />
                    </div>

                    <button className="bg-primary text-primary-text font-bold hover:bg-primary-hover p-2 pl-8 pr-8  w-full rounded-4xl cursor-pointer transition-colors" type='submit'>Log In</button>

                </form>
            </div>)}

            {mode === 'register' &&(
            <div className="bg-card-bg p-20 rounded-3xl h-1/3 flex items-center justify-center" id='register'>

                <form>
                    <div className="relative flex items-center pb-3">
                        <CiUser className="absolute left-3 text-primary-text" />
                        <input 
                            className="w-full text-primary-text bg-elevated-bg p-2 pl-10 rounded-md" 
                            id='email' 
                            placeholder='Enter Email...' 
                            type='email' 
                        />
                    </div>

                    <div className="relative flex items-center pb-3">
                        <CiLock className="absolute left-3 text-primary-text" />
                        <input 
                            className="w-full text-primary-text bg-elevated-bg p-2 pl-10 rounded-md" 
                            id='password' 
                            placeholder='Enter Password...' 
                            type='password' 
                        />
                    </div>

                    <div className="relative flex items-center pb-3">
                        <CiLock className="absolute left-3 text-primary-text" />
                        <input 
                            className="w-full text-primary-text bg-elevated-bg p-2 pl-10 rounded-md" 
                            id='password' 
                            placeholder='ReEnter Password...' 
                            type='password' 
                        />
                    </div>

                    <button className="bg-primary text-primary-text font-bold hover:bg-primary-hover p-2 pl-8 pr-8  w-full rounded-4xl cursor-pointer transition-colors" type='submit'>Sign Up</button>

                </form>
            </div>)}

        </div>
    )

}
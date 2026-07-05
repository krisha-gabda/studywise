import { useState } from "react";
import { CiLock, CiUser } from "react-icons/ci";
import { login, register } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { APIError } from "../api/client";
import { getProjects } from "../api/projects";
import { useProjectStore } from "../store/pojectStore";
import { getTopics } from "../api/roadmap";

export default function Auth() {
    
    const [ mode, setMode ] = useState<'login' | 'register'>('login');
    const [ loginFormData, setLoginFormData ] = useState({
        email: "",
        password: ""
    });

    const [ registerFormData, setRegisterFormData ] = useState({
        email: '',
        password: '',
        password_re: ''
    })

    const [ error, setError ] = useState<String | null>(null);
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const storeLogin = useAuthStore((state) => state.login);
    const storeProject = useProjectStore((state) => state.setProjects);

    const projectIds: string[] = [];
    const projectNames: string[] = [];

    const navigate = useNavigate();

    const handleChange = (e: any) => {

        if (mode === 'login') {
            setLoginFormData({
                ...loginFormData,
                [e.target.name]: e.target.value
            })
        } else if (mode === 'register') {
            setRegisterFormData({
                ...registerFormData,
                [e.target.name]: e.target.value
            })
        }
    }

    const handleSubmit = async(e: any) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (mode === 'login') {
                const response = await login(loginFormData);
                storeLogin(response.access_token, response.user);
                navigate('/projects');
            } else if (mode === 'register') {
                if (registerFormData.password === registerFormData.password_re) {

                    const response = await register({
                        email: registerFormData.email, 
                        password: registerFormData.password
                    });
                    
                    if (response) {
                       setMode('login');
                    }
                } else {
                    console.log("The passwords do not match.")
                }

            }
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

    if (error) return <p>An Error occured. Please try again.</p>
    if (isSubmitting) return <p>Loading...</p>

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
                            value={loginFormData.email}
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
                            value={loginFormData.password}
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

                <form onSubmit={handleSubmit}>
                    <div className="relative flex items-center pb-3">
                        <CiUser className="absolute left-3 text-primary-text" />
                        <input 
                            onChange={handleChange}
                            value={registerFormData.email}
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
                            value={registerFormData.password}
                            name='password'
                            className="w-full text-primary-text bg-elevated-bg p-2 pl-10 rounded-md" 
                            id='password' 
                            placeholder='Enter Password...' 
                            type='password' 
                        />
                    </div>

                    <div className="relative flex items-center pb-3">
                        <CiLock className="absolute left-3 text-primary-text" />
                        <input
                            onChange={handleChange}
                            value={registerFormData.password_re}
                            name='password_re'
                            className="w-full text-primary-text bg-elevated-bg p-2 pl-10 rounded-md" 
                            id='password2'
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
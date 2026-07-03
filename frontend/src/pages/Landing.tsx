import { useNavigate } from "react-router-dom"

export default function Landing() {

    const navigate = useNavigate();

    return(
        <div className="bg-page-bg h-screen text-center flex flex-col justify-center items-center">
            <h1 className="font-bold text-8xl text-primary-text p-4">StudyWise</h1>
            <p className="text-secondary-text p-12">Less Cramming. More Understanding.</p>
            <button onClick={() => {navigate('/auth')}} className="bg-primary py-4 text-primary-text px-12 rounded-4xl hover:bg-primary-hover cursor-pointer font-bold">Log In</button>
        </div>
    )
}
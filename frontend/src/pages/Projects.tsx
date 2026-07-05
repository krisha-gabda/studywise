import { useEffect, useState } from "react";
import { useProjectStore } from "../store/pojectStore"
import { getProjects } from "../api/projects";
import { APIError } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Projects() {

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<null | string>(null);

    const storeProject = useProjectStore((state) => state.setProjects);
    const projects = useProjectStore((state) => state.projects);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            setLoading(true);
            
            async function projectApiCall() {
                const response = await getProjects();
                storeProject(response);
            }
            // Using another function because react expects the fallback to be a normal function
            projectApiCall();
        } catch (err) {
            if (err instanceof APIError) {
                setError(err.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p>An error occured. Please try again.</p>

    return(
        <div className="bg-page-bg h-screen text-center flex flex-col justify-center items-center">
            <h2 className="text-primary-text text-4xl font-bold">Welcome Back</h2>
            <p>Select a project to start learning.</p>

            {/* Create a for loop and display the required project details followed by a project create button and then a project create component. Look into how to create a component like a pop up box or something */}

            <div className="flex flex-row gap-2 justify-center items-center">
                {projects.map((project) => (
                    <div className="bg-card-bg w-72 rounded-md h-48 p-5 flex flex-col items-center justify-center text-center">
                        <h3 className="text-primary-text text-2xl font-bold" key={project.id}>{project.name}</h3>

                        <button 
                            className="bg-primary text-primary-text px-3 p-2 mt-4 rounded-2xl font-semiboldbold hover:bg-primary-hover transition-all ease-in cursor-pointer" 
                            type="button" 
                            onClick={() => navigate(`/dashboard/${project.id}`)}
                        >
                            View Project
                        </button>
                    
                    </div>
                ))}
            </div>

        </div>
    )
}
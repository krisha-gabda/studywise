import { useState } from "react"
import { createProject } from "../api/projects";
import { useProjectStore } from "../store/pojectStore";
import { useNavigate } from "react-router-dom";
import { APIError } from "../api/client";
import { getTopics } from "../api/roadmap";
import { useTopicsStore } from "../store/topicsStore";
import { uploadNotes } from "../api/notes";

export default function NewProject() {

    const [ file, setFile ] = useState<File | null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<null | string>(null);
    const navigate = useNavigate();

    const storeCurrentProject = useProjectStore((state) => (state.setCurrentProject));
    const storeTopics = useTopicsStore((state) => (state.setTopics))

    const [projectCreate, setProjectCreate] = useState({
        name: ''
    });

    const handleFileChange = (e: any) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    const handleNameChange = (e: any) => {
        setProjectCreate({
            ...projectCreate,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async(e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await createProject(projectCreate);
            storeCurrentProject(response);

            if (file != null) {
                await uploadNotes(file, response.id);
                const topics = await getTopics(response.id);
                storeTopics(topics);
            } else {
                setError('Please upload file to continue.')
            }
            
            navigate(`/dashboard/${response.id}`);
        } catch (err) {
            if (err instanceof APIError) {
                setError(err.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>An error occured... Please try again...</p>

    return(
        <div className="bg-page-bg h-screen flex flex-col justify-center items-center">
            <h3 className="text-primary-text font-bold text-5xl">Create a new Project</h3>
            <div className="bg-card-bg py-12 h-min-120 w-96 mt-8 rounded-4xl flex justify-center items-center ">
                <form onSubmit={handleSubmit}>
                    <label className="text-primary-text font-bold text-xl mb-2">Project Name:</label>
                    <input 
                        required 
                        value={projectCreate.name}
                        name="name"
                        className="bg-elevated-bg w-full text-secondary-text border-borders-bg rounded-md block mb-12"
                        onChange={handleNameChange} 
                    />

                    <div className="">
                        <p className="text-primary-text font-bold text-xl mb-2">Input Your notes</p>
                        <input 
                            type="file" 
                            multiple
                            required
                            onChange={handleFileChange} 
                            className="bg-elevated-bg w-full text-secondary-text border-borders-bg rounded-md block"
                        />
                        {file && (
                            <div>
                                <p className="text-primary-text text-2xs mt-12 font-bold">File Details:</p>
                                <ul>
                                    <li className="text-primary-text pl-4">Name: {file.name}</li>
                                    <li className="text-primary-text pl-4">Type: {file.type}</li>
                                    <li className="text-primary-text pl-4">Size: {(file.size / 1024).toFixed(2)} KB</li>
                                </ul>
                            </div>
                        )}

                        <button 
                            className="w-full bg-primary mt-12 py-2 rounded-md cursor-pointer hover:bg-primary-hover transition-all ease-in"
                        >
                            Submit
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )
}
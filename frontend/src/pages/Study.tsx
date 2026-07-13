import Markdown from "react-markdown";
import { useTopicsStore } from "../store/topicsStore"
import { useNavigate } from "react-router-dom";

export default function Study() {
    const topic = useTopicsStore((state) => (state.currentTopic));
    const summary = topic.summary;
    const headline = topic.headline;

    const navigate = useNavigate();

    return(
        <div className="bg-page-bg  min-h-screen">
            <h3 className="text-primary-text font-bold text-5xl p-12 pb-6">{topic.name}</h3>
            <hr className=" border-secondary-text mx-12"/>
            <p className="text-primary-text px-12 pt-12 text-2xl "><Markdown>{headline}</Markdown></p>
            <p className="text-secondary-text px-12 pt-2"><Markdown>{summary}</Markdown></p>

            <p className="text-primary-text text-3xl p-12 font-bold">Study This Topic</p>
            <div className="flex flex-row  justify-center items-center gap-4 px-12 pb-12">
                <div className="bg-card-bg w-full p-12  border-t-primary border-t-4">
                    <p className="text-2xl text-primary-text font-bold pb-12">Flashcards</p>
                    <p className="text-secondary-text">Strengthen your understanding by reviewing flashcards</p>
                    <p className="text-secondary-text">Revise like a pro</p>
                    <button
                        type="button"
                        className="bg-primary p-4 rounded-lg mt-8 text-primary-text font-bold hover:bg-primary-hover transition-all ease-in cursor-pointer"
                        onClick={() => navigate(`/projects/${topic.project_id}/study/${topic.id}/flashcards`)}
                    >
                        Start Revising
                    </button>
                </div>
                <div className="bg-card-bg w-full p-12  border-t-primary border-t-4">
                    <p className="text-2xl text-primary-text font-bold pb-12">Take Quiz</p>
                    <p className="text-secondary-text">Test yourself to check your understanding</p>
                    <p className="text-secondary-text">Test your understanding</p>
                    <button 
                        type="button" 
                        className="bg-primary p-4 rounded-lg mt-8 text-primary-text font-bold hover:bg-primary-hover transition-all ease-in cursor-pointer" 
                        onClick={() => navigate(`/projects/${topic.project_id}/study/${topic.id}/quiz`)}
                    >
                        Start Quiz
                    </button>
                </div>
            </div>
        </div>
    )
}
import { useEffect, useState } from "react";
import { useTopicsStore } from "../store/topicsStore"
import getSummary from "../api/study";
import { APIError } from "../api/client";

export default function Study() {
    const topic = useTopicsStore((state) => (state.currentTopic));
    const [ summary, setSummary ] = useState({
        headline: '',
        summary: ''
    });

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<null | string>(null)

    useEffect(() => {
        if (!topic.id || !topic.project_id) {
            setSummary({ headline: '', summary: '' });
            setError(null);
            setLoading(false);
            return;
        }

        const summaryAPICall = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getSummary(topic.id, topic.project_id);
                setSummary(response);
            } catch (err) {
                if (err instanceof APIError) {
                    setError(err.message);
                } else {
                    setError('Something went wrong. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        summaryAPICall();

    }, [topic.id, topic.project_id]);

    if (loading) return <p>Loading...</p>
    if (error) return <p>An error occured. Please try again.</p>

    return(
        <div className="bg-page-bg  min-h-screen">
            <h3 className="text-primary-text font-bold text-5xl p-12 pb-6">{topic.name}</h3>
            <hr className=" border-secondary-text mx-12"/>
            <p className="text-primary-text px-12 pt-12 text-2xl ">{summary.headline}</p>
            <p className="text-secondary-text px-12 pt-2">{summary.summary}</p>

            <p className="text-primary-text text-3xl p-12 font-bold">Study This Topic</p>
            <div className="flex flex-row  justify-center items-center gap-4 px-12 pb-12">
                <div className="bg-card-bg w-full p-12  border-t-primary border-t-4">
                    <p className="text-2xl text-primary-text font-bold pb-12">Flashcards</p>
                    <p className="text-secondary-text">Strengthen your understanding by reviewing flashcards</p>
                    <p className="text-secondary-text">Revise like a pro</p>
                    <button className="bg-primary p-4 rounded-lg mt-8 text-primary-text font-bold hover:bg-primary-hover transition-all ease-in cursor-pointer">Start Revising</button>
                </div>
                <div className="bg-card-bg w-full p-12  border-t-primary border-t-4">
                    <p className="text-2xl text-primary-text font-bold pb-12">Take Quiz</p>
                    <p className="text-secondary-text">Test yourself to check your understanding</p>
                    <p className="text-secondary-text">Test your understanding</p>
                    <button className="bg-primary p-4 rounded-lg mt-8 text-primary-text font-bold hover:bg-primary-hover transition-all ease-in cursor-pointer">Start Quiz</button>
                </div>
            </div>
        </div>
    )
}
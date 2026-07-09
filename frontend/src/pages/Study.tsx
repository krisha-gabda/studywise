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
        <div className="bg-page-bg  min-h-screen flex flex-col justify-center items-center">
            <h3 className="text-primary-text font-bold text-5xl p-12">{topic.name}</h3>
            <p className="text-primary-text">{summary.headline}</p>
            <p className="text-secondary-text">{summary.summary}</p>
        </div>
    )
}
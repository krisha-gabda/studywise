import { useNavigate } from "react-router-dom";
import { useTopicsStore } from "../store/topicsStore"
import type { Topic } from "../types/topic";

export default function Roadmap() {
    const topics = useTopicsStore((state) => (state.topics));
    const storeCurrentTopic = useTopicsStore((state) => (state.setCurrentTopic));
    const navigate = useNavigate();

    const backgroundColors = {
        needs_work: 'bg-danger',
        not_started: 'bg-warning',
        mastered: 'bg-secondary',
        default: 'bg-primary'
    };

    const selectTopic = (topic: Topic) => {
        storeCurrentTopic(topic);
        navigate(`/projects/${topic.project_id}/study/${topic.id}`);
    }

    return(
        <div className="bg-page-bg  min-h-screen flex flex-col justify-center items-center">
            <h3 className="text-primary-text font-bold text-5xl p-12">Roadmap</h3>
            <div className="flex flex-col gap-4 w-4/5">
                {topics.map((topic) => (
                    <div className="bg-card-bg p-4 rounded-2xl flex flex-row w-full">
                        <div className={`w-2 rounded-md ${backgroundColors[topic.status as keyof typeof backgroundColors] || backgroundColors.default}`}></div>
                        <div className="pl-3">
                            <p className="text-primary-text">{topic.name}</p>
                            <p className="text-secondary-text">Status: {topic.status}</p>
                            <p className="text-secondary-text">Priority Score: {topic.priority_score}</p>
                            {topic.last_reviewed_at && (
                                <p className="text-secondary-text">Last Reviewed At: {topic.last_reviewed_at}</p>
                            )}
                        </div>
                        <button type="button" onClick={() => selectTopic(topic)} className={`ml-auto ${backgroundColors[topic.status as keyof typeof backgroundColors]} text-primary-text px-4 rounded-2xl h-16 mr-2 font-bold`}>Start Learning</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
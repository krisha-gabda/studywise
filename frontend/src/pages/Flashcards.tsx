import { useEffect, useState } from "react"
import { useStudyStore } from "../store/studyStore"
import { getFlashcards } from "../api/study";
import { useTopicsStore } from "../store/topicsStore";
import { APIError } from "../api/client";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { sessionResult } from "../api/session";
import { getTopics } from "../api/roadmap";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

export default function Flashcards() {
    const setFlashcards = useStudyStore((state) => state.setFlashcards);
    const topic = useTopicsStore((state) => state.currentTopic);
    const flashcards = useStudyStore((state) => state.flashcards.flashcards);
    const setTopics = useTopicsStore((state) => state.setTopics);

    const [ isFlipped, setIsFlipped ] = useState(false);
    const [ currectIndex, setCurrectIndex ] = useState(0);
    const currentCard = flashcards[currectIndex];
    const [ submit, setSubmit ] = useState(false);
    const [ submitted, setSubmitted ] = useState(false);

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<null | string>(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function flashcardsAPICall() {
            setLoading(true);
            setError(null);
            setCurrectIndex(0);
            setIsFlipped(false);
            setSubmit(false);
            setSubmitted(false);

            try {
                const result = await getFlashcards(topic.id, topic.project_id);
                setFlashcards(result);
            } catch (err) {
                if (err instanceof APIError) {
                    setError(err.message);
                } else {
                    setError('Something went wrong... Please try again...');
                }
            } finally {
                setLoading(false);
            }
        }

        flashcardsAPICall();
    }, [topic.id, topic.project_id, setFlashcards]);

    const handleLeftArrow = () => {
        if (currectIndex !== 0) {
            setCurrectIndex(currectIndex-1);
            setIsFlipped(false);
            setSubmit(false);
        }
    }

    const handleRightArrow = () => {
        if (currectIndex !== flashcards.length-1 && isFlipped) {
            setCurrectIndex(currectIndex + 1);
            setIsFlipped(false);
        }

        if (currectIndex === flashcards.length - 1 && isFlipped) {
            setSubmit(true);
        }
    }

    const submitResult = async (confidence: string) => {
        setLoading(true);
        setError(null);

        try {
            const sessionResults = {
                topic_id: topic.id,
                mode: 'flashcard',
                score: 0,
                confidence: confidence,
            };

            await sessionResult(sessionResults);

            const refreshedTopics = await getTopics(topic.project_id);
            setTopics(refreshedTopics);

            setSubmitted(true);
        } catch (err) {
            if (err instanceof APIError) {
                setError(err.message);
            } else {
                setError('Something went wrong... Please try again...');
            }
        } finally {
            setLoading(false);
        }
    }

    if (error) return <p>{error}</p>
    if (loading || flashcards.length === 0) return <Loading />
    if (submitted) return (
        <div className="bg-page-bg min-h-screen text-center flex flex-col items-center">
            <p className="text-primary-text font-bold">Flashcards completed successfully</p>
            <button 
                type="button" 
                className="bg-primary px-8 py-4 font-bold text-primary-text rounded-md ml-auto mr-[10vw] hover:bg-primary-hover transition-all ease-in cursor-pointer"
                onClick={() => navigate(`/projects/${topic.project_id}/study/${topic.id}`)}
            >
                Continue Learning
            </button>
        </div>
    )

    return(
        <div className="bg-page-bg min-h-screen text-center flex flex-col items-center">
            <h3 className="text-primary-text font-bold text-5xl p-12">Flashcards</h3>
            <div className="flex flex-row items-center gap-12">
                <button 
                    type="button" 
                    className={`bg-card-bg p-2 rounded-full`}
                    onClick={() => handleLeftArrow()}
                >
                    <FaArrowLeft className="text-primary-text"/>
                </button>

                <div className="h-[60vh] w-[70vw] max-w-4xl bg-card-bg rounded-2xl flex justify-center items-center p-12" onClick={() => setIsFlipped(!isFlipped)}>
                    {isFlipped ? <p className="text-primary-text text-2xl font-bold">{currentCard.answer}</p> : <p className="text-primary-text text-2xl font-bold">{currentCard.question}</p>}
                </div>
    
                <button 
                    type="button" 
                    className={`bg-card-bg p-2 rounded-full`}
                    onClick={() => handleRightArrow()}
                >
                    <FaArrowRight className="text-primary-text"/>
                </button>

            </div>
            {submit && (
                <div className="bg-elevated-bg w-[70vw] p-6 rounded-2xl my-12">
                    <p className="text-primary-text">How confident do you feel about this topic?</p>
                    <button className="text-primary-text bg-secondary px-6 py-4 mx-1 rounded-md mt-2 font-bold" onClick={() => submitResult('got_it')}>Got It</button>
                    <button className="text-primary-text bg-warning px-6 py-4 mx-1 rounded-md mt-2 font-bold" onClick={() => submitResult('shaky')}>Shaky</button>
                    <button className="text-primary-text bg-danger px-6 py-4 mx-1 rounded-md mt-2 font-bold" onClick={() => submitResult('lost')}>Lost</button>
                </div>
            )}
        </div>
    )
}
import { useEffect, useState } from "react"
import { useStudyStore } from "../store/studyStore"
import { getFlashcards } from "../api/study";
import { useTopicsStore } from "../store/topicsStore";
import { APIError } from "../api/client";

export default function Flashcards() {
    const flashcards = useStudyStore((state) => state.flashcards);
    const setFlashcards = useStudyStore((state) => state.setFlashcards);
    const topic = useTopicsStore((state) => state.currentTopic);

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<null | string>(null);

    useEffect(() => {
        
        try {
            if (flashcards.flashcards.length === 0) {
                async function getFlashcardsAPICall() {
                    const result = await getFlashcards(topic.id, topic.project_id);
                    setFlashcards(result);
                }

                getFlashcardsAPICall();
            }
        } catch (err) {
            if (err instanceof APIError) {
                setError(err.message);
            } else {
                setError('Something went wrong... Please try again...');
            }
        } finally {
            setLoading(false);
        }
    })

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return(
        <div className="bg-page-bg  min-h-screen">
            <h3>Flashcards</h3>
            <p>{flashcards.flashcards[0].question}</p>
            <p>{flashcards.flashcards[0].answer}</p>
        </div>
    )
}
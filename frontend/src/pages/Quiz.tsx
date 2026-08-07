import { useEffect, useState } from "react";
import { getQuiz } from "../api/study";
import { useTopicsStore } from "../store/topicsStore";
import { APIError } from "../api/client";
import { useStudyStore } from "../store/studyStore";
import { sessionResult } from "../api/session";
import { getTopics } from "../api/roadmap";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
    const topic = useTopicsStore((state) => state.currentTopic);
    const setQuiz = useStudyStore((state) => state.setQuiz);
    const quiz = useStudyStore((state) => state.quiz.questions);
    const setTopics = useTopicsStore((state) => state.setTopics);

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentQuestion = quiz[currentIndex];

    const answersKey = `quiz-answers-${topic.project_id}-${topic.id}`;
    const [answers, setAnswers] = useState<Record<number, number>>(() => {
        const savedAnswers = localStorage.getItem(answersKey);
        return savedAnswers ? JSON.parse(savedAnswers) : {};
    });
    const [ finished, setFinished ] = useState(false);
    const [ submitted, setSubmitted ] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem(answersKey, JSON.stringify(answers));
    }, [answers, answersKey]);

    useEffect(() => {
        async function quizAPICall() {
            setLoading(true);
            setError(null);
            setCurrentIndex(0);
            setFinished(false);
            setSubmitted(false);
            setAnswers({});

            try {
                const result = await getQuiz(topic.id, topic.project_id);
                setQuiz(result);
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

        quizAPICall();
    }, [topic.id, topic.project_id, setQuiz]);

    function handleAnswer(questionIndex: number, optionIndex: number) {
        // Ignore if the user has already selected an answer
        if (answers[questionIndex] !== undefined) return
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }))
    }

    function handleNext() {
        setCurrentIndex((index) => Math.min(index + 1, quiz.length - 1));
        if (currentIndex === quiz.length - 1) setFinished(true);
    }

    function getOptionStyle(optionIndex: number) {
        const selectedOption = answers[currentIndex];
        if (selectedOption === undefined || selectedOption !== optionIndex) {
            return "bg-card-bg border-borders-bg";
        }

        return optionIndex === currentQuestion.correct_index
            ? "bg-elevated-bg border-secondary"
            : "bg-elevated-bg border-danger";
    }

    async function handleSubmit() {
        setLoading(true);
        try {
            const correctCount = quiz.reduce(
                (total, question, index) => total + (answers[index] === question.correct_index ? 1 : 0), 0
            );

            const sessionResults = {
                topic_id: topic.id,
                mode: 'quiz',
                score: correctCount / quiz.length,
            }
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
    if (loading || quiz.length === 0) return <Loading />

    if (submitted) return (
        <div className="bg-page-bg min-h-screen text-center flex flex-col items-center">
            <p className="text-primary-text font-bold">Quiz submitted successfully</p>
            <button 
                type="button" 
                className="bg-primary px-8 py-4 font-bold text-primary-text rounded-md ml-auto mr-[10vw] hover:bg-primary-hover transition-all ease-in cursor-pointer"
                onClick={() => navigate(`/projects/${topic.project_id}/study/${topic.id}`)}
            >
                Continue Learning
            </button>
        </div>
    )

    return (
        <div className="bg-page-bg min-h-screen text-center flex flex-col items-center">
            <h3 className="text-primary-text font-bold text-5xl p-12">Quiz</h3>
            <div className="bg-elevated-bg p-12 rounded-2xl w-4/5 mb-4">
                <p className="text-primary-text font-bold">{currentQuestion.question}</p>
            </div>
            {currentQuestion.options.map((option, optionIndex) => (
                <div className="w-4/5" key={optionIndex}>
                    <p
                        className={`text-primary-text rounded-md p-4 mb-2 hover:bg-elevated-bg transition-all ease-in border-2 border-borders-bg ${getOptionStyle(optionIndex)}`}
                        onClick={() => handleAnswer(currentIndex, currentQuestion.options.indexOf(option))}
                    >
                        {option}
                    </p>
                </div>
            ))}
            
            {!finished && (
                <button 
                    type="button" 
                    onClick={handleNext} 
                    className="bg-primary px-8 py-4 font-bold text-primary-text rounded-md ml-auto mr-[10vw] hover:bg-primary-hover transition-all ease-in cursor-pointer"
                >
                    Next
                </button>
            )}

            {finished && (
                <button 
                    type="button" 
                    className="bg-primary px-8 py-4 font-bold text-primary-text rounded-md ml-auto mr-[10vw] hover:bg-primary-hover transition-all ease-in cursor-pointer"
                    onClick={handleSubmit}
                >
                    Finish
                </button>
            )}

        </div>
    )
}

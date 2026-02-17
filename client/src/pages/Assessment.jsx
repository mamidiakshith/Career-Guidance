import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Assessment = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState(0); // 1 for next, -1 for prev (if implemented)
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/questions')
            .then(data => {
                setQuestions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch questions", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="section container">Loading assessment...</div>;
    if (questions.length === 0) return <div className="section container">Failed to load questions. Please try again later.</div>;

    const handleAnswer = (isYes) => {
        setDirection(1);
        if (isYes) {
            const type = questions[currentQuestionIndex].type;
            setScores(prev => ({ ...prev, [type]: prev[type] + 1 }));
        }

        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 200);
        } else {
            let finalScores = { ...scores };
            if (isYes) {
                const type = questions[currentQuestionIndex].type;
                finalScores[type] += 1;
            }
            navigate('/results', { state: { scores: finalScores } });
        }
    };

    const progress = ((currentQuestionIndex) / questions.length) * 100;

    return (
        <div className="page assessment-page section">
            <div className="container" style={{ maxWidth: '600px' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Discover Your Interests</h2>
                    <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}% ` }}
                            style={{ background: 'var(--primary)', height: '100%' }}
                        />
                    </div>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Question {currentQuestionIndex + 1} of {questions.length}</p>
                </div>

                <div style={{ position: 'relative', minHeight: '300px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="card"
                            style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: '600' }}>
                                {questions[currentQuestionIndex].question}
                            </h3>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => handleAnswer(false)}
                                    className="btn"
                                    style={{ background: '#ef4444', color: 'white', minWidth: '120px' }}
                                >
                                    No
                                </button>
                                <button
                                    onClick={() => handleAnswer(true)}
                                    className="btn"
                                    style={{ background: '#22c55e', color: 'white', minWidth: '120px' }}
                                >
                                    Yes
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Assessment;

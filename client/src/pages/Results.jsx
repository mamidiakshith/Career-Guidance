import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Results = () => {
    const location = useLocation();
    const scores = location.state?.scores;
    const [allCareers, setAllCareers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/careers')
            .then(data => {
                setAllCareers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch careers", err);
                setLoading(false);
            });
    }, []);

    if (!scores) {
        return (
            <div className="section container" style={{ textAlign: 'center' }}>
                <h2>No results found</h2>
                <p>Please take the assessment first.</p>
                <Link to="/assessment" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Assessment</Link>
            </div>
        );
    }

    if (loading) return (
        <div className="section container" style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e2e8f0',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading results...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    // Calculate top 3 RIASEC types
    const sortedTypes = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([type]) => type);

    const topType = sortedTypes[0];

    // Map types to full names
    const typeNames = {
        R: 'Realistic (Doers)',
        I: 'Investigative (Thinkers)',
        A: 'Artistic (Creators)',
        S: 'Social (Helpers)',
        E: 'Enterprising (Persuaders)',
        C: 'Conventional (Organizers)'
    };

    // Filter careers based on top types
    // A career matches if its type is in the user's top 3 types
    // Optionally, sort match strength (e.g. if career type == user top type, it's a strong match)
    const matchedCareers = allCareers.filter(career => sortedTypes.includes(career.type));

    return (
        <div className="page results-page section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h1 style={{ marginBottom: '1rem' }}>Your Career Personality Profile</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Based on your answers, your primary traits are:</p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                        {sortedTypes.map((type, index) => (
                            <div key={type} className="card" style={{ padding: '1rem 2rem', background: index === 0 ? 'var(--primary)' : 'white', color: index === 0 ? 'white' : 'var(--text-main)', borderColor: 'var(--primary)' }}>
                                <strong style={{ fontSize: '1.2rem' }}>{typeNames[type]}</strong>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <section>
                    <h2 style={{ marginBottom: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Recommended Careers</h2>
                    {matchedCareers.length > 0 ? (
                        <div className="grid grid-cols-3">
                            {matchedCareers.map((career, index) => (
                                <motion.div
                                    key={career.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card"
                                    style={{ display: 'flex', flexDirection: 'column' }}
                                >
                                    <div style={{ marginBottom: '1rem' }}>
                                        <span style={{ background: '#e0e7ff', color: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {typeNames[career.type].split(' ')[0]}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{career.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>{career.description}</p>

                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                        <p><strong>Education:</strong> {career.education}</p>
                                        <p><strong>Salary Potential:</strong> {career.salary}</p>
                                    </div>

                                    <Link to={`/careers/${career.id}`} className="btn btn-secondary" style={{ width: '100%' }}>View Details</Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p>No specific careers matched your top traits perfectly, but try browsing our full library!</p>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link to="/careers" className="btn btn-primary">Browse All Careers</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Results;

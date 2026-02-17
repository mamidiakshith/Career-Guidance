import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Roadmaps = () => {
    const [roadmapsData, setRoadmapsData] = useState([]);
    const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/roadmaps')
            .then(data => {
                setRoadmapsData(data);
                if (data.length > 0) setSelectedRoadmapId(data[0].id);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch roadmaps", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="section container">Loading roadmaps...</div>;
    if (roadmapsData.length === 0) return <div className="section container">No roadmaps found.</div>;

    const selectedRoadmap = roadmapsData.find(r => r.id === selectedRoadmapId) || roadmapsData[0];

    return (
        <div className="page roadmaps-page section">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1>Career Roadmaps</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Visualize the path to your dream career.</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner" style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #e2e8f0',
                            borderTopColor: 'var(--primary)',
                            borderRadius: '50%',
                            margin: '0 auto 1rem',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <p style={{ color: 'var(--text-muted)' }}>Loading roadmaps...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <div className="layout-split" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                        {/* Sidebar */}
                        <div className="sidebar" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', alignSelf: 'start' }}>
                            <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Streams</h3>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {roadmapsData.map(roadmap => (
                                    <li key={roadmap.id}>
                                        <button
                                            onClick={() => setSelectedRoadmapId(roadmap.id)}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                background: selectedRoadmapId === roadmap.id ? 'var(--primary)' : 'transparent',
                                                color: selectedRoadmapId === roadmap.id ? 'white' : 'var(--text-main)',
                                                border: 'none',
                                                padding: '0.75rem',
                                                borderRadius: 'var(--radius)',
                                                cursor: 'pointer',
                                                fontWeight: '500',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {roadmap.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Timeline Content */}
                        <div className="content">
                            <motion.div
                                key={selectedRoadmap.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="card"
                                style={{ padding: '2rem' }}
                            >
                                <h2 style={{ marginBottom: '0.5rem' }}>{selectedRoadmap.title}</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{selectedRoadmap.description}</p>

                                <div className="timeline" style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid #e2e8f0' }}>
                                    {selectedRoadmap.steps.map((step, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            style={{ marginBottom: '2rem', position: 'relative' }}
                                        >
                                            {/* Dot */}
                                            <div style={{
                                                position: 'absolute',
                                                left: '-2.6rem',
                                                top: '0.25rem',
                                                width: '1.2rem',
                                                height: '1.2rem',
                                                background: 'white',
                                                border: '4px solid var(--primary)',
                                                borderRadius: '50%'
                                            }} />

                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{step.title}</h3>
                                            <p style={{ color: 'var(--text-muted)' }}>{step.detail}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @media (max-width: 768px) {
          .layout-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Roadmaps;

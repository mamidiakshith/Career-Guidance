import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaGraduationCap, FaMoneyBillWave } from 'react-icons/fa';
import api from '../services/api';

const CareerDetail = () => {
    const { id } = useParams();
    const [career, setCareer] = useState(null);
    const [roadmaps, setRoadmaps] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Career
                const careerData = await api.get(`/careers/${id}`);
                setCareer(careerData);

                // Fetch Roadmaps
                const roadmapsData = await api.get('/roadmaps');
                // Filter roadmaps by stream if available
                const relatedRoadmaps = roadmapsData.filter(r => r.stream === careerData.stream || r.stream === "Any Stream");
                setRoadmaps(relatedRoadmaps);

                // Fetch Colleges
                const collegesData = await api.get('/colleges');
                // Filter colleges/exams by stream
                const relatedColleges = collegesData.colleges.filter(c => c.stream === careerData.stream || c.stream === "Any Stream");
                // We can also filter exams but let's stick to colleges for now or show both if needed
                setColleges(relatedColleges);

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch data", err);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="section container">Loading career details...</div>;

    if (!career) {
        return (
            <div className="section container" style={{ textAlign: 'center' }}>
                <h2>Career not found</h2>
                <Link to="/careers" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Careers</Link>
            </div>
        );
    }

    return (
        <div className="page career-detail-page section">
            <div className="container" style={{ maxWidth: '800px' }}>
                <Link to="/careers" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    <FaArrowLeft /> Back to Careers
                </Link>

                <div className="card" style={{ padding: '3rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                        }}>
                            {career.stream}
                        </span>
                        <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1rem' }}>{career.title}</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{career.description}</p>
                    </div>

                    {/* Sub-Careers Section */}
                    {career.subCareers && career.subCareers.length > 0 && (
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ marginBottom: '1.5rem' }}>Specializations</h2>
                            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                                {career.subCareers.map((sub, idx) => (
                                    <div key={idx} style={{
                                        background: '#fff',
                                        border: '1px solid var(--border)',
                                        padding: '1.5rem',
                                        borderRadius: 'var(--radius)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{sub.title}</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{sub.description}</p>

                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Skills:</strong>
                                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                {sub.skills.map(s => (
                                                    <span key={s} style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{s}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <strong style={{ fontSize: '0.85rem' }}>Salary: </strong>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: '600' }}>{sub.salary}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <FaGraduationCap size={24} color="var(--primary)" />
                                <h3 style={{ margin: 0 }}>Education Path</h3>
                            </div>
                            <p>{career.education}</p>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <FaMoneyBillWave size={24} color="var(--secondary)" />
                                <h3 style={{ margin: 0 }}>Salary Potential</h3>
                            </div>
                            <p>{career.salary}</p>
                        </div>
                    </div>

                    {/* Subjects & Skills Section */}
                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Required Subjects</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            {career.subjects && career.subjects.map((subj, index) => (
                                <span key={index} style={{ background: '#e0e7ff', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '500' }}>
                                    {subj}
                                </span>
                            ))}
                        </div>

                        <h3 style={{ marginBottom: '1rem' }}>Key Skills</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {career.skills && career.skills.map((skill, index) => (
                                <span key={index} style={{ background: '#f0fdf4', color: 'var(--secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '500' }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
                        <h3>Resources for {career.stream}</h3>

                        {roadmaps.length > 0 && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <h4>Roadmap</h4>
                                {roadmaps.map(rmap => (
                                    <div key={rmap.id} style={{ background: '#fff', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                                        <strong>{rmap.title}</strong>: {rmap.description}
                                    </div>
                                ))}
                                <div style={{ marginTop: '0.5rem' }}>
                                    <Link to="/roadmaps" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>View Full Roadmap &rarr;</Link>
                                </div>
                            </div>
                        )}

                        {colleges.length > 0 && (
                            <div style={{ marginTop: '2rem' }}>
                                <h4>Top Colleges</h4>
                                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                                    {colleges.slice(0, 3).map(college => (
                                        <li key={college.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                            <strong>{college.name}</strong> ({college.location}) - Exam: {college.exam}
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <Link to="/colleges" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Search More Colleges &rarr;</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerDetail;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import api from '../services/api';

const Colleges = () => {
    const [activeTab, setActiveTab] = useState('exams');
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState({ exams: [], colleges: [] }); // We keep structure but might rename field to 'items' to match better
    const [items, setItems] = useState([]); // Use a flat list for current view
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchItems = (pageNum, search, tab) => {
        setLoading(true);
        const type = tab === 'exams' ? 'Exam' : 'College';
        let url = `/colleges?page=${pageNum}&limit=10&type=${type}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;

        api.get(url)
            .then(responseData => {
                if (pageNum === 1) {
                    setItems(responseData.items || []);
                } else {
                    setItems(prev => [...prev, ...(responseData.items || [])]);
                }
                setHasMore(responseData.currentPage < responseData.totalPages);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch data", err);
                setLoading(false);
            });
    };

    // Debounce search and handle tab change
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchItems(1, searchTerm, activeTab);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, activeTab]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchItems(nextPage, searchTerm, activeTab);
    };

    // removed client-side filteredItems logic
    const filteredItems = items || [];

    return (
        <div className="page colleges-page section">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1>Find Colleges & Exams</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Discover list of top entrance exams and colleges.</p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('exams')}
                        className={`btn ${activeTab === 'exams' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        Entrance Exams
                    </button>
                    <button
                        onClick={() => setActiveTab('colleges')}
                        className={`btn ${activeTab === 'colleges' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        Top Colleges
                    </button>
                </div>

                {/* Search */}
                <div style={{ maxWidth: '600px', margin: '0 auto 3rem auto', position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
                    />
                </div>

                {/* Grid */}
                {loading && items.length === 0 ? (
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
                        <p style={{ color: 'var(--text-muted)' }}>Loading data...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id || index} // fallback key
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="card"
                                style={{ display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem' }}>{item.name}</h3>
                                    <span style={{
                                        background: '#f3e8ff',
                                        color: 'var(--accent)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {item.stream}
                                    </span>
                                </div>

                                {activeTab === 'exams' ? (
                                    <>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>{item.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                            <FaCalendarAlt color="var(--primary)" />
                                            <strong>Exam Date:</strong> {item.date}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                                            <FaMapMarkerAlt /> {item.location}
                                        </div>
                                        <p style={{ marginBottom: '1rem' }}><strong>Entrance:</strong> {item.exam}</p>
                                        <div style={{ marginTop: 'auto', textAlign: 'right', fontWeight: 'bold', color: '#eab308' }}>
                                            Rating: {item.rating}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )} // End of loading ternary

                {filteredItems.length === 0 && !loading && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No results found.</p>
                )}

                {hasMore && !searchTerm && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )} // End of loading ternary
            </div>

            <style>{`
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default Colleges;

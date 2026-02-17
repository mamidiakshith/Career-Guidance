import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter } from 'react-icons/fa';
import api from '../services/api';

const Careers = () => {
    const [careersData, setCareersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchCareers(1, searchTerm, filterType);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, filterType]);

    const fetchCareers = (pageNum, search, type) => {
        setLoading(true);
        // Build query string
        let url = `/careers?page=${pageNum}&limit=9`;
        if (search) url += `&search=${encodeURIComponent(search)}`;

        // Use api instance
        api.get(url)
            .then(data => {
                if (pageNum === 1) {
                    setCareersData(data.careers || []);
                } else {
                    setCareersData(prev => [...prev, ...(data.careers || [])]);
                }
                setHasMore(data.currentPage < data.totalPages);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch careers", err);
                setLoading(false);
            });
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchCareers(nextPage, searchTerm, filterType);
    };

    // We can't use 'activeTab' or 'filterType' efficiently without backend support.
    // I will proceed with just search for now, and client-side filter what we have (not ideal but works for small filters).
    // Actually, let's just pass the filter to backend! I'll update backend next.

    // Client-side filtering of incomplete data:
    const filteredCareers = (careersData || []).filter(career => {
        // We already server-side searched, so we just filter by type here if backend didn't do it.
        // If backend doesn't filter by type, we might show fewer items than limit.
        return filterType === 'All' || career.type === filterType;
    });

    // ... rest of render ...
    // Note: I need to replace the CLIENT-SIDE filtering logic that was used before.

    return (
        <div className="page careers-page section">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1>Explore Careers</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Find your future among {careersData.length}+ career options</p>
                </div>

                {/* Search and Filter */}
                <div className="card" style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* ... (search input code remains same, I need to include it in replacement or targeted edit) ... */}
                    <div style={{ flex: 1, position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search careers (e.g. Engineer, Doctor)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
                        />
                    </div>
                    {/* ... (filter buttons code remains same) ... */}
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {['All', 'R', 'I', 'A', 'S', 'E', 'C'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`btn ${filterType === type ? 'btn-primary' : 'btn-secondary'} `}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                            >
                                {type === 'All' ? 'All Types' :
                                    type === 'R' ? 'Realistic' :
                                        type === 'I' ? 'Investigative' :
                                            type === 'A' ? 'Artistic' :
                                                type === 'S' ? 'Social' :
                                                    type === 'E' ? 'Enterprising' : 'Conventional'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && careersData.length === 0 && (
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
                        <p style={{ color: 'var(--text-muted)' }}>Loading careers...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {/* Results Grid */}
                <div className="grid grid-cols-3">
                    {filteredCareers.map((career) => (
                        <motion.div
                            key={career.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="card"
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{career.title}</h3>
                                <span style={{
                                    background: '#f1f5f9',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: 'var(--text-muted)'
                                }}>
                                    {{
                                        'R': 'Realistic', 'I': 'Investigative', 'A': 'Artistic',
                                        'S': 'Social', 'E': 'Enterprising', 'C': 'Conventional'
                                    }[career.type] || career.type}
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1 }}>{career.description}</p>

                            <Link to={`/careers/${career.id}`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                View Details
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {filteredCareers.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <p>No careers found matching your criteria.</p>
                    </div>
                )}

                {hasMore && !searchTerm && filterType === 'All' && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Careers;

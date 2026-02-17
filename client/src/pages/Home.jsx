import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCompass, FaUniversity, FaChartLine, FaUserGraduate } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero section" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)', padding: '6rem 0' }}>
                <div className="container">
                    <div className="hero-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.2' }}
                        >
                            Discover Your Perfect <span style={{ color: 'var(--primary)' }}>Career Path</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}
                        >
                            Confused after 10th or 12th? Take our scientific assessment to find the career that matches your personality and interests.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
                        >
                            <Link to="/assessment" className="btn btn-primary">Start Assessment</Link>
                            <Link to="/careers" className="btn btn-secondary">Browse Careers</Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features section">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Why Choose PathFinder?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>We provide comprehensive guidance based on data and psychology.</p>
                    </div>

                    <div className="grid grid-cols-3">
                        <FeatureCard
                            icon={<FaCompass size={32} color="var(--primary)" />}
                            title="Scientifically Proven"
                            description="Our assessment is based on the RIASEC model, trusted by career counselors worldwide."
                        />
                        <FeatureCard
                            icon={<FaChartLine size={32} color="var(--secondary)" />}
                            title="Detailed Roadmaps"
                            description="Get step-by-step guides on how to reach your dream job from where you are now."
                        />
                        <FeatureCard
                            icon={<FaUniversity size={32} color="var(--accent)" />}
                            title="College & Exam Info"
                            description="Find the best colleges and entrance exams tailored to your chosen career path."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials section" style={{ background: '#fff' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Student Success Stories</h2>
                    </div>

                    <div className="grid grid-cols-3">
                        <TestimonialCard
                            name="Rahul Sharma"
                            role="Software Engineer"
                            quote="I was lost after 12th commerce, but the assessment suggested I switch to detailed analytics. I'm now a Data Analyst and loving it!"
                        />
                        <TestimonialCard
                            name="Priya Patel"
                            role="Medical Student"
                            quote="The college finder tool was a lifesaver. It helped me shortlist the best medical colleges based on my NEET score."
                        />
                        <TestimonialCard
                            name="Amit Singh"
                            role="Graphic Designer"
                            quote="I always loved art but didn't know how to make a career out of it. PathFinder showed me the roadmap to becoming a designer."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta section" style={{ background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to shape your future?</h2>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>Join thousands of students who have found their calling.</p>
                    <Link to="/assessment" className="btn" style={{ background: 'white', color: 'var(--primary)' }}>Take Free Assessment</Link>
                </div>
            </section>
        </div>
    );
}

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="card"
        style={{ textAlign: 'center', padding: '2.5rem' }}
    >
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{description}</p>
    </motion.div>
)

const TestimonialCard = ({ name, role, quote }) => (
    <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ width: '48px', height: '48px', background: '#ddd', borderRadius: '50%', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaUserGraduate color="#666" />
            </div>
            <div>
                <h4 style={{ fontWeight: '600' }}>{name}</h4>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{role}</span>
            </div>
        </div>
        <p style={{ fontStyle: 'italic', color: 'var(--text-main)' }}>"{quote}"</p>
    </div>
)

export default Home;

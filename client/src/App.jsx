import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import Roadmaps from './pages/Roadmaps';
import Colleges from './pages/Colleges';
import ServerAwakeMessage from './components/ServerAwakeMessage';

function App() {
  return (
    <>
      <ServerAwakeMessage />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="results" element={<Results />} />
          <Route path="careers" element={<Careers />} />
          <Route path="careers/:id" element={<CareerDetail />} />
          <Route path="roadmaps" element={<Roadmaps />} />
          <Route path="colleges" element={<Colleges />} />
          <Route path="*" element={<div className="container" style={{ padding: '2rem' }}>404 Not Found</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

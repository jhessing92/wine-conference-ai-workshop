import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Hub from './pages/Hub';
import TastingNotes from './pages/TastingNotes';
import RoleTrack from './pages/RoleTrack';
import EventMarketing from './pages/EventMarketing';
import NumbersToDecisions from './pages/NumbersToDecisions';
import LightningLab from './pages/LightningLab';
import Toolkit from './pages/Toolkit';
import Beta from './pages/Beta';
import Slides from './pages/Slides';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/gwp-2026" replace />} />
        <Route path="/gwp-2026" element={<Hub />} />
        <Route path="/gwp-2026/slides" element={<Slides />} />
        <Route path="/gwp-2026/1-tasting-notes" element={<TastingNotes />} />
        <Route path="/gwp-2026/2-role-track" element={<RoleTrack />} />
        <Route path="/gwp-2026/3-event-marketing" element={<EventMarketing />} />
        <Route path="/gwp-2026/4-numbers-to-decisions" element={<NumbersToDecisions />} />
        <Route path="/gwp-2026/5-lightning-lab" element={<LightningLab />} />
        <Route path="/gwp-2026/prompt-pack" element={<Toolkit />} />
        <Route path="/gwp-2026/beta" element={<Beta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

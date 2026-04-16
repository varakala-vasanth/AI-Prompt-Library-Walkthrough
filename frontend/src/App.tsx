import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Library, PlusSquare } from 'lucide-react';
import PromptList from './pages/PromptList';
import PromptDetail from './pages/PromptDetail';
import PromptForm from './pages/PromptForm';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <Library size={28} color="var(--accent)" />
            AI Prompt Library
          </Link>
          <Link to="/add-prompt" className="btn">
            <PlusSquare size={18} />
            Add Prompt
          </Link>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<PromptList />} />
            <Route path="/prompts/:id" element={<PromptDetail />} />
            <Route path="/add-prompt" element={<PromptForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

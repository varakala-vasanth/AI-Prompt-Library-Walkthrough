import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

interface Prompt {
  id: string;
  title: string;
  complexity: number;
  tags: string[];
}

export default function PromptList() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/prompts/')
      .then(res => {
        setPrompts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getComplexityColor = (comp: number) => {
    if (comp <= 3) return 'var(--complexity-low)';
    if (comp <= 7) return 'var(--complexity-med)';
    return 'var(--complexity-high)';
  };

  if (loading) return <div>Loading prompts...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Saved Prompts</h2>
      <div className="grid">
        {prompts.map(prompt => (
          <Link to={`/prompts/${prompt.id}`} key={prompt.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{prompt.title}</h3>
                <span className="badge" style={{ backgroundColor: getComplexityColor(prompt.complexity) }}>
                  C: {prompt.complexity}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {prompt.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
        {prompts.length === 0 && (
          <div style={{ color: 'var(--text-muted)' }}>No prompts found. Add one!</div>
        )}
      </div>
    </div>
  );
}

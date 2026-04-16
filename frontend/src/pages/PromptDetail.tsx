import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, Clock, ArrowLeft, Layers } from 'lucide-react';
import { api } from '../api';

interface PromptDetailData {
  id: string;
  title: string;
  content: string;
  complexity: number;
  view_count: number;
  created_at: string;
  tags: string[];
}

export default function PromptDetail() {
  const { id } = useParams();
  const [prompt, setPrompt] = useState<PromptDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/prompts/${id}/`)
      .then(res => {
        setPrompt(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading details...</div>;
  if (!prompt) return <div>Prompt not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Library
      </Link>
      
      <div className="glass-card">
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent)' }}>{prompt.title}</h1>
        
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Layers size={16} /> Complexity: {prompt.complexity}/10</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--complexity-low)' }}><Eye size={16} /> Views: {prompt.view_count}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {new Date(prompt.created_at).toLocaleDateString()}</span>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {prompt.content}
        </div>
      </div>
    </div>
  );
}

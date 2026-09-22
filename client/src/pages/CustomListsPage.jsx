import React, { useState, useEffect } from 'react';
import { List, PlusCircle, User } from 'lucide-react';
import { getUserLists } from '../services/socialService';

export default function CustomListsPage({ onOpenCreateList }) {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    setLists(getUserLists());
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="section-title" style={{ fontSize: '1.8rem', margin: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <List size={24} color="var(--accent-green)" /> Listas da Comunidade
          </span>
        </h1>

        <button className="btn btn-primary" onClick={onOpenCreateList}>
          <PlusCircle size={18} /> Criar Lista
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {lists.map((list) => (
          <div key={list.id} className="review-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
                {list.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
                {list.description || 'Sem descrição.'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <User size={14} /> {list.ownerName}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 700 }}>
                {list.podcastsCount || list.podcasts?.length || 0} podcasts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

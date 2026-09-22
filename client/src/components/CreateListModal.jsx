import React, { useState } from 'react';
import { X, List } from 'lucide-react';
import { createCustomList } from '../services/socialService';
import { useAuth } from '../context/AuthContext';

export default function CreateListModal({ isOpen, onClose, onListCreated }) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      const newList = createCustomList(title.trim(), description.trim(), null, currentUser);
      setTitle('');
      setDescription('');
      onListCreated && onListCreated(newList);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.25rem' }}>
            <List size={20} color="var(--accent-green)" /> Criar Nova Lista
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome da Lista</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Podcasts Imperdíveis de Ciência"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-textarea"
              placeholder="Descreva o tema ou proposta dessa lista..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar Lista
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

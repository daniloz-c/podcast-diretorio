# Graphify Knowledge Graph Report

**Corpus:** Podboxd (Letterboxd para Podcasts Brasileiros)  
**Nodes:** 29 | **Edges:** 41 | **Communities:** 5

---

## 🌟 God Nodes (Most Connected Entities)

1. **`client/src/App.jsx`** (Grau: 12)
   - Centro nervoso do frontend: orquestra rotas, provedores de estado (Áudio e Autenticação) e modais globais.
2. **`server/src/routes/podcastindex.js`** (Grau: 8)
   - Motor de ingestão e busca: integra a API da Apple, alimenta o RSS Parser e aplica os filtros de qualidade (remover podcasts sem episódios e bloquear canais de spam como Terceirona Oficial).
3. **`client/src/services/api.js` & `client/src/services/socialService.js`** (Grau: 7)
   - Camada de ponte que conecta a interface do usuário aos serviços de backend e à persistência de dados sociais.

---

## ⚡ Surprising Connections

- **`ideia.md` ➔ `server/src/routes/podcastindex.js:isBlockedPodcast`**:
  Regras de negócio de moderação definidas no planejamento eliminam diretamente ruídos na ingestão de dados em tempo real.
- **`client/src/pages/PodcastPage.jsx` ➔ `client/src/context/AudioContext.jsx`**:
  A ordenação dinâmica de episódios (mais recentes primeiro) interage de maneira desacoplada com a barra de reprodução global fixada.
- **`client/src/pages/SearchPage.jsx` ➔ Categorias Especializadas (Tecnologia & Cultura Pop)**:
  Filtros na UI acionam expansão semântica no backend para garantir podcasts relevantes de TI e entretenimento.

---

## ❓ Suggested Questions

1. *Como o sistema filtra podcasts inválidos ou duplicados antes de exibir o Top 5 na página inicial?*
2. *De que forma o `AudioContext` mantém o streaming de áudio persistente entre transições de rotas?*
3. *Como as interações sociais (curtidas, favoritos e reviews) são persistidas e integradas ao `ActivityFeed`?*

---

## 🏘️ Communities Overview

- **Community 0: Backend & Data Ingestion** (7 nós)
- **Community 1: State & Frontend Architecture** (7 nós)
- **Community 2: UI Components & Social Interaction** (8 nós)
- **Community 3: Views & Discovery Experience** (6 nós)
- **Community 4: Product Spec & Business Rules** (1 nó)

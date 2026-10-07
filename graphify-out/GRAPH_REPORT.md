# Graph Report - podcast-diretorio  (2026-09-25)

## Corpus Check
- 33 files · ~12,452 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .css 3, .example 2, (none) 2)

## Summary
- 214 nodes · 422 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4a1bba84`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- routes/podcastindex.js
- client/package.json
- App Router & Layout Shell
- App.jsx
- socialService.js
- 9router
- UserProfilePage.jsx
- Configuração com SQLite (Para Testes)
- .oxlintrc.json
- dependencies
- config/podcastindex.js
- ActivityFeed Component
- Project Requirements (ideia.md)

## God Nodes (most connected - your core abstractions)
1. `react` - 19 edges
2. `getStored()` - 17 edges
3. `PodcastPage()` - 15 edges
4. `lucide-react` - 15 edges
5. `useAuth()` - 13 edges
6. `Configuração com SQLite (Para Testes)` - 9 edges
7. `react-router-dom` - 9 edges
8. `App Router & Layout Shell` - 9 edges
9. `saveRatingAndReview()` - 8 edges
10. `setStored()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `React Client Root` --imports_styles--> `Letterboxd Dark Design System`  [EXTRACTED]
  client/src/main.jsx → client/src/styles/main.css
- `PodcastPage()` --calls--> `useAudio()`  [EXTRACTED]
  client/src/pages/PodcastPage.jsx → client/src/context/AudioContext.jsx
- `PodcastPage()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/pages/PodcastPage.jsx → client/src/context/AuthContext.jsx
- `ActivityFeed()` --calls--> `getActivityFeed()`  [EXTRACTED]
  client/src/components/ActivityFeed.jsx → client/src/services/socialService.js
- `CreateListModal()` --calls--> `createCustomList()`  [EXTRACTED]
  client/src/components/CreateListModal.jsx → client/src/services/socialService.js

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "routes/podcastindex.js"
Cohesion: 0.08
Nodes (32): axios, better-sqlite3, cors, dotenv, express, ref_fs, ref_path, rss-parser (+24 more)

### Community 1 - "client/package.json"
Cohesion: 0.06
Nodes (31): dependencies, axios, firebase, lucide-react, react, react-dom, react-router-dom, devDependencies (+23 more)

### Community 2 - "App Router & Layout Shell"
Cohesion: 0.16
Nodes (15): App Router & Layout Shell, AuthModal Component, CommentSection & Reviews, CreateListModal Component, Navbar Component, PodcastCard (Poster Grid Item), AudioContext (Audio Player State), AuthContext (User State) (+7 more)

### Community 3 - "App.jsx"
Cohesion: 0.17
Nodes (17): App(), AudioPlayerBar(), AuthModal(), CreateListModal(), Navbar(), AudioContext, AudioProvider(), useAudio() (+9 more)

### Community 4 - "socialService.js"
Cohesion: 0.29
Nodes (20): CommentSection(), PodcastPage(), loadPodcast(), fetchEpisodesByFeedId(), fetchPodcastById(), addActivity(), createCustomList(), getPodcastRating() (+12 more)

### Community 5 - "9router"
Cohesion: 0.13
Nodes (14): models, npm, options, modalities, name, input, output, model (+6 more)

### Community 6 - "UserProfilePage.jsx"
Cohesion: 0.19
Nodes (18): ActivityFeed(), PodcastCard(), RatingStars(), HomePage(), loadData(), SearchPage(), performSearch(), UserProfilePage() (+10 more)

### Community 7 - "Configuração com SQLite (Para Testes)"
Cohesion: 0.12
Nodes (15): Comandos, Como funciona, Como o cache funciona, Configuração com SQLite (Para Testes), Endpoints de Cache (novos), Endpoints Principais (com cache automático), Estrutura de arquivos, Instalar dependências (+7 more)

### Community 8 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 9 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, axios, better-sqlite3, cors, dotenv, express, rss-parser

### Community 10 - "config/podcastindex.js"
Cohesion: 0.40
Nodes (3): ref_crypto, MOCK_EPISODES, MOCK_PODCASTS

## Knowledge Gaps
- **82 isolated node(s):** `Status atual`, `SQLite (better-sqlite3)`, `Tabelas criadas automaticamente`, `Instalar dependências`, `Rodar API` (+77 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 91 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `axios` connect `routes/podcastindex.js` to `UserProfilePage.jsx`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `client/package.json`, `socialService.js`, `UserProfilePage.jsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `UserProfilePage.jsx` to `client/package.json`, `App.jsx`, `socialService.js`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `Status atual`, `SQLite (better-sqlite3)`, `Tabelas criadas automaticamente` to the rest of the system?**
  _82 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes/podcastindex.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0796221322537112 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `9router` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
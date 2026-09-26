# Graph Report - podcast-diretorio  (2026-09-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 194 nodes · 405 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `85fa0d98`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8

## God Nodes (most connected - your core abstractions)
1. `react` - 19 edges
2. `getStored()` - 17 edges
3. `PodcastPage()` - 15 edges
4. `lucide-react` - 15 edges
5. `useAuth()` - 13 edges
6. `App Router & Layout Shell` - 13 edges
7. `react-router-dom` - 9 edges
8. `saveRatingAndReview()` - 8 edges
9. `setStored()` - 8 edges
10. `toggleFavorite()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Project Requirements (ideia.md)` --specifies_filters_and_order--> `Podcast & Episode Routes`  [EXTRACTED]
  ideia.md → server/src/routes/podcastindex.js
- `Project Requirements (ideia.md)` --specifies_top5--> `HomePage View`  [EXTRACTED]
  ideia.md → client/src/pages/HomePage.jsx
- `API Client Service (Axios)` --http_api_requests--> `Podcast & Episode Routes`  [EXTRACTED]
  client/src/services/api.js → server/src/routes/podcastindex.js
- `React Client Root` --imports_styles--> `Letterboxd Dark Design System`  [EXTRACTED]
  client/src/main.jsx → client/src/styles/main.css
- `CreateListModal()` --calls--> `createCustomList()`  [EXTRACTED]
  client/src/components/CreateListModal.jsx → client/src/services/socialService.js

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (30): ref_axios, cors, ref_crypto, dotenv, express, rss-parser, dependencies, axios (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (30): dependencies, axios, firebase, lucide-react, react, react-dom, react-router-dom, devDependencies (+22 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (28): RSS Parser Engine, App Router & Layout Shell, ActivityFeed Component, AudioPlayerBar (Fixed Audio Player), AuthModal Component, CommentSection & Reviews, CreateListModal Component, Navbar Component (+20 more)

### Community 3 - "Community 3"
Cohesion: 0.20
Nodes (17): App(), ActivityFeed(), AuthModal(), CreateListModal(), Navbar(), RatingStars(), AuthContext, AuthProvider() (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.24
Nodes (23): CommentSection(), PodcastPage(), loadPodcast(), api, fetchEpisodesByFeedId(), fetchPodcastById(), addActivity(), createCustomList() (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (14): models, npm, options, modalities, name, input, output, model (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.36
Nodes (9): PodcastCard(), HomePage(), loadData(), SearchPage(), performSearch(), fetchCategories(), fetchTrendingPodcasts(), searchPodcasts() (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (7): AudioPlayerBar(), AudioContext, AudioProvider(), useAudio(), EpisodePage(), loadEp(), fetchEpisodeById()

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **70 isolated node(s):** `axios`, `cors`, `dotenv`, `express`, `rss-parser` (+65 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 73 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 3` to `Community 1`, `Community 4`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Community 3` to `Community 1`, `Community 4`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `axios`, `cors`, `dotenv` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06507936507936508 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10582010582010581 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
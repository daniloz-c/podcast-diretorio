# Configuração com SQLite (Para Testes)

## Status atual
- ✅ Arquitetura de Docker removida
- ✅ XAMPP/MySQL removido
- ✅ **SQLite configurado** (better-sqlite3)
- ✅ Cache local automático
- ✅ Schema de banco criado automaticamente

## Como funciona

### SQLite (better-sqlite3)
- **Arquivo**: `server/data/podcast.sqlite`
- **Sem servidor** - arquivo local
- **Inicialização automática** ao rodar a API
- **Cache transparente** - primeiro busca no SQLite, depois iTunes API

### Tabelas criadas automaticamente
- `podcasts` - dados dos podcasts (itunes_id, title, author, feed_url, etc)
- `episodes` - episódios dos podcasts (id, podcast_id, title, date_published, etc)
- `categories` - categorias pré-definidas

## Comandos

### Instalar dependências
```bash
cd server
npm install
```

### Rodar API
```bash
cd server
npm run dev
# ou
npm start
```

**Acessível em**: http://localhost:5000

### Endpoints de Cache (novos)
```
GET /api/cache/podcasts              # Lista todos podcasts do cache
GET /api/cache/podcasts/:itunesId    # Podcast específico
GET /api/cache/episodes/:itunesId    # Episódios de um podcast
GET /api/cache/categories            # Categorias
```

### Endpoints Principais (com cache automático)
```
GET /api/podcasts/trending          # Top podcasts BR (cache + iTunes)
GET /api/podcasts/search?q=termo    # Busca (cache + iTunes)
GET /api/podcasts/byid?id=123       # Detalhes (cache + iTunes)
GET /api/episodes/byfeedid?id=123   # Episódios (cache + RSS)
GET /api/episodes/byid?id=guid      # Detalhes do episódio
GET /api/categories                 # Categorias (cache + default)
```

## Como o cache funciona

1. **Primeira requisição** → Busca na API iTunes/RSS → Salva no SQLite → Retorna
2. **Requisições seguintes** → Lê do SQLite → Retorna instantaneamente
3. **Dados persistem** entre reinicializações do servidor

## Estrutura de arquivos
```
server/
├── .env.example           # Configurações
├── package.json           # Dependências (inclui better-sqlite3)
├── src/
│   ├── index.js           # Servidor Express + endpoints de cache
│   ├── config/
│   │   └── database.js    # SQLite + queries (init automático)
│   └── routes/
│       └── podcastindex.js # Rotas com cache transparente
└── data/
    └── podcast.sqlite     # Criado automaticamente
```

## Variáveis de ambiente (.env)
```bash
PORT=5000
NODE_ENV=development
DB_TYPE=sqlite
DB_PATH=./data/podcast.sqlite
```

## Verificar banco
```bash
# Ver tabelas
sqlite3 server/data/podcast.sqlite ".tables"

# Ver podcasts
sqlite3 server/data/podcast.sqlite "SELECT itunes_id, title FROM podcasts LIMIT 10;"

# Ver episódios
sqlite3 server/data/podcast.sqlite "SELECT id, title, podcast_id FROM episodes LIMIT 10;"
```

## Limpar cache (se necessário)
```bash
rm server/data/podcast.sqlite
# Recria automaticamente na próxima execução
```
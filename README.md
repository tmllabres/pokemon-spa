# Pokédex SPA

Una Single Page Application de Pokémon construida con React 19, Tailwind CSS 4 y la PokeAPI. Explora los 1025 Pokémon, filtra por tipo/región, ordena por stats y construye tu equipo ideal.

**Demo en vivo:** https://pokemon-daw.vercel.app/

**Video demo:** [test.mp4](./test.mp4)

---

## Capturas

| Home | Pokédex | Detalle | Equipo |
|------|---------|---------|--------|
| Página de inicio con Pokémon destacados | Catálogo con filtros y scroll infinito | Vista detallada con stats | Gestión de equipo (máx. 6) |

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2 | Framework UI |
| React Router | 7.14 | Enrutamiento SPA |
| Tailwind CSS | 4.2 | Estilos utility-first |
| Vite | 8.0 | Bundler y dev server |
| PokeAPI | v2 | Datos de Pokémon |
| Vercel | — | Despliegue |

---

## Funcionalidades

### Pokédex con filtros avanzados
- Búsqueda por **nombre** o **número**
- Filtro por **tipo** (18 tipos: Fire, Water, Grass...)
- Filtro por **región** (Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar, Paldea)
- Ordenar por **número**, **nombre** (A-Z / Z-A) o **stats totales** (ascendente/descendente)
- Todos los filtros son **combinables** entre sí
- **Scroll infinito** con IntersectionObserver (20 Pokémon por carga)
- Contador de resultados

### Detalle de Pokémon
- Imagen oficial con animación flotante
- Descripción en español (fallback a inglés)
- Tipos con badges de color
- Altura y peso
- Habilidades
- Estadísticas base con barras de progreso con colores dinámicos (rojo → azul según valor)
- Total de base stats (BTS)

### Equipo Pokémon
- Gestiona un equipo de hasta **6 Pokémon**
- Añadir/quitar desde cualquier card o desde el detalle
- Slots vacíos visuales con placeholder
- Indicador de equipo completo y slots restantes

### Diseño responsive
- Navbar con **menú hamburguesa** animado en móvil
- Grids adaptables (3 → 2 → 1 columna)
- Filtros apilados en vertical en pantallas pequeñas
- Imágenes y textos con tamaños adaptados

### Rendimiento
- **Caché multinivel**: nombres (1025), índice de tipos (18 llamadas), detalles individuales
- **Debounce** de 400ms en la búsqueda
- Peticiones paralelas con `Promise.all()`
- Refs para evitar stale closures en el scroll infinito

---

## Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx              # Barra de navegación con menú móvil
│   └── PokemonCard.jsx         # Card reutilizable con stats totales
├── context/
│   └── TeamContext.jsx         # Context API para el equipo (máx. 6)
├── pages/
│   ├── Home.jsx                # Inicio con Pokémon destacados
│   ├── Pokedex.jsx             # Catálogo con filtros y scroll infinito
│   ├── PokemonDetail.jsx       # Vista detallada de un Pokémon
│   └── Equipo.jsx              # Gestión del equipo
├── services/
│   └── pokemonService.js       # Integración con PokeAPI + caché
├── utils/
│   ├── format.js               # Formateo de nombres (kebab-case → Title Case)
│   └── typeColors.js           # Colores por tipo (bg, border, faded)
├── App.jsx                     # Router y providers
├── index.css                   # Tailwind + tema personalizado + animaciones
└── main.jsx                    # Punto de entrada
```

---

## Rutas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Bienvenida + búsqueda rápida + 6 Pokémon aleatorios |
| `/pokedex` | Pokédex | Catálogo completo con filtros, orden y scroll infinito |
| `/pokemon/:id` | Detalle | Stats, habilidades, descripción y gestión de equipo |
| `/equipo` | Equipo | Roster de 6 slots con acciones |

---

## API utilizada

Base URL: `https://pokeapi.co/api/v2`

| Endpoint | Uso |
|---|---|
| `GET /pokemon?limit=1025` | Listado completo de nombres/IDs |
| `GET /pokemon/{id o name}` | Detalles: stats, imagen, tipos, habilidades |
| `GET /pokemon-species/{id}` | Descripción y datos de especie |
| `GET /type/{type}` | Pokémon por tipo (para el índice de filtrado) |

---

## Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/pokemon-spa.git
cd pokemon-spa

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## Tema y diseño

Tema oscuro con colores personalizados definidos en `index.css`:

- **Fondo:** `#1a1a2e`
- **Superficies:** `#16213e` / `#0f3460`
- **Acento:** `#e94560`
- **18 colores de tipo** Pokémon (Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy)

Animaciones personalizadas:
- `spin-slow` — Rotación de la Pokéball del logo
- `float` — Efecto flotante en la imagen del detalle
- `pop` — Animación de entrada

---

## Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `npm run dev` | Servidor de desarrollo con HMR |
| `build` | `npm run build` | Build optimizado para producción |
| `preview` | `npm run preview` | Preview local del build |
| `lint` | `npm run lint` | Linting con ESLint |

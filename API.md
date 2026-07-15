# Spotify Backend — API Reference

## Modelos

### Artista

| Campo             | Tipo       | Descripción                        |
|-------------------|------------|------------------------------------|
| `id`              | `number`   | Identificador único (auto-generado)|
| `nombre`          | `string`   | Nombre del artista                 |
| `biografia`       | `string`   | Biografía del artista              |
| `pais`            | `string`   | País de origen                     |
| `generoMusical`   | `string[]` | Lista de géneros musicales         |
| `oyentesMensuales`| `number`   | Cantidad de oyentes mensuales      |
| `tipo`            | `string`   | Tipo de artista (solista, banda…)  |
| `verificado`      | `boolean`  | Si el artista está verificado      |

### Cancion

| Campo           | Tipo       | Descripción                        |
|-----------------|------------|------------------------------------|
| `id`            | `number`   | Identificador único (auto-generado)|
| `nombre`        | `string`   | Nombre de la canción               |
| `duracion`      | `number`   | Duración en segundos               |
| `reproducciones`| `number`   | Cantidad de reproducciones         |
| `generoMusical` | `string[]` | Lista de géneros musicales         |
| `artista`       | `Artista`  | Artista asociado                   |
| `album`         | `string`   | Nombre del álbum                   |

### Playlist

| Campo          | Tipo       | Descripción                        |
|----------------|------------|------------------------------------|
| `id`           | `number`   | Identificador único (auto-generado)|
| `nombre`       | `string`   | Nombre de la playlist              |
| `fechaCreacion`| `Date`     | Fecha de creación                  |
| `canciones`    | `Cancion[]`| Lista de canciones                 |

---

## Endpoints

### Artistas

#### `GET /artistas`
Retorna la lista de todos los artistas.

**Response `200`**
```json
[
  {
    "id": 1720000000000,
    "nombre": "Bad Bunny",
    "biografia": "Cantante de trap y reggaeton",
    "pais": "Puerto Rico",
    "generoMusical": ["trap", "reggaeton"],
    "oyentesMensuales": 50000000,
    "tipo": "solista",
    "verificado": true
  }
]
```

---

#### `GET /artistas/:id`
Retorna un artista por su id.

**Params**
| Nombre | Tipo     | Descripción       |
|--------|----------|-------------------|
| `id`   | `number` | Id del artista    |

**Response `200`**
```json
{
  "id": 1720000000000,
  "nombre": "Bad Bunny",
  "biografia": "Cantante de trap y reggaeton",
  "pais": "Puerto Rico",
  "generoMusical": ["trap", "reggaeton"],
  "oyentesMensuales": 50000000,
  "tipo": "solista",
  "verificado": true
}
```

**Response `404`** — Artista no encontrado.

---

#### `POST /artistas`
Crea un nuevo artista.

**Body**
```json
{
  "nombre": "Bad Bunny",
  "biografia": "Cantante de trap y reggaeton",
  "pais": "Puerto Rico",
  "generoMusical": ["trap", "reggaeton"],
  "oyentesMensuales": 50000000,
  "tipo": "solista",
  "verificado": true
}
```

**Response `201`**
```json
{
  "id": 1720000000000,
  "nombre": "Bad Bunny",
  "biografia": "Cantante de trap y reggaeton",
  "pais": "Puerto Rico",
  "generoMusical": ["trap", "reggaeton"],
  "oyentesMensuales": 50000000,
  "tipo": "solista",
  "verificado": true
}
```

---

### Canciones

#### `GET /canciones`
Retorna la lista de todas las canciones.

**Response `200`**
```json
[
  {
    "id": 1720000000001,
    "nombre": "Tití Me Preguntó",
    "duracion": 238,
    "reproducciones": 1200000000,
    "generoMusical": ["reggaeton"],
    "artista": { "id": 1720000000000, "nombre": "Bad Bunny", "..." : "..." },
    "album": "Un Verano Sin Ti"
  }
]
```

---

#### `GET /canciones/:id`
Retorna una canción por su id.

**Params**
| Nombre | Tipo     | Descripción       |
|--------|----------|-------------------|
| `id`   | `number` | Id de la canción  |

**Response `200`**
```json
{
  "id": 1720000000001,
  "nombre": "Tití Me Preguntó",
  "duracion": 238,
  "reproducciones": 1200000000,
  "generoMusical": ["reggaeton"],
  "artista": { "id": 1720000000000, "nombre": "Bad Bunny", "..." : "..." },
  "album": "Un Verano Sin Ti"
}
```

**Response `404`** — Canción no encontrada.

---

#### `POST /canciones`
Crea una nueva canción.

**Body**
```json
{
  "nombre": "Tití Me Preguntó",
  "duracion": 238,
  "reproducciones": 1200000000,
  "generoMusical": ["reggaeton"],
  "artista": {
    "id": 1720000000000,
    "nombre": "Bad Bunny",
    "biografia": "...",
    "pais": "Puerto Rico",
    "generoMusical": ["reggaeton"],
    "oyentesMensuales": 50000000,
    "tipo": "solista",
    "verificado": true
  },
  "album": "Un Verano Sin Ti"
}
```

**Response `201`**
```json
{
  "id": 1720000000001,
  "nombre": "Tití Me Preguntó",
  "duracion": 238,
  "reproducciones": 1200000000,
  "generoMusical": ["reggaeton"],
  "artista": { "..." : "..." },
  "album": "Un Verano Sin Ti"
}
```

---

### Playlists

#### `GET /playlists`
Retorna la lista de todas las playlists.

**Response `200`**
```json
[
  {
    "id": 1720000000002,
    "nombre": "Mis favoritas",
    "fechaCreacion": "2026-07-14T00:00:00.000Z",
    "canciones": []
  }
]
```

---

#### `GET /playlists/:id`
Retorna una playlist por su id.

**Params**
| Nombre | Tipo     | Descripción       |
|--------|----------|-------------------|
| `id`   | `number` | Id de la playlist |

**Response `200`**
```json
{
  "id": 1720000000002,
  "nombre": "Mis favoritas",
  "fechaCreacion": "2026-07-14T00:00:00.000Z",
  "canciones": []
}
```

**Response `404`** — Playlist no encontrada.

---

#### `POST /playlists`
Crea una nueva playlist.

**Body**
```json
{
  "nombre": "Mis favoritas",
  "fechaCreacion": "2026-07-14T00:00:00.000Z",
  "canciones": []
}
```

**Response `201`**
```json
{
  "id": 1720000000002,
  "nombre": "Mis favoritas",
  "fechaCreacion": "2026-07-14T00:00:00.000Z",
  "canciones": []
}
```

---

## Resumen de endpoints

| Método | Ruta             | Descripción                   |
|--------|------------------|-------------------------------|
| GET    | `/artistas`      | Listar todos los artistas     |
| GET    | `/artistas/:id`  | Obtener artista por id        |
| POST   | `/artistas`      | Crear un artista              |
| GET    | `/canciones`     | Listar todas las canciones    |
| GET    | `/canciones/:id` | Obtener canción por id        |
| POST   | `/canciones`     | Crear una canción             |
| GET    | `/playlists`     | Listar todas las playlists    |
| GET    | `/playlists/:id` | Obtener playlist por id       |
| POST   | `/playlists`     | Crear una playlist            |

import { Cancion } from './cancion.model';

export interface Playlist {
  id: number;
  nombre: string;
  fechaCreacion: Date;
  canciones: Cancion[];
}

export type CreatePlaylistDto = Omit<Playlist, 'id'>;

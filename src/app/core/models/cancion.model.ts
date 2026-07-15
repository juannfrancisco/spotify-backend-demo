import { Artista } from './artista.model';

export interface Cancion {
  id: number;
  nombre: string;
  duracion: number;
  reproducciones: number;
  generoMusical: string[];
  artista: Artista;
  album: string;
}

export type CreateCancionDto = Omit<Cancion, 'id'>;

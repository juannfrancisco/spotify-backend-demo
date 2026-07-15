export interface Artista {
  id: number;
  nombre: string;
  biografia: string;
  pais: string;
  generoMusical: string[];
  oyentesMensuales: number;
  tipo: string;
  verificado: boolean;
}

export type CreateArtistaDto = Omit<Artista, 'id'>;

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Artista, CreateArtistaDto } from '@core/models/artista.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistasService {
  private readonly baseUrl = `${environment.apiEndpoint}/artistas`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Artista[]> {
    return this.http.get<Artista[]>(this.baseUrl);
  }

  getById(id: number): Observable<Artista> {
    return this.http.get<Artista>(`${this.baseUrl}/${id}`);
  }

  create(artista: CreateArtistaDto): Observable<Artista> {
    return this.http.post<Artista>(this.baseUrl, artista);
  }
}

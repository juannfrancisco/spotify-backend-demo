import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Cancion, CreateCancionDto } from '@core/models/cancion.model';

@Injectable({
  providedIn: 'root'
})
export class CancionesService {
  private readonly baseUrl = `${environment.apiEndpoint}/canciones`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(this.baseUrl);
  }

  getById(id: number): Observable<Cancion> {
    return this.http.get<Cancion>(`${this.baseUrl}/${id}`);
  }

  create(cancion: CreateCancionDto): Observable<Cancion> {
    return this.http.post<Cancion>(this.baseUrl, cancion);
  }
}

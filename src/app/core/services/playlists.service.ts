import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Playlist, CreatePlaylistDto } from '@core/models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private readonly baseUrl = `${environment.apiEndpoint}/playlists`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(this.baseUrl);
  }

  getById(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.baseUrl}/${id}`);
  }

  create(playlist: CreatePlaylistDto): Observable<Playlist> {
    return this.http.post<Playlist>(this.baseUrl, playlist);
  }
}

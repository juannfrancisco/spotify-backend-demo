import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericModel } from '../models/generic.model';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '@env';
import { SYSTEM_ENDPOINTS } from '@shared/constants/endpoints.constants';
import { CreateGenericDto } from '../models/create-generic.dto';
import { UpdateGenericDto } from '../models/update-generic.dto';
import { GenericApiResponse } from '../models/generic-api-response.model';
import { ApiResponse } from '../models/api-response.model';

/**
 * Servicio para operaciones CRUD de registros genéricos.
 * 
 * IMPORTANTE: Todas las operaciones requieren autenticación con:
 * - Bearer Token (JWT): Agregado automáticamente por AuthInterceptor
 * - x-csrf-token: Agregado automáticamente por AuthInterceptor
 * 
 * Ambos tokens son obtenidos durante el proceso de login y almacenados 
 * en sessionStorage por el AuthService.
 */
@Injectable({
  providedIn: 'root'
})
export class GenericService {
  private readonly apiUrl = environment.apiEndpoint;
  private readonly baseUrl = `${this.apiUrl}/${SYSTEM_ENDPOINTS.generics}`;

  constructor(
    private readonly http: HttpClient
  ) {}

  /**
   * Obtener todos los registros genéricos
   * REQUIERE: Bearer Token + x-csrf-token
   * @returns Observable<GenericModel[]>
   */
  getRecords(): Observable<GenericModel[]> {
    return this.http.get<GenericApiResponse[]>(this.baseUrl).pipe(
      map(response => this.mapApiResponseToModel(response)),
      catchError(error => {
        // Manejar errores específicos de autenticación
        if (error.status === 401) {
          console.error('Token inválido o expirado');
        } else if (error.status === 403) {
          console.error('Acceso denegado - verificar permisos o CSRF token');
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Crear un nuevo registro
   * @param genericDto Datos para crear el registro
   * @returns Observable<ApiResponse<GenericApiResponse>>
   */
  postRecord(genericDto: CreateGenericDto): Observable<ApiResponse<GenericApiResponse>> {
    return this.http.post<GenericApiResponse>(this.baseUrl, genericDto).pipe(
      map(response => ({
        message: 'Registro creado exitosamente',
        status: 201,
        data: response
      }))
    );
  }

  /**
   * Actualizar un registro existente
   * @param id ID del registro a actualizar
   * @param genericDto Datos actualizados
   * @returns Observable<ApiResponse<GenericApiResponse>>
   */
  putRecord(id: string, genericDto: UpdateGenericDto): Observable<ApiResponse<GenericApiResponse>> {
    return this.http.put<GenericApiResponse>(`${this.baseUrl}/${id}`, genericDto).pipe(
      map(response => ({
        message: 'Registro actualizado exitosamente',
        status: 200,
        data: response
      }))
    );
  }

  /**
   * Eliminar un registro
   * @param id ID del registro a eliminar
   * @returns Observable<ApiResponse>
   */
  deleteRecord(id: string): Observable<ApiResponse> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(() => ({
        message: 'Registro eliminado exitosamente',
        status: 200
      }))
    );
  }

  /**
   * Obtener un registro por ID
   * @param id ID del registro
   * @returns Observable<GenericModel | undefined>
   */
  getRecordById(id: string): Observable<GenericModel | undefined> {
    return this.http.get<GenericApiResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => this.mapSingleApiResponseToModel(response))
    );
  }

  /**
   * Verifica si el usuario tiene los tokens necesarios para hacer peticiones
   * @returns boolean - true si tiene ambos tokens
   */
  private hasRequiredTokens(): boolean {
    const bearerToken = sessionStorage.getItem('ZPR_TOKEN');
    const csrfToken = sessionStorage.getItem('ZPR_CSRF_TOKEN');
    return !!(bearerToken && csrfToken);
  }

  /**
   * Mapear array de respuestas de API a modelos del frontend
   * @param apiResponses Array de respuestas de la API
   * @returns GenericModel[]
   */
  private mapApiResponseToModel(apiResponses: GenericApiResponse[]): GenericModel[] {
    return apiResponses.map(response => this.mapSingleApiResponseToModel(response));
  }

  /**
   * Mapear una respuesta de API a modelo del frontend
   * @param apiResponse Respuesta de la API
   * @returns GenericModel
   */
  private mapSingleApiResponseToModel(apiResponse: GenericApiResponse): GenericModel {
    return {
      id: apiResponse.id,
      name: apiResponse.name,
      description: apiResponse.description ?? '',
      date: apiResponse.createdAt ?? new Date().toISOString().split('T')[0],
      status: apiResponse.status ?? 'Pendiente'
    };
  }

  /**
   * Mapear modelo del frontend a DTO para crear
   * @param model Modelo del frontend
   * @returns CreateGenericDto
   */
  mapModelToCreateDto(model: GenericModel): CreateGenericDto {
    return {
      name: model.name,
      description: model.description,
      status: model.status
    };
  }

  /**
   * Mapear modelo del frontend a DTO para actualizar
   * @param model Modelo del frontend
   * @returns UpdateGenericDto
   */
  mapModelToUpdateDto(model: GenericModel): UpdateGenericDto {
    const updateDto: UpdateGenericDto = {};
    
    // Solo incluir campos que tienen valores válidos para evitar enviar datos vacíos
    if (model.name?.trim()) {
      updateDto.name = model.name.trim();
    }

    if (model.description?.trim()) {
      updateDto.description = model.description.trim();
    }

    if (model.status?.trim()) {
      updateDto.status = model.status.trim();
    }
    
    return updateDto;
  }

}

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GenericService } from './generic.services';
import { GenericModel } from '../models/generic.model';
import { CreateGenericDto } from '../models/create-generic.dto';
import { UpdateGenericDto } from '../models/update-generic.dto';
import { GenericApiResponse } from '../models/generic-api-response.model';
import { environment } from '@env';
import { SYSTEM_ENDPOINTS } from '@shared/constants/endpoints.constants';

describe('GenericService', () => {
  let service: GenericService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiEndpoint}/${SYSTEM_ENDPOINTS.generics}`;

  const mockApiResponse: GenericApiResponse = {
    id: '1',
    name: 'Test Record',
    description: 'Test Description',
    createdAt: '2024-01-01',
    status: 'Active'
  };

  const mockGenericModel: GenericModel = {
    id: '1',
    name: 'Test Record',
    description: 'Test Description',
    date: '2024-01-01',
    status: 'Active'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GenericService]
    });
    service = TestBed.inject(GenericService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRecords', () => {
    it('should return mapped generic models from API response', () => {
      const mockApiResponses: GenericApiResponse[] = [mockApiResponse];
      const expectedModels: GenericModel[] = [mockGenericModel];

      service.getRecords().subscribe(records => {
        expect(records).toEqual(expectedModels);
        expect(records.length).toBe(1);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponses);
    });

    it('should handle 401 error (invalid token)', () => {
      spyOn(console, 'error');

      service.getRecords().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(console.error).toHaveBeenCalledWith('Token inválido o expirado');
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 403 error (access denied)', () => {
      spyOn(console, 'error');

      service.getRecords().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(403);
          expect(console.error).toHaveBeenCalledWith('Acceso denegado - verificar permisos o CSRF token');
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle other errors without specific logging', () => {
      service.getRecords().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('postRecord', () => {
    it('should create a new record', () => {
      const createDto: CreateGenericDto = {
        name: 'New Record',
        description: 'New Description',
        status: 'Active'
      };

      service.postRecord(createDto).subscribe(response => {
        expect(response.message).toBe('Registro creado exitosamente');
        expect(response.status).toBe(201);
        expect(response.data).toEqual(mockApiResponse);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createDto);
      req.flush(mockApiResponse);
    });
  });

  describe('putRecord', () => {
    it('should update an existing record', () => {
      const id = '1';
      const updateDto: UpdateGenericDto = {
        name: 'Updated Record',
        description: 'Updated Description'
      };

      service.putRecord(id, updateDto).subscribe(response => {
        expect(response.message).toBe('Registro actualizado exitosamente');
        expect(response.status).toBe(200);
        expect(response.data).toEqual(mockApiResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateDto);
      req.flush(mockApiResponse);
    });
  });

  describe('deleteRecord', () => {
    it('should delete a record', () => {
      const id = '1';

      service.deleteRecord(id).subscribe(response => {
        expect(response.message).toBe('Registro eliminado exitosamente');
        expect(response.status).toBe(200);
      });

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('getRecordById', () => {
    it('should return a mapped generic model by id', () => {
      const id = '1';

      service.getRecordById(id).subscribe(record => {
        expect(record).toEqual(mockGenericModel);
      });

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });
  });

  describe('hasRequiredTokens (private)', () => {
    afterEach(() => {
      sessionStorage.removeItem('ZPR_TOKEN');
      sessionStorage.removeItem('ZPR_CSRF_TOKEN');
    });

    it('should return false when no tokens are present', () => {
      sessionStorage.removeItem('ZPR_TOKEN');
      sessionStorage.removeItem('ZPR_CSRF_TOKEN');
      expect((service as any).hasRequiredTokens()).toBeFalse();
    });

    it('should return false when only bearer token is present', () => {
      sessionStorage.setItem('ZPR_TOKEN', 'some-token');
      sessionStorage.removeItem('ZPR_CSRF_TOKEN');
      expect((service as any).hasRequiredTokens()).toBeFalse();
    });
  });

  describe('mapModelToCreateDto', () => {
    it('should map GenericModel to CreateGenericDto', () => {
      const result = service.mapModelToCreateDto(mockGenericModel);
      
      expect(result).toEqual({
        name: 'Test Record',
        description: 'Test Description',
        status: 'Active'
      });
    });
  });

  describe('mapModelToUpdateDto', () => {
    it('should map GenericModel to UpdateGenericDto with valid fields', () => {
      const result = service.mapModelToUpdateDto(mockGenericModel);
      
      expect(result).toEqual({
        name: 'Test Record',
        description: 'Test Description',
        status: 'Active'
      });
    });

    it('should exclude empty or whitespace-only fields', () => {
      const modelWithEmptyFields: GenericModel = {
        id: '1',
        name: '  ',
        description: '',
        date: '2024-01-01',
        status: 'Active'
      };

      const result = service.mapModelToUpdateDto(modelWithEmptyFields);
      
      expect(result).toEqual({
        status: 'Active'
      });
      expect(result.name).toBeUndefined();
      expect(result.description).toBeUndefined();
    });

    it('should trim whitespace from valid fields', () => {
      const modelWithWhitespace: GenericModel = {
        id: '1',
        name: '  Test Record  ',
        description: '  Test Description  ',
        date: '2024-01-01',
        status: '  Active  '
      };

      const result = service.mapModelToUpdateDto(modelWithWhitespace);
      
      expect(result).toEqual({
        name: 'Test Record',
        description: 'Test Description',
        status: 'Active'
      });
    });

    it('should handle undefined fields', () => {
      const modelWithUndefinedFields: GenericModel = {
        id: '1',
        name: undefined as any,
        description: undefined as any,
        date: '2024-01-01',
        status: 'Active'
      };

      const result = service.mapModelToUpdateDto(modelWithUndefinedFields);
      
      expect(result).toEqual({
        status: 'Active'
      });
    });
  });
});

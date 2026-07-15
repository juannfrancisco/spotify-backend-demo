import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SidebarComponent } from './sidebar.component';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockSvgIconRegistryService = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);
    mockActivatedRoute = {
      params: of({}),
      snapshot: { params: {} }
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SvgIconRegistryService, useValue: mockSvgIconRegistryService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { SvgIconRegistryService } from 'angular-svg-icon';

import { NavbarMobileComponent } from './navbar-mobile.component';

describe('NavbarMobileComponent', () => {
  let component: NavbarMobileComponent;
  let fixture: ComponentFixture<NavbarMobileComponent>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockSvgIconRegistryService = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { params: {} },
      params: { subscribe: jasmine.createSpy().and.returnValue({ unsubscribe: jasmine.createSpy() }) }
    });

    await TestBed.configureTestingModule({
      imports: [NavbarMobileComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SvgIconRegistryService, useValue: mockSvgIconRegistryService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

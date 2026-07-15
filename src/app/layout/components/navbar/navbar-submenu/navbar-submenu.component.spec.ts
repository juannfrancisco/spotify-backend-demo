import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NavbarSubmenuComponent } from './navbar-submenu.component';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('NavbarSubmenuComponent', () => {
  let component: NavbarSubmenuComponent;
  let fixture: ComponentFixture<NavbarSubmenuComponent>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;

  beforeEach(async () => {
    mockSvgIconRegistryService = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);

    await TestBed.configureTestingModule({
      imports: [NavbarSubmenuComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SvgIconRegistryService, useValue: mockSvgIconRegistryService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarSubmenuComponent);
    component = fixture.componentInstance;
    
    // Initialize submenu as empty array to avoid NgFor error
    component.submenu = [];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty submenu', () => {
    expect(component.submenu).toEqual([]);
  });

  it('should render without errors when submenu is empty', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should handle submenu with parent items (no children)', () => {
    const mockSubmenu = [
      { route: '/test1', label: 'Test 1', icon: 'test-icon' },
      { route: '/test2', label: 'Test 2' }
    ];
    
    component.submenu = mockSubmenu;
    fixture.detectChanges();

    expect(component.submenu.length).toBe(2);
    expect(component.submenu[0].route).toBe('/test1');
  });

  it('should handle submenu with child items', () => {
    const mockSubmenu = [
      { 
        route: '/parent', 
        label: 'Parent Item', 
        children: [
          { route: '/child1', label: 'Child 1' },
          { route: '/child2', label: 'Child 2' }
        ]
      }
    ];
    
    component.submenu = mockSubmenu;
    fixture.detectChanges();

    expect(component.submenu[0].children).toBeDefined();
    expect(component.submenu[0].children?.length).toBe(2);
  });

  it('should call ngAfterViewInit and handle submenu positioning', () => {
    // Mock getBoundingClientRect for submenuRef
    const mockSubmenuRect = { right: 1200 };
    const mockBodyRect = { right: 1000 };
    const mockParentNode = { style: { left: '' } };

    // Create spy for getBoundingClientRect
    spyOn(document.body, 'getBoundingClientRect').and.returnValue(mockBodyRect as DOMRect);
    
    // Set up component with submenuRef mock
    component.submenuRef = {
      nativeElement: {
        getBoundingClientRect: jasmine.createSpy().and.returnValue(mockSubmenuRect),
        parentNode: mockParentNode
      }
    } as any;

    // Call ngAfterViewInit
    component.ngAfterViewInit();

    // Verify positioning adjustment when submenu is out of bounds
    expect(mockParentNode.style.left).toBe('-100%');
  });

  it('should not adjust positioning when submenu is within bounds', () => {
    const mockSubmenuRect = { right: 800 };
    const mockBodyRect = { right: 1000 };
    const mockParentNode = { style: { left: '' } };

    spyOn(document.body, 'getBoundingClientRect').and.returnValue(mockBodyRect as DOMRect);
    
    component.submenuRef = {
      nativeElement: {
        getBoundingClientRect: jasmine.createSpy().and.returnValue(mockSubmenuRect),
        parentNode: mockParentNode
      }
    } as any;

    component.ngAfterViewInit();

    // Should not adjust positioning when within bounds
    expect(mockParentNode.style.left).toBe('');
  });

  it('should handle ngAfterViewInit when submenuRef is undefined', () => {
    component.submenuRef = undefined;
    
    expect(() => component.ngAfterViewInit()).not.toThrow();
  });
});

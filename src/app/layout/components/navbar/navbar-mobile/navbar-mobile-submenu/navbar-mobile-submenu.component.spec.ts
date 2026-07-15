import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarMobileSubmenuComponent } from './navbar-mobile-submenu.component';
import { MenuService } from '../../../../services/menu.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent { }

describe('NavbarMobileSubmenuComponent', () => {
  let component: NavbarMobileSubmenuComponent;
  let fixture: ComponentFixture<NavbarMobileSubmenuComponent>;
  let mockMenuService: jasmine.SpyObj<MenuService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create a mock service that tracks state changes
    const mockMenuServiceObject = {
      _showMobileMenu: true,
      _showSideBar: true,
      toggleSubMenu: jasmine.createSpy('toggleSubMenu'),
      get showMobileMenu() { return this._showMobileMenu; },
      set showMobileMenu(value: boolean) { this._showMobileMenu = value; },
      get showSideBar() { return this._showSideBar; },
      set showSideBar(value: boolean) { this._showSideBar = value; }
    };
    
    mockMenuService = mockMenuServiceObject as any;
    mockSvgIconRegistryService = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NavbarMobileSubmenuComponent,
        RouterTestingModule.withRoutes([
          { path: 'test', component: DummyComponent },
          { path: 'child1', component: DummyComponent },
          { path: 'child2', component: DummyComponent },
          { path: 'grandchild', component: DummyComponent },
          { path: 'child', component: DummyComponent }
        ])
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MenuService, useValue: mockMenuService },
        { provide: SvgIconRegistryService, useValue: mockSvgIconRegistryService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarMobileSubmenuComponent);
    component = fixture.componentInstance;
    
    // Initialize submenu as empty object to avoid errors
    component.submenu = { children: [] };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty submenu children', () => {
    expect(component.submenu.children).toEqual([]);
  });

  it('should call toggleSubMenu when toggleMenu is called', () => {
    const mockMenu = { label: 'Test Menu', expanded: false };
    
    component.toggleMenu(mockMenu);
    
    expect(mockMenuService.toggleSubMenu).toHaveBeenCalledWith(mockMenu);
  });

  it('should set showMobileMenu to false when closeMobileMenu is called', () => {
    // Initially true
    expect(mockMenuService.showMobileMenu).toBeTrue();
    
    component.closeMobileMenu();
    
    // Verify that the setter was called with false
    expect(mockMenuService.showMobileMenu).toBe(false);
  });

  it('should handle submenu with parent items (no children)', () => {
    const mockSubmenu = {
      children: [
        { route: '/test1', label: 'Test 1' },
        { route: '/test2', label: 'Test 2' }
      ]
    };
    
    component.submenu = mockSubmenu;
    fixture.detectChanges();

    expect(component.submenu.children?.length).toBe(2);
    expect(component.submenu.children?.[0].route).toBe('/test1');
  });

  it('should handle submenu with child items', () => {
    const mockSubmenu = {
      children: [
        { 
          label: 'Parent Item', 
          children: [
            { route: '/child1', label: 'Child 1' },
            { route: '/child2', label: 'Child 2' }
          ]
        }
      ]
    };
    
    component.submenu = mockSubmenu;
    fixture.detectChanges();

    expect(component.submenu.children?.[0].children).toBeDefined();
    expect(component.submenu.children?.[0].children?.length).toBe(2);
  });

  it('should collapse items correctly', () => {
    const mockItems = [
      { expanded: true, children: [
        { expanded: true, children: [] }
      ]},
      { expanded: true }
    ];
    
    // Call private method through any type casting
    (component as any).collapse(mockItems);
    
    expect(mockItems[0].expanded).toBeFalse();
    expect(mockItems[0].children?.[0].expanded).toBeFalse();
    expect(mockItems[1].expanded).toBeFalse();
  });

  it('should render content correctly when expanded', () => {
    const mockSubmenu = {
      expanded: true,
      children: [
        { route: '/test', label: 'Test Item' }
      ]
    };
    
    component.submenu = mockSubmenu;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Item');
  });

  it('should have correct class when submenu is not expanded', () => {
    const mockSubmenu = {
      expanded: false,
      children: []
    };
    
    component.submenu = mockSubmenu;
    fixture.detectChanges();

    const containerDiv = fixture.nativeElement.querySelector('div');
    expect(containerDiv.classList.contains('max-h-0')).toBeTrue();
  });
});

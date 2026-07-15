import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarSubmenuComponent } from './sidebar-submenu.component';
import { MenuService } from '../../../services/menu.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent { }

describe('SidebarSubmenuComponent', () => {
  let component: SidebarSubmenuComponent;
  let fixture: ComponentFixture<SidebarSubmenuComponent>;
  let mockMenuService: jasmine.SpyObj<MenuService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockMenuService = jasmine.createSpyObj('MenuService', ['toggleSubMenu'], {
      showSideBar: true
    });
    mockSvgIconRegistryService = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        SidebarSubmenuComponent,
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
    fixture = TestBed.createComponent(SidebarSubmenuComponent);
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

  it('should handle submenu with child items', () => {
    const mockSubmenu = {
      children: [
        { route: '/child1', label: 'Child 1' },
        { route: '/child2', label: 'Child 2', children: [
          { route: '/grandchild', label: 'Grandchild' }
        ]}
      ]
    };
    
    component.submenu = mockSubmenu;
    fixture.detectChanges();

    expect(component.submenu.children?.length).toBe(2);
    expect(component.submenu.children?.[1].children).toBeDefined();
  });

  it('should collapse items with children', () => {
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

  it('should render parent menu items correctly', () => {
    const mockSubmenu = {
      children: [
        { route: '/test', label: 'Test Item', icon: 'test-icon' }
      ]
    };
    
    component.submenu = mockSubmenu;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Item');
  });

  it('should render child menu items with expand button', () => {
    const mockSubmenu = {
      children: [
        { 
          label: 'Parent Item', 
          children: [
            { route: '/child', label: 'Child Item' }
          ]
        }
      ]
    };
    
    component.submenu = mockSubmenu;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Parent Item');
  });

  it('should access menuService correctly', () => {
    expect(component.menuService).toBe(mockMenuService);
    expect(component.menuService.showSideBar).toBeTrue();
  });
});

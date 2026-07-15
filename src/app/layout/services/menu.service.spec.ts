import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from './menu.service';
import { Subject } from 'rxjs';
import { Menu } from '@shared/constants/menu';
import { MenuItem, SubMenuItem } from '@core/models/menu.model';

describe('MenuService', () => {
  let service: MenuService;
  let router: jasmine.SpyObj<Router>;
  let routerEventsSubject: Subject<any>;

  beforeEach(() => {
    routerEventsSubject = new Subject();
    const routerSpy = jasmine.createSpyObj('Router', ['isActive', 'createUrlTree'], {
      events: routerEventsSubject.asObservable()
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    service = TestBed.inject(MenuService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with menu from Menu.pages', () => {
    expect(service.pagesMenu).toEqual(Menu.pages);
  });

  it('should have initial sidebar and mobile menu state', () => {
    expect(service.showSideBar).toBe(true);
    expect(service.showMobileMenu).toBe(false);
  });

  it('should toggle sidebar correctly', () => {
    const initialState = service.showSideBar;
    service.toggleSidebar();
    expect(service.showSideBar).toBe(!initialState);

    service.toggleSidebar();
    expect(service.showSideBar).toBe(initialState);
  });

  it('should set sidebar and mobile menu states', () => {
    service.showSideBar = false;
    expect(service.showSideBar).toBe(false);

    service.showMobileMenu = true;
    expect(service.showMobileMenu).toBe(true);
  });

  it('should toggle menu and set sidebar to true', () => {
    const mockMenu = { expanded: false };
    service.showSideBar = false;

    service.toggleMenu(mockMenu);

    expect(service.showSideBar).toBe(true);
    expect(mockMenu.expanded).toBe(true);
  });

  it('should toggle submenu expanded state', () => {
    const mockSubmenu: SubMenuItem = {
      label: 'Test',
      route: '/test',
      expanded: false,
      active: false
    };

    service.toggleSubMenu(mockSubmenu);
    expect(mockSubmenu.expanded).toBe(true);

    service.toggleSubMenu(mockSubmenu);
    expect(mockSubmenu.expanded).toBe(false);
  });

  it('should handle navigation end events and update menu states', () => {
    const mockUrlTree = {} as any;
    router.createUrlTree.and.returnValue(mockUrlTree);
    router.isActive.and.returnValue(true);

    // Simulate NavigationEnd event
    routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));

    expect(router.isActive).toHaveBeenCalled();
    expect(router.createUrlTree).toHaveBeenCalled();
  });

  it('should expand children when a subMenu has children on NavigationEnd', () => {
    const mockUrlTree = {} as any;
    router.createUrlTree.and.returnValue(mockUrlTree);
    router.isActive.and.returnValue(false);

    // Temporarily override pagesMenu to include a subMenu with children
    const menuWithChildren: MenuItem[] = [{
      group: 'Group',
      active: false,
      items: [{
        label: 'Parent',
        route: '/parent',
        expanded: false,
        active: false,
        children: [{ label: 'Child', route: '/parent/child', expanded: false, active: false }]
      }]
    }];
    service['_pagesMenu'].set(menuWithChildren);

    routerEventsSubject.next(new NavigationEnd(1, '/parent/child', '/parent/child'));

    expect(router.isActive).toHaveBeenCalled();
  });

  it('should not process non-NavigationEnd events', () => {
    router.isActive.and.returnValue(false);

    // Simulate non-NavigationEnd event
    routerEventsSubject.next({ type: 'other' });

    expect(router.isActive).not.toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(service['_subscription'], 'unsubscribe');

    service.ngOnDestroy();

    expect(service['_subscription'].unsubscribe).toHaveBeenCalled();
  });

  it('should check if route is active correctly', () => {
    const mockUrlTree = {} as any;
    router.createUrlTree.and.returnValue(mockUrlTree);
    router.isActive.and.returnValue(true);

    const result = service['isActive']('/test');

    expect(router.createUrlTree).toHaveBeenCalledWith(['/test']);
    expect(router.isActive).toHaveBeenCalledWith(mockUrlTree, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
    expect(result).toBe(true);
  });
});

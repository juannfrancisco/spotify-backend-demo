import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { ProfileMenuComponent } from './profile-menu.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { Theme } from '@core/models/theme.model';

class MockThemeService {
  theme = signal<Theme>({ mode: 'dark', color: 'blue', direction: 'ltr' });
  get isDark() { return this.theme().mode === 'dark'; }
}

const mockUserData = {
  id: '1', name: 'Test User', email: 'test@example.com',
  lastname: 'Last', role: 'admin', status: true, username: 'testuser', avatar: 'avatar.jpg'
};

function buildTestBed(themeService: MockThemeService, getUserDataReturn: any) {
  const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'logout', 'getUserData']);
  const svgSpy = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);
  authSpy.isAuthenticated.and.returnValue(true);
  authSpy.getUserData.and.returnValue(getUserDataReturn);

  TestBed.configureTestingModule({
    imports: [ProfileMenuComponent],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideNoopAnimations(),
      { provide: AuthService, useValue: authSpy },
      { provide: ThemeService, useValue: themeService },
      { provide: SvgIconRegistryService, useValue: svgSpy },
    ]
  });

  return authSpy;
}

describe('ProfileMenuComponent', () => {
  let component: ProfileMenuComponent;
  let fixture: ComponentFixture<ProfileMenuComponent>;
  let mockThemeService: MockThemeService;

  describe('with dark theme (isDark = true)', () => {
    beforeEach(async () => {
      mockThemeService = new MockThemeService();
      mockThemeService.theme.set({ mode: 'dark', color: 'blue', direction: 'ltr' });
      buildTestBed(mockThemeService, mockUserData);
      await TestBed.compileComponents();

      fixture = TestBed.createComponent(ProfileMenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set profile from getUserData on init', () => {
      expect(component.profile.name).toBe('Test User');
    });

    it('should show "Modo Claro" title when isDark is true', () => {
      expect(component.profileMenu[0].title).toBe('Modo Claro');
    });

    it('should show sun icon when isDark is true', () => {
      expect(component.profileMenu[0].icon).toContain('sun.svg');
    });

    it('should toggle isOpen on toggleMenu', () => {
      expect(component.isOpen).toBeFalse();
      component.toggleMenu();
      expect(component.isOpen).toBeTrue();
      component.toggleMenu();
      expect(component.isOpen).toBeFalse();
    });

    it('should switch to light mode on toggleTheme and update menu', () => {
      component.toggleTheme();
      expect(mockThemeService.theme().mode).toBe('light');
      expect(component.profileMenu[0].title).toBe('Modo Oscuro');
      expect(component.profileMenu[0].icon).toContain('moon.svg');
    });

    it('should toggle back to dark mode on second toggleTheme call', () => {
      component.toggleTheme(); // dark → light
      component.toggleTheme(); // light → dark
      expect(mockThemeService.theme().mode).toBe('dark');
      expect(component.profileMenu[0].title).toBe('Modo Claro');
    });
  });

  describe('with light theme (isDark = false)', () => {
    beforeEach(async () => {
      mockThemeService = new MockThemeService();
      mockThemeService.theme.set({ mode: 'light', color: 'blue', direction: 'ltr' });
      buildTestBed(mockThemeService, mockUserData);
      await TestBed.compileComponents();

      fixture = TestBed.createComponent(ProfileMenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show "Modo Oscuro" title when isDark is false', () => {
      expect(component.profileMenu[0].title).toBe('Modo Oscuro');
    });

    it('should show moon icon when isDark is false', () => {
      expect(component.profileMenu[0].icon).toContain('moon.svg');
    });
  });

  describe('ngOnInit with null userData', () => {
    beforeEach(async () => {
      mockThemeService = new MockThemeService();
      buildTestBed(mockThemeService, null);
      await TestBed.compileComponents();

      fixture = TestBed.createComponent(ProfileMenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not set profile when getUserData returns null', () => {
      expect(component.profile).toEqual({} as any);
    });
  });
});

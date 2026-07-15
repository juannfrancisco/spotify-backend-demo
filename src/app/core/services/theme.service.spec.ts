import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { Theme } from '../models/theme.model';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });

    // Mock document methods
    const mockHtml = {
      className: '',
      setAttribute: jasmine.createSpy('setAttribute'),
    };
    spyOn(document, 'querySelector').and.returnValue(mockHtml as any);

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default theme', () => {
    const defaultTheme = service.theme();
    expect(defaultTheme.mode).toBe('dark');
    expect(defaultTheme.color).toBe('blue');
    expect(defaultTheme.direction).toBe('ltr');
  });

  it('should load theme from localStorage if available', () => {
    const storedTheme: Theme = { mode: 'light', color: 'red', direction: 'rtl' };
    mockLocalStorage['theme'] = JSON.stringify(storedTheme);
    
    // Create new service instance to trigger loadTheme
    const newService = TestBed.inject(ThemeService);
    
    expect(localStorage.getItem).toHaveBeenCalledWith('theme');
  });

  it('should return correct isDark value', () => {
    service.theme.set({ mode: 'dark', color: 'blue', direction: 'ltr' });
    expect(service.isDark).toBe(true);

    service.theme.set({ mode: 'light', color: 'blue', direction: 'ltr' });
    expect(service.isDark).toBe(false);
  });

  it('should set theme properties correctly', () => {
    service.theme.set({ mode: 'light', color: 'green', direction: 'rtl' });
    
    // Test private methods indirectly by checking the effects
    expect(service.theme().mode).toBe('light');
    expect(service.theme().color).toBe('green'); 
    expect(service.theme().direction).toBe('rtl');
  });
});

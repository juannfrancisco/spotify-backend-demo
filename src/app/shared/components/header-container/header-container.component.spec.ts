import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderContainerComponent } from './header-container.component';
import { MenuFloatingComponent } from '../menu-floating/menu-floating.component';
import { MenuFloatingItem } from '../menu-floating/model/menu-floating-item.model';
import { By } from '@angular/platform-browser';

@Component({ selector: 'app-menu-floating', template: '', standalone: true })
class MenuFloatingStubComponent {
  @Input() items: MenuFloatingItem[] = [];
}

describe('HeaderContainerComponent', () => {
  let component: HeaderContainerComponent;
  let fixture: ComponentFixture<HeaderContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderContainerComponent],
    })
      .overrideComponent(HeaderContainerComponent, {
        remove: { imports: [MenuFloatingComponent] },
        add: { imports: [MenuFloatingStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('inputs default values', () => {
    it('should have empty items array by default', () => {
      expect(component.items).toEqual([]);
    });
  });

  describe('@Input() title', () => {
    it('should render the title in the h3 element', () => {
      component.title = 'Test Title';
      fixture.detectChanges();
      const h3: HTMLElement = fixture.nativeElement.querySelector('h3');
      expect(h3.textContent?.trim()).toBe('Test Title');
    });

    it('should update the title when input changes', () => {
      component.title = 'First Title';
      fixture.detectChanges();
      component.title = 'Updated Title';
      fixture.detectChanges();
      const h3: HTMLElement = fixture.nativeElement.querySelector('h3');
      expect(h3.textContent?.trim()).toBe('Updated Title');
    });
  });

  describe('@Input() subtitle', () => {
    it('should render the subtitle in the template', () => {
      component.subtitle = 'Test Subtitle';
      fixture.detectChanges();
      const subtitleEl: HTMLElement = fixture.nativeElement.querySelector('div.text-muted-foreground');
      expect(subtitleEl.textContent?.trim()).toBe('Test Subtitle');
    });

    it('should update the subtitle when input changes', () => {
      component.subtitle = 'First Subtitle';
      fixture.detectChanges();
      component.subtitle = 'Updated Subtitle';
      fixture.detectChanges();
      const subtitleEl: HTMLElement = fixture.nativeElement.querySelector('div.text-muted-foreground');
      expect(subtitleEl.textContent?.trim()).toBe('Updated Subtitle');
    });
  });

  describe('@Input() items — menu-floating visibility', () => {
    it('should NOT render app-menu-floating when items is empty', () => {
      component.items = [];
      fixture.detectChanges();
      const menu = fixture.debugElement.query(By.css('app-menu-floating'));
      expect(menu).toBeNull();
    });

    it('should render app-menu-floating when items has at least one element', () => {
      const mockItems: MenuFloatingItem[] = [
        { label: 'Edit', icon: 'edit', action: () => {} },
      ];
      component.items = mockItems;
      fixture.detectChanges();
      const menu = fixture.debugElement.query(By.css('app-menu-floating'));
      expect(menu).not.toBeNull();
    });

    it('should render app-menu-floating with multiple items', () => {
      const mockItems: MenuFloatingItem[] = [
        { label: 'Delete', icon: 'delete', action: () => {} },
        { label: 'Edit', icon: 'edit', action: () => {} },
      ];
      component.items = mockItems;
      fixture.detectChanges();
      const menuEl = fixture.debugElement.query(By.css('app-menu-floating'));
      expect(menuEl).not.toBeNull();
    });

    it('should hide app-menu-floating when items is set back to empty', () => {
      component.items = [{ label: 'Edit', icon: 'edit', action: () => {} }];
      fixture.detectChanges();
      component.items = [];
      fixture.detectChanges();
      const menu = fixture.debugElement.query(By.css('app-menu-floating'));
      expect(menu).toBeNull();
    });
  });

  describe('full render', () => {
    it('should render title, subtitle and menu together', () => {
      component.title = 'My Page';
      component.subtitle = 'Description here';
      component.items = [{ label: 'Action', icon: 'settings', action: () => {} }];
      fixture.detectChanges();

      const h3: HTMLElement = fixture.nativeElement.querySelector('h3');
      const subtitleEl: HTMLElement = fixture.nativeElement.querySelector('div.text-muted-foreground');
      const menu = fixture.debugElement.query(By.css('app-menu-floating'));

      expect(h3.textContent?.trim()).toBe('My Page');
      expect(subtitleEl.textContent?.trim()).toBe('Description here');
      expect(menu).not.toBeNull();
    });
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScorecardComponent } from './scorecard.component';

describe('ScorecardComponent', () => {
  let fixture: ComponentFixture<ScorecardComponent>;

  function createComponent(inputs: Record<string, unknown> = {}) {
    fixture = TestBed.createComponent(ScorecardComponent);
    fixture.componentRef.setInput('title', inputs['title'] ?? 'Total Users');
    for (const [key, value] of Object.entries(inputs)) {
      if (key !== 'title') fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorecardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    createComponent();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('title', () => {
    it('should render the title', () => {
      createComponent({ title: 'Active Sessions' });
      const el = fixture.debugElement.query(By.css('.scorecard-title'));
      expect(el.nativeElement.textContent).toContain('Active Sessions');
    });
  });

  describe('loading state', () => {
    it('should show skeleton when loading is true', () => {
      createComponent({ loading: true });
      const skeleton = fixture.debugElement.query(By.css('ngx-skeleton-loader'));
      expect(skeleton).toBeTruthy();
    });

    it('should show value when loading is false', () => {
      createComponent({ loading: false, value: 42 });
      const valueEl = fixture.debugElement.query(By.css('.scorecard-value'));
      expect(valueEl).toBeTruthy();
      expect(valueEl.nativeElement.textContent).toContain('42');
    });

    it('should hide description while loading', () => {
      createComponent({ loading: true, description: 'Some description' });
      const el = fixture.debugElement.query(By.css('.scorecard-description'));
      expect(el).toBeNull();
    });

    it('should hide subtitle while loading', () => {
      createComponent({ loading: true, subtitle: 'Some subtitle' });
      const el = fixture.debugElement.query(By.css('.scorecard-subtitle'));
      expect(el).toBeNull();
    });
  });

  describe('optional fields', () => {
    it('should show description when not loading', () => {
      createComponent({ loading: false, description: 'Compared to last week' });
      const el = fixture.debugElement.query(By.css('.scorecard-description'));
      expect(el.nativeElement.textContent).toContain('Compared to last week');
    });

    it('should show subtitle when not loading', () => {
      createComponent({ loading: false, subtitle: '+5%' });
      const el = fixture.debugElement.query(By.css('.scorecard-subtitle'));
      expect(el.nativeElement.textContent).toContain('+5%');
    });

    it('should not render icon when icon input is not provided', () => {
      createComponent();
      const iconEl = fixture.debugElement.query(By.css('.scorecard-icon'));
      expect(iconEl).toBeNull();
    });

    it('should render icon when icon input is provided', () => {
      createComponent({ icon: 'users' });
      const iconEl = fixture.debugElement.query(By.css('.scorecard-icon'));
      expect(iconEl).toBeTruthy();
    });
  });

  describe('resolvedColor()', () => {
    it('should return var(--color-primary) when no color is provided', () => {
      createComponent();
      expect(fixture.componentInstance.resolvedColor()).toBe('var(--color-primary)');
    });

    it('should return the provided color', () => {
      createComponent({ color: '#ff0000' });
      expect(fixture.componentInstance.resolvedColor()).toBe('#ff0000');
    });
  });

  describe('resolvedIconColor()', () => {
    it('should fall back to resolvedColor when iconColor is not set', () => {
      createComponent({ color: '#00ff00' });
      expect(fixture.componentInstance.resolvedIconColor()).toBe('#00ff00');
    });

    it('should use iconColor when explicitly set', () => {
      createComponent({ color: '#00ff00', iconColor: '#0000ff' });
      expect(fixture.componentInstance.resolvedIconColor()).toBe('#0000ff');
    });
  });

  describe('getIconPath()', () => {
    it('should return the users path by default', () => {
      createComponent();
      const path = fixture.componentInstance.getIconPath();
      expect(path).toContain('M15 19.128');
    });

    it('should return the correct path for a known icon', () => {
      createComponent({ icon: 'clock' });
      const path = fixture.componentInstance.getIconPath();
      expect(path).toContain('M12 6v6h4.5');
    });

    it('should fall back to users path for unknown icon', () => {
      createComponent({ icon: 'unknown-icon' });
      const path = fixture.componentInstance.getIconPath();
      expect(path).toContain('M15 19.128');
    });

    it('should set the correct svg path attribute when icon is provided', () => {
      createComponent({ icon: 'check-circle' });
      const pathEl = fixture.debugElement.query(By.css('.scorecard-icon svg path'));
      expect(pathEl.nativeElement.getAttribute('d')).toContain('M9 12.75');
    });
  });
});

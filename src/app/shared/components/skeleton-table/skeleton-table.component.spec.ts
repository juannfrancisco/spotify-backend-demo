import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonTableComponent } from './skeleton-table.component';
import { ThemeService } from '@core/services/theme.service';

describe('SkeletonTableComponent', () => {
  let component: SkeletonTableComponent;
  let fixture: ComponentFixture<SkeletonTableComponent>;
  let themeServiceMock: { isDark: boolean };

  beforeEach(async () => {
    themeServiceMock = { isDark: false };

    await TestBed.configureTestingModule({
      imports: [SkeletonTableComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creation ────────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Default input values ─────────────────────────────────────────────────

  it('should have showToolbar input defaulting to true', () => {
    expect(component.showToolbar()).toBe(true);
  });

  it('should have showSearch input defaulting to true', () => {
    expect(component.showSearch()).toBe(true);
  });

  it('should have showAddButton input defaulting to true', () => {
    expect(component.showAddButton()).toBe(true);
  });

  it('should have showPagination input defaulting to true', () => {
    expect(component.showPagination()).toBe(true);
  });

  it('should have rowCount input defaulting to 10', () => {
    expect(component.rowCount()).toBe(10);
  });

  it('should have columnWidths input defaulting to 6 columns', () => {
    expect(component.columnWidths().length).toBe(6);
  });

  it('should have borderRadius input defaulting to "6px"', () => {
    expect(component.borderRadius()).toBe('6px');
  });

  it('should have animationDuration input defaulting to "1.5s"', () => {
    expect(component.animationDuration()).toBe('1.5s');
  });

  // ─── rows signal ──────────────────────────────────────────────────────────

  it('should initialize rows signal with an array matching rowCount', () => {
    expect(component.rows().length).toBe(10);
  });

  it('should initialize pageButtons signal with 6 items', () => {
    expect(component.pageButtons().length).toBe(6);
  });

  // ─── Theme effect — light mode ───────────────────────────────────────────

  it('should apply light-mode colors by default', () => {
    expect(component.backgroundColor()).toBe('#e5e7eb');
    expect(component.border()).toBe('1px solid #d1d5db');
  });

  // ─── Theme effect — dark mode ────────────────────────────────────────────
  // isDark is a plain getter (not a signal), so the effect only reads it once
  // at construction time. We must create a fresh component with the mock
  // already returning true.

  it('should apply dark-mode colors when ThemeService.isDark is true', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SkeletonTableComponent],
      providers: [
        { provide: ThemeService, useValue: { isDark: true } },
      ],
    }).compileComponents();

    const darkFixture = TestBed.createComponent(SkeletonTableComponent);
    const darkComponent = darkFixture.componentInstance;
    darkFixture.detectChanges();

    expect(darkComponent.backgroundColor()).toBe('#374151');
    expect(darkComponent.border()).toBe('1px solid #4b5563');
  });

  // ─── Template — toolbar ──────────────────────────────────────────────────

  it('should render the toolbar section when showToolbar is true', () => {
    const toolbar = fixture.nativeElement.querySelector('.bg-muted\\/20');
    expect(toolbar).toBeTruthy();
  });

  it('should NOT render the toolbar section when showToolbar is false', () => {
    fixture = TestBed.createComponent(SkeletonTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('showToolbar', false);
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('.bg-muted\\/20');
    expect(toolbar).toBeNull();
  });

  // ─── Template — pagination ───────────────────────────────────────────────

  it('should render the pagination section when showPagination is true', () => {
    const pagination = fixture.nativeElement.querySelector('.bg-muted\\/10');
    expect(pagination).toBeTruthy();
  });

  it('should NOT render the pagination section when showPagination is false', () => {
    fixture = TestBed.createComponent(SkeletonTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('showPagination', false);
    fixture.detectChanges();

    const pagination = fixture.nativeElement.querySelector('.bg-muted\\/10');
    expect(pagination).toBeNull();
  });

  // ─── Template — column count ─────────────────────────────────────────────

  it('should render header cells matching the number of columnWidths', () => {
    // Each header row div renders one cell per column
    const headerRow = fixture.nativeElement.querySelector('.bg-muted\\/30');
    const cells = headerRow?.querySelectorAll(':scope > div');
    expect(cells?.length).toBe(component.columnWidths().length);
  });

  it('should respect a custom columnWidths input', () => {
    fixture = TestBed.createComponent(SkeletonTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columnWidths', ['50%', '50%']);
    fixture.detectChanges();

    const headerRow = fixture.nativeElement.querySelector('.bg-muted\\/30');
    const cells = headerRow?.querySelectorAll(':scope > div');
    expect(cells?.length).toBe(2);
  });
});

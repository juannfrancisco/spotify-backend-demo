import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { BreadcrumbComponent, BreadcrumbItem } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  const mockItems: BreadcrumbItem[] = [
    { label: 'Inicio', path: '/home', icon: 'icons/home.svg' },
    { label: 'Genérico', path: '/generic/history' },
    { label: 'Detalle' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BreadcrumbComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        AngularSvgIconModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default inputs', () => {
    expect(component.items).toEqual([]);
    expect(component.separator).toBe('chevron');
  });

  it('should render all breadcrumb items as <li> elements', () => {
    component.items = mockItems;
    fixture.detectChanges();
    const listItems = fixture.nativeElement.querySelectorAll('li');
    expect(listItems.length).toBe(mockItems.length);
  });

  it('should mark last item with aria-current="page"', () => {
    component.items = mockItems;
    fixture.detectChanges();
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(current).toBeTruthy();
    expect(current.textContent.trim()).toContain('Detalle');
  });

  it('should render links only for non-last items', () => {
    component.items = mockItems;
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links.length).toBe(mockItems.length - 1);
  });

  it('should render separators between items', () => {
    component.items = mockItems;
    fixture.detectChanges();
    const separators = fixture.nativeElement.querySelectorAll('span[aria-hidden="true"]');
    expect(separators.length).toBe(mockItems.length - 1);
  });

  it('should render slash separator when separator is "slash"', () => {
    component.items = mockItems;
    component.separator = 'slash';
    fixture.detectChanges();
    const separatorSpans = fixture.nativeElement.querySelectorAll('span[aria-hidden="true"]');
    separatorSpans.forEach((span: HTMLElement) => {
      expect(span.textContent).toContain('/');
    });
  });

  it('should render dot separator when separator is "dot"', () => {
    component.items = mockItems;
    component.separator = 'dot';
    fixture.detectChanges();
    const separatorSpans = fixture.nativeElement.querySelectorAll('span[aria-hidden="true"]');
    separatorSpans.forEach((span: HTMLElement) => {
      expect(span.textContent).toContain('·');
    });
  });

  it('should render nav with aria-label="breadcrumb"', () => {
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('nav[aria-label="breadcrumb"]');
    expect(nav).toBeTruthy();
  });

  it('should render nothing when items is empty', () => {
    component.items = [];
    fixture.detectChanges();
    const listItems = fixture.nativeElement.querySelectorAll('li');
    expect(listItems.length).toBe(0);
  });

  it('should render single item without links or separators', () => {
    component.items = [{ label: 'Único' }];
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a');
    const separators = fixture.nativeElement.querySelectorAll('span[aria-hidden="true"]');
    expect(links.length).toBe(0);
    expect(separators.length).toBe(0);
  });

  it('should render svg-icon inside link when non-last item has icon', () => {
    component.items = [
      { label: 'Inicio', path: '/home', icon: 'icons/home.svg' },
      { label: 'Detalle' },
    ];
    fixture.detectChanges();
    const iconDebug = fixture.debugElement.query(By.css('a svg-icon'));
    expect(iconDebug).toBeTruthy();
    expect(iconDebug.componentInstance.src).toBe('icons/home.svg');
  });

  it('should not render svg-icon inside link when non-last item has no icon', () => {
    component.items = [
      { label: 'Inicio', path: '/home' },
      { label: 'Detalle' },
    ];
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a');
    const icon = link.querySelector('svg-icon');
    expect(icon).toBeNull();
  });

  it('should render svg-icon inside last item span when last item has icon', () => {
    component.items = [
      { label: 'Inicio', path: '/home' },
      { label: 'Detalle', icon: 'icons/detail.svg' },
    ];
    fixture.detectChanges();
    const iconDebug = fixture.debugElement.query(By.css('[aria-current="page"] svg-icon'));
    expect(iconDebug).toBeTruthy();
    expect(iconDebug.componentInstance.src).toBe('icons/detail.svg');
  });

  it('should not render svg-icon inside last item span when last item has no icon', () => {
    component.items = [{ label: 'Detalle' }];
    fixture.detectChanges();
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');
    const icon = current.querySelector('svg-icon');
    expect(icon).toBeNull();
  });

  it('should set correct routerLink on non-last item links', () => {
    component.items = [
      { label: 'Inicio', path: '/home' },
      { label: 'Genérico', path: '/generic' },
      { label: 'Detalle' },
    ];
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links[0].getAttribute('href')).toBe('/home');
    expect(links[1].getAttribute('href')).toBe('/generic');
  });

  it('should render chevron svg-icon separator by default', () => {
    component.items = mockItems;
    fixture.detectChanges();
    const iconDebugs = fixture.debugElement.queryAll(By.css('span[aria-hidden="true"] svg-icon'));
    expect(iconDebugs.length).toBe(mockItems.length - 1);
    iconDebugs.forEach((iconDebug) => {
      expect(iconDebug.componentInstance.src).toBe('icons/heroicons/solid/chevron-right.svg');
    });
  });

  it('should render two items correctly with one link and one separator', () => {
    component.items = [
      { label: 'Inicio', path: '/home' },
      { label: 'Detalle' },
    ];
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a');
    const separators = fixture.nativeElement.querySelectorAll('span[aria-hidden="true"]');
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(links.length).toBe(1);
    expect(separators.length).toBe(1);
    expect(current.textContent.trim()).toContain('Detalle');
  });
});

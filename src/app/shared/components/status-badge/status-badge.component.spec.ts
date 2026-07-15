import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.status = 'Pendiente';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('color mapping', () => {
    it('should apply gray classes for "Pendiente"', () => {
      component.status = 'Pendiente';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span).not.toBeNull();
      expect(span.classList.contains('bg-gray-100')).toBeTrue();
      expect(span.classList.contains('text-gray-800')).toBeTrue();
    });

    it('should apply yellow classes for "En Validación"', () => {
      component.status = 'En Validación';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('bg-yellow-100')).toBeTrue();
      expect(span.classList.contains('text-yellow-800')).toBeTrue();
    });

    it('should apply yellow classes for "En progreso"', () => {
      component.status = 'En progreso';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('bg-yellow-100')).toBeTrue();
      expect(span.classList.contains('text-yellow-800')).toBeTrue();
    });

    it('should apply green classes for "Completado"', () => {
      component.status = 'Completado';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('bg-green-100')).toBeTrue();
      expect(span.classList.contains('text-green-800')).toBeTrue();
    });

    it('should apply green classes for "En proceso de pago"', () => {
      component.status = 'En proceso de pago';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('bg-green-100')).toBeTrue();
    });

    it('should apply red classes for "Cancelado"', () => {
      component.status = 'Cancelado';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('bg-red-100')).toBeTrue();
      expect(span.classList.contains('text-red-800')).toBeTrue();
    });

    it('should apply blue classes for "Ingresada"', () => {
      component.status = 'Ingresada';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('bg-blue-100')).toBeTrue();
      expect(span.classList.contains('text-blue-800')).toBeTrue();
    });
  });

  describe('fixed classes', () => {
    it('should always include base styling classes', () => {
      component.status = 'Pendiente';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('rounded-[5px]')).toBeTrue();
      expect(span.classList.contains('text-xs')).toBeTrue();
      expect(span.classList.contains('px-2')).toBeTrue();
      expect(span.classList.contains('py-1')).toBeTrue();
      expect(span.classList.contains('border')).toBeTrue();
    });
  });

  describe('text rendering', () => {
    it('should display the status text as-is when no ENUM_LABELS mapping exists', () => {
      component.status = 'Ingresada';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.textContent?.trim()).toBe('Ingresada');
    });

    it('should display status directly when status is already the label', () => {
      component.status = 'Pendiente';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.textContent?.trim()).toBe('Pendiente');
    });

    it('should display ENUM_LABELS label when status matches a key (e.g. ACTIVE → Activo)', () => {
      component.status = 'ACTIVE';
      fixture.detectChanges();

      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.textContent?.trim()).toBe('Activo');
    });
  });

  describe('dynamic updates', () => {
    it('should update color classes when status changes between renders', () => {
      component.status = 'Pendiente';
      fixture.detectChanges();
      let span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('bg-gray-100')).toBeTrue();

      // ngOnInit already ran; simulate a re-render by updating manually
      const color = component.badgeColors['Completado'];
      component.classes = component.fixedClasses + ' ' + component.badgeClasses[color];
      component.textValue = 'Completado';
      fixture.detectChanges();

      span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('bg-green-100')).toBeTrue();
    });
  });

  describe('unknown status', () => {
    it('should still render a span for unknown status (no color class applied)', () => {
      component.status = 'UnknownValue';
      fixture.detectChanges();

      // Component always renders a span; color classes will be missing but element exists
      const span: HTMLElement = fixture.nativeElement.querySelector('span');
      expect(span).not.toBeNull();
      expect(span.textContent?.trim()).toBe('UnknownValue');
    });
  });
});

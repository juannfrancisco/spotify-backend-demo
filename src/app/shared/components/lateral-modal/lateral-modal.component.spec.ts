import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LateralModalComponent } from './lateral-modal.component';

describe('LateralModalComponent', () => {
  let component: LateralModalComponent;
  let fixture: ComponentFixture<LateralModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LateralModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LateralModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default input values', () => {
    it('should have isOpen as false', () => {
      expect(component.isOpen).toBe(false);
    });

    it('should have empty title', () => {
      expect(component.title).toBe('');
    });

    it('should have default width as md', () => {
      expect(component.width).toBe('md');
    });

    it('should close on backdrop click by default', () => {
      expect(component.closeOnBackdropClick).toBe(true);
    });
  });

  describe('panelWidthClass', () => {
    it('should return sm class', () => {
      component.width = 'sm';
      expect(component.panelWidthClass).toBe('w-full max-w-sm');
    });

    it('should return md class', () => {
      component.width = 'md';
      expect(component.panelWidthClass).toBe('w-full max-w-md');
    });

    it('should return lg class', () => {
      component.width = 'lg';
      expect(component.panelWidthClass).toBe('w-full max-w-lg');
    });

    it('should return xl class', () => {
      component.width = 'xl';
      expect(component.panelWidthClass).toBe('w-full max-w-xl');
    });
  });

  describe('onBackdropClick()', () => {
    it('should emit close when closeOnBackdropClick is true', () => {
      component.closeOnBackdropClick = true;
      spyOn(component.close, 'emit');

      component.onBackdropClick();

      expect(component.close.emit).toHaveBeenCalledTimes(1);
    });

    it('should not emit close when closeOnBackdropClick is false', () => {
      component.closeOnBackdropClick = false;
      spyOn(component.close, 'emit');

      component.onBackdropClick();

      expect(component.close.emit).not.toHaveBeenCalled();
    });
  });

  describe('Escape key (HostListener)', () => {
    it('should emit close when Escape is pressed and isOpen is true', () => {
      component.isOpen = true;
      spyOn(component.close, 'emit');

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(component.close.emit).toHaveBeenCalledTimes(1);
    });

    it('should not emit close when Escape is pressed and isOpen is false', () => {
      component.isOpen = false;
      spyOn(component.close, 'emit');

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(component.close.emit).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    it('should not render panel when isOpen is false', () => {
      component.isOpen = false;
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector('[role="dialog"]');
      expect(panel).toBeNull();
    });

    it('should render panel when isOpen is true', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector('[role="dialog"]');
      expect(panel).not.toBeNull();
    });

    it('should display title in header', () => {
      component.isOpen = true;
      component.title = 'Ficha de candidato';
      fixture.detectChanges();

      const heading = fixture.nativeElement.querySelector('h2');
      expect(heading.textContent.trim()).toBe('Ficha de candidato');
    });

    it('should set aria-label from title input', () => {
      component.isOpen = true;
      component.title = 'Panel lateral';
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector('[role="dialog"]');
      expect(panel.getAttribute('aria-label')).toBe('Panel lateral');
    });

    it('should render backdrop when isOpen is true', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const backdrop = fixture.nativeElement.querySelector('[role="presentation"]');
      expect(backdrop).not.toBeNull();
    });
  });

  describe('close button in header', () => {
    it('should emit close when header close button is clicked', () => {
      component.isOpen = true;
      fixture.detectChanges();
      spyOn(component.close, 'emit');

      const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector(
        'button[aria-label="Cerrar panel"]'
      );
      closeButton.click();

      expect(component.close.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('backdrop click', () => {
    it('should emit close when backdrop is clicked and closeOnBackdropClick is true', () => {
      component.isOpen = true;
      component.closeOnBackdropClick = true;
      fixture.detectChanges();
      spyOn(component.close, 'emit');

      const backdrop: HTMLElement = fixture.nativeElement.querySelector('[role="presentation"]');
      backdrop.click();

      expect(component.close.emit).toHaveBeenCalledTimes(1);
    });

    it('should not emit close when backdrop is clicked and closeOnBackdropClick is false', () => {
      component.isOpen = true;
      component.closeOnBackdropClick = false;
      fixture.detectChanges();
      spyOn(component.close, 'emit');

      component.onBackdropClick();

      expect(component.close.emit).not.toHaveBeenCalled();
    });
  });
});

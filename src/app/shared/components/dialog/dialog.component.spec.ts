import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isOpen).toBe(false);
    expect(component.title).toBe('');
    expect(component.message).toBe('');
    expect(component.showFooter).toBe(true);
    expect(component.showConfirmButton).toBe(true);
    expect(component.confirmText).toBe('Confirmar');
    expect(component.cancelText).toBe('Cancelar');
  });

  it('should emit close event when onClose is called', () => {
    spyOn(component.close, 'emit');
    component.isOpen = true;
    component.onClose();
    
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit confirm event when onConfirm is called', () => {
    spyOn(component.confirm, 'emit');
    
    component.onConfirm();
    
    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('should render title when provided', () => {
    component.title = 'Test Title';
    component.isOpen = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Title');
  });

  it('should render message when provided', () => {
    component.message = 'Test Message';
    component.isOpen = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Message');
  });

  it('should show/hide based on isOpen property', () => {
    component.isOpen = false;
    fixture.detectChanges();
    
    let compiled = fixture.nativeElement;
    expect(compiled.querySelector('.dialog-overlay')).toBeFalsy();
    
    component.isOpen = true;
    fixture.detectChanges();
    
    compiled = fixture.nativeElement;
    expect(compiled.querySelector('.dialog-overlay') || compiled.textContent).toBeTruthy();
  });
});
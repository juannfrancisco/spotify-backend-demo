import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.impact()).toBe('none');
    expect(component.size()).toBe('medium');
    expect(component.shape()).toBe('rounded');
    expect(component.tone()).toBe('primary');
    expect(component.shadow()).toBe('none');
    expect(component.full()).toBe(false);
  });

  it('should generate correct classes for default configuration', () => {
    component.ngOnInit();
    expect(component.classes).toContain('bg-transparent');
    expect(component.classes).toContain('text-primary');
    expect(component.classes).toContain('px-5 py-2 text-sm');
    expect(component.classes).toContain('rounded-lg');
  });

  it('should generate correct classes for bold primary button', () => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('impact', 'bold');
    fixture.componentRef.setInput('tone', 'primary');
    fixture.detectChanges();
    
    component.ngOnInit();
    expect(component.classes).toContain('bg-primary');
    expect(component.classes).toContain('text-primary-foreground');
  });

  it('should generate correct classes for danger button', () => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tone', 'danger');
    fixture.componentRef.setInput('impact', 'bold');
    fixture.detectChanges();
    
    component.ngOnInit();
    expect(component.classes).toContain('bg-destructive');
    expect(component.classes).toContain('text-white');
  });

  it('should generate correct classes for small size', () => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();
    
    component.ngOnInit();
    expect(component.classes).toContain('px-3 py-1 text-xs');
  });

  it('should generate correct classes for large size', () => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();
    
    component.ngOnInit();
    expect(component.classes).toContain('px-7 py-2.5 text-lg');
  });

  it('should generate correct classes for pill shape', () => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('shape', 'pill');
    fixture.detectChanges();
    
    component.ngOnInit();
    expect(component.classes).toContain('rounded-full');
  });

  it('should generate correct classes for square shape', () => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('shape', 'square');
    fixture.detectChanges();
    
    component.ngOnInit();
    expect(component.classes).toContain('rounded-none');
  });

  it('should add full width class when full is true', () => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('full', true);
    fixture.detectChanges();
    
    component.ngOnInit();
    expect(component.classes).toContain('w-full');
  });

  it('should add shadow classes', () => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('shadow', 'large');
    fixture.detectChanges();
    
    component.ngOnInit();
    expect(component.classes).toContain('shadow-lg');
  });

  it('should emit buttonClick event when clicked', () => {
    spyOn(component.buttonClick, 'emit');
    
    component.onButtonClick();
    
    expect(component.buttonClick.emit).toHaveBeenCalled();
  });

  it('should handle string transform for full property', () => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('full', '');
    fixture.detectChanges();
    
    expect(component.full()).toBe(true);
  });

  it('should test all tone and impact combinations', () => {
    const tones: Array<'primary' | 'danger' | 'success' | 'warning' | 'info' | 'light'> = 
      ['primary', 'danger', 'success', 'warning', 'info', 'light'];
    const impacts: Array<'bold' | 'light' | 'none'> = ['bold', 'light', 'none'];

    tones.forEach(tone => {
      impacts.forEach(impact => {
        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('tone', tone);
        fixture.componentRef.setInput('impact', impact);
        fixture.detectChanges();
        
        component.ngOnInit();
        expect(component.classes).toBeTruthy();
        expect(component.classes.length).toBeGreaterThan(0);
      });
    });
  });
});

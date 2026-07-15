import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { LoadingBarComponent } from './loading-bar.component';

describe('LoadingBarComponent', () => {
  let component: LoadingBarComponent;
  let fixture: ComponentFixture<LoadingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default inputs', () => {
    it('should have default color as primary', () => {
      expect(component.color()).toBe('primary');
    });

    it('should have default height as 4', () => {
      expect(component.height()).toBe(4);
    });

    it('should have default position as top', () => {
      expect(component.position()).toBe('top');
    });
  });

  describe('container element', () => {
    it('should apply height style from input', () => {
      fixture.componentRef.setInput('height', 6);
      fixture.detectChanges();
      const container: HTMLElement = fixture.nativeElement.querySelector('.loading-bar-container');
      expect(container.style.height).toBe('6px');
    });

    it('should not apply loading-bar-bottom class when position is top', () => {
      fixture.componentRef.setInput('position', 'top');
      fixture.detectChanges();
      const container: HTMLElement = fixture.nativeElement.querySelector('.loading-bar-container');
      expect(container.classList).not.toContain('loading-bar-bottom');
    });

    it('should apply loading-bar-bottom class when position is bottom', () => {
      fixture.componentRef.setInput('position', 'bottom');
      fixture.detectChanges();
      const container: HTMLElement = fixture.nativeElement.querySelector('.loading-bar-container');
      expect(container.classList).toContain('loading-bar-bottom');
    });
  });

  describe('color classes', () => {
    const colors: Array<'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = [
      'primary', 'secondary', 'success', 'warning', 'danger'
    ];

    colors.forEach(color => {
      it(`should apply loading-bar-${color} class when color is ${color}`, () => {
        fixture.componentRef.setInput('color', color);
        fixture.detectChanges();
        const progress: HTMLElement = fixture.nativeElement.querySelector('.loading-bar-progress');
        expect(progress.classList).toContain(`loading-bar-${color}`);
      });

      it(`should not apply other color classes when color is ${color}`, () => {
        fixture.componentRef.setInput('color', color);
        fixture.detectChanges();
        const progress: HTMLElement = fixture.nativeElement.querySelector('.loading-bar-progress');
        colors
          .filter(c => c !== color)
          .forEach(otherColor => {
            expect(progress.classList).not.toContain(`loading-bar-${otherColor}`);
          });
      });
    });
  });

  describe('DOM structure', () => {
    it('should render a container with a progress child', () => {
      const container: HTMLElement = fixture.nativeElement.querySelector('.loading-bar-container');
      const progress: HTMLElement = fixture.nativeElement.querySelector('.loading-bar-progress');
      expect(container).toBeTruthy();
      expect(progress).toBeTruthy();
      expect(container.contains(progress)).toBeTrue();
    });
  });
});

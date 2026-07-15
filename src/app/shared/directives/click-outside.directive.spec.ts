import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  template: `
    <div id="container" (clickOutside)="onClickOutside()">
      <div id="inside-element">Inside content</div>
    </div>
    <div id="outside-element">Outside content</div>
  `,
  standalone: true,
  imports: [ClickOutsideDirective]
})
class TestComponent {
  clickOutsideTriggered = false;

  onClickOutside() {
    this.clickOutsideTriggered = true;
  }
}

describe('ClickOutsideDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let containerElement: DebugElement;
  let insideElement: DebugElement;
  let outsideElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    containerElement = fixture.debugElement.query(By.css('#container'));
    insideElement = fixture.debugElement.query(By.css('#inside-element'));
    outsideElement = fixture.debugElement.query(By.css('#outside-element'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clickOutside when clicking outside the element', async () => {
    // Wait for the directive to set up the event listener
    await fixture.whenStable();

    outsideElement.nativeElement.click();
    fixture.detectChanges();

    expect(component.clickOutsideTriggered).toBe(true);
  });

  it('should not emit clickOutside when clicking inside the element', async () => {
    // Wait for the directive to set up the event listener
    await fixture.whenStable();

    insideElement.nativeElement.click();
    fixture.detectChanges();

    expect(component.clickOutsideTriggered).toBe(false);
  });

  it('should not emit clickOutside when clicking on the container element itself', async () => {
    // Wait for the directive to set up the event listener
    await fixture.whenStable();

    containerElement.nativeElement.click();
    fixture.detectChanges();

    expect(component.clickOutsideTriggered).toBe(false);
  });

  it('should check if element is inside correctly', () => {
    const directive = new ClickOutsideDirective(
      { nativeElement: containerElement.nativeElement },
      document
    );

    expect(directive.isInside(containerElement.nativeElement)).toBe(true);
    expect(directive.isInside(insideElement.nativeElement)).toBe(true);
    expect(directive.isInside(outsideElement.nativeElement)).toBe(false);
  });

  it('should unsubscribe on destroy', () => {
    const directive = new ClickOutsideDirective(
      { nativeElement: containerElement.nativeElement },
      document
    );

    directive.ngAfterViewInit();
    const subscription = directive.documentClickSubscription;
    
    expect(subscription).toBeDefined();
    spyOn(subscription!, 'unsubscribe');

    directive.ngOnDestroy();

    expect(subscription!.unsubscribe).toHaveBeenCalled();
  });
});

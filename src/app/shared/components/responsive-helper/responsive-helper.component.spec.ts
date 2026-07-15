import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsiveHelperComponent } from './responsive-helper.component';

describe('ResponsiveHelperComponent', () => {
  let component: ResponsiveHelperComponent;
  let fixture: ComponentFixture<ResponsiveHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsiveHelperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsiveHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properly', () => {
    expect(component).toBeDefined();
  });

  it('should render without errors', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
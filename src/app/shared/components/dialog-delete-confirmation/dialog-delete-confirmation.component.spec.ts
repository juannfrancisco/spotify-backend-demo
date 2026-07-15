import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogDeleteConfirmationComponent } from './dialog-delete-confirmation.component';

describe('DialogDeleteConfirmationComponent', () => {
  let component: DialogDeleteConfirmationComponent;
  let fixture: ComponentFixture<DialogDeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteConfirmationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogDeleteConfirmationComponent);
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
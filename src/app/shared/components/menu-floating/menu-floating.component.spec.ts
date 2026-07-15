import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuFloatingComponent } from './menu-floating.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MenuFloatingItem } from './model/menu-floating-item.model';
import { By } from '@angular/platform-browser';

describe('MenuFloatingComponent', () => {
    let component: MenuFloatingComponent;
    let fixture: ComponentFixture<MenuFloatingComponent>;

    const mockItems: MenuFloatingItem[] = [
        { label: 'Editar', icon: 'icons/edit.svg', action: jasmine.createSpy('action1') },
        { label: 'Eliminar', icon: 'icons/delete.svg', action: jasmine.createSpy('action2') },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MenuFloatingComponent, AngularSvgIconModule.forRoot(), HttpClientTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MenuFloatingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should start with menu closed', () => {
        expect(component.isMenuOpen()).toBeFalse();
    });

    it('should toggle menu open on toggleMenu()', () => {
        component.toggleMenu();
        expect(component.isMenuOpen()).toBeTrue();
    });

    it('should toggle menu closed on second toggleMenu()', () => {
        component.toggleMenu();
        component.toggleMenu();
        expect(component.isMenuOpen()).toBeFalse();
    });

    it('should open menu when the trigger button is clicked', () => {
        const button = fixture.debugElement.query(By.css('button[aria-label="Menú de opciones"]'));
        button.nativeElement.click();
        fixture.detectChanges();
        expect(component.isMenuOpen()).toBeTrue();
    });

    it('should not render menu items when menu is closed', () => {
        component.items = mockItems;
        fixture.detectChanges();
        const itemButtons = fixture.debugElement.queryAll(By.css('.py-1 button'));
        expect(itemButtons.length).toBe(0);
    });

    it('should render menu items when menu is open', () => {
        component.items = mockItems;
        component.toggleMenu();
        fixture.detectChanges();
        const itemButtons = fixture.debugElement.queryAll(By.css('.py-1 button'));
        expect(itemButtons.length).toBe(mockItems.length);
    });

    it('should display correct labels for each item', () => {
        component.items = mockItems;
        component.toggleMenu();
        fixture.detectChanges();
        const itemButtons = fixture.debugElement.queryAll(By.css('.py-1 button'));
        mockItems.forEach((item, i) => {
            expect(itemButtons[i].nativeElement.textContent).toContain(item.label);
        });
    });

    it('should call item action when item button is clicked', () => {
        component.items = mockItems;
        component.toggleMenu();
        fixture.detectChanges();
        const firstItem = fixture.debugElement.query(By.css('.py-1 button'));
        firstItem.nativeElement.click();
        expect(mockItems[0].action).toHaveBeenCalled();
    });

    it('should render no items when items input is empty', () => {
        component.items = [];
        component.toggleMenu();
        fixture.detectChanges();
        const itemButtons = fixture.debugElement.queryAll(By.css('.py-1 button'));
        expect(itemButtons.length).toBe(0);
    });
});

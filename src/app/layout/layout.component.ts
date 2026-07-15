import { Component, inject } from '@angular/core';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { LoadingBarComponent } from '@shared/components/loading-bar/loading-bar.component';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, FooterComponent, RouterOutlet, LoadingBarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  private loadingService: LoadingService = inject(LoadingService);
  public isLoading = this.loadingService.isLoadingFlag;

}

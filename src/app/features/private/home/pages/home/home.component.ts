import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES_PATH, APP_ROUTES_PATH_MENU } from '@shared/constants/app-routes.constants';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '@core/services/theme.service';
import { HeaderContainerComponent } from "@shared/components/header-container/header-container.component";
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ScorecardComponent } from '@shared/components/scorecard/scorecard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgStyle, 
    NgApexchartsModule, 
    AngularSvgIconModule, 
    HeaderContainerComponent, 
    BreadcrumbComponent,
    ScorecardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  chartOptions: any;
  private readonly _router: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);
  readonly scorecards = [
    { value: 10, status: "ACTIVE", label: 'Activos', icon: 'arrow-right-circle', color: '#22c55e' },
    { value: 10, status: "PLANNED", label: 'Planificados', icon: 'calendar', color: '#eab308' },
    { value: 10, status: "WARRANTY", label: 'En Garantía', icon: 'umbrella', color: '#3b82f6' },
    { value: 10, status: "COMPLETED", label: 'Completados', icon: 'check-circle', color: '#8b5cf6' },
    { value: 10, status: "FROZEN", label: 'Congelados', icon: 'pause-circle', color: '#06b6d4' },
    { value: 10, status: "CANCELLED", label: 'Cancelados', icon: 'x-circle', color: '#ef4444' },
  ];


  constructor() {
    let baseColor = '#FFFFFF';
    const data = [2100, 3200, 3200, 2400, 2400, 1800, 1800, 2400, 2400, 3200, 3200, 3000, 3000, 3250, 3250];
    const categories = [
      '10AM',
      '10.30AM',
      '11AM',
      '11.15AM',
      '11.30AM',
      '12PM',
      '1PM',
      '2PM',
      '3PM',
      '4PM',
      '5PM',
      '6PM',
      '7PM',
      '8PM',
      '9PM',
    ];

    this.chartOptions = {
      series: [
        {
          name: 'Etherium',
          data: data,
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: 150,
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.2,
          stops: [15, 120, 100],
        },
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [baseColor], // line color
      },
      xaxis: {
        categories: categories,
        labels: {
          show: false,
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 4,
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: string) {
            return val + '$';
          },
        },
      },
      colors: [baseColor], //line colors
    };

    effect(() => {
      /** change chart theme */
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      this.chartOptions.tooltip = {
        theme: this.themeService.theme().mode,
      };
      this.chartOptions.colors = [primaryColor];
      this.chartOptions.stroke!.colors = [primaryColor];
      this.chartOptions.xaxis!.crosshairs!.stroke!.color = primaryColor;
    });
  }

  goToGeneric() {
    this._router.navigate([`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH_MENU.genericForm}`]);
  }


}

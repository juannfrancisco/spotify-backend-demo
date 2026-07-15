import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxSkeletonLoaderModule],
})
export class ScorecardComponent {
  title = input.required<string>();
  subtitle = input<string>();
  description = input<string>();
  value = input<number | string>();
  loading = input<boolean>(true);
  /** CSS color value used for accent bar, glow, icon bg, and value gradient. Defaults to --color-primary. */
  color = input<string>();
  icon = input<string>(); // 'users' | 'user-check' | 'clock' | 'user' | 'umbrella' | 'calendar' | 'check-circle' | 'pause-circle' | 'x-circle' | 'arrow-right-circle' | 'bell-alert'
  /** Overrides `color` for the icon specifically. Falls back to `color`. */
  iconColor = input<string>();

  resolvedColor(): string {
    return this.color() ?? 'var(--color-primary)';
  }

  resolvedIconColor(): string {
    return this.iconColor() ?? this.resolvedColor();
  }

  getIconPath(): string {
    const iconPaths: Record<string, string> = {
      'users':
        'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
      'user-check':
        'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z M15.75 12.75 18 15m0 0 4.5-4.5M18 15l-4.5-4.5',
      'clock': 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      'user': 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z',
      'umbrella':
        'M12 3.75a.75.75 0 0 1 .75.75v13.5a3 3 0 0 1-6 0 .75.75 0 0 1 1.5 0 1.5 1.5 0 0 0 3 0V4.5a.75.75 0 0 1 .75-.75ZM3 12.75C3 7.365 7.365 3 12.75 3s9.75 4.365 9.75 9.75a.75.75 0 0 1-1.5 0C21 8.194 17.556 4.5 12.75 4.5S4.5 8.194 4.5 12.75a.75.75 0 0 1-1.5 0Z',
      'question':
        'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z',
      'calendar':
        'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
      'check-circle': 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      'pause-circle': 'M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      'x-circle': 'm9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      'arrow-right-circle': 'm12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      'bell-alert':
        'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5',
    };

    return iconPaths[this.icon() ?? 'users'] ?? iconPaths['users'];
  }
}

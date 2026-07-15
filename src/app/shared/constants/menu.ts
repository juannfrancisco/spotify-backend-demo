import { MenuItem } from '../../core/models/menu.model';
import { APP_ROUTES_PATH_MENU } from './app-routes.constants';

export class Menu {
  public static readonly pages: MenuItem[] = [
    {
      group: '',
      separator: true,
      items: [
        {
          icon: 'icons/heroicons/outline/home.svg',
          label: 'Home',
          route: APP_ROUTES_PATH_MENU.home,
        }
      ],
    },
    {
      group: 'Generico',
      icon: 'icons/heroicons/outline/building-office.svg',
      separator: true,
      items: [
        {
          icon: 'icons/heroicons/outline/plus-circle.svg',
          label: 'Ingresar registro',
          route: APP_ROUTES_PATH_MENU.genericForm,
        },
        {
          icon: 'icons/heroicons/outline/list-bullet.svg',
          label: 'Ver historial',
          route: APP_ROUTES_PATH_MENU.genericList,
        },
      ],
    },
  ];
}

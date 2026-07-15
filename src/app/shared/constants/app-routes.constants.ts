export const APP_ROUTES_NAME = {
    public: 'public',
    login: 'login',
    private: 'private',
    home: 'home',
    generic: 'generic',
    form: 'create',
    list: 'history',
    details: 'details',
    edit: 'edit',
  };
  
export const APP_ROUTES_PATH = {
    public: `${APP_ROUTES_NAME.public}`,
    login: `${APP_ROUTES_NAME.login}`,
    private: `${APP_ROUTES_NAME.private}`,
    home: `${APP_ROUTES_NAME.home}`,
    generic: `${APP_ROUTES_NAME.generic}`,
    genericForm: `${APP_ROUTES_NAME.form}`,
    genericList: `${APP_ROUTES_NAME.list}`,
    genericDetail: `${APP_ROUTES_NAME.details}`,
    genericEdit: `${APP_ROUTES_NAME.edit}`,
};

export const APP_ROUTES_PATH_MENU = {
    login: `${APP_ROUTES_NAME.public}/${APP_ROUTES_NAME.login}`,
    home: `${APP_ROUTES_NAME.home}`,
    genericForm: `${APP_ROUTES_NAME.generic}/${APP_ROUTES_NAME.form}`,
    genericList: `${APP_ROUTES_NAME.generic}/${APP_ROUTES_NAME.list}`,
};
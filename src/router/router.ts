import { App } from '../main';
import { PATH } from './path';

export type IRoutes = {
  path: string;
  page: () => void;
};

export class Router {
  private _routes: IRoutes[];
  private _app: App;

  constructor(app: App) {
    this._routes = this.createRoutes();
    this._app = app;
    window.addEventListener('hashchange', () => this.handlePathChange());
    this.handlePathChange();
  }
  public navigate(url: string): void {
    window.location.hash = url;
    this.handlePathChange();
  }

  private createRoutes(): IRoutes[] {
    return [
      { path: PATH.HOME, page: () => this._app._homePage.view() },
      { path: PATH.GARAGE, page: () => this._app._garagePage.view() },
      { path: PATH.WINNERS, page: () => this._app._winnersPage.view() },
      { path: PATH.NOTFOUND, page: () => this._app._notFoundPage.view() },
    ];
  }

  private handlePathChange(): void {
    const request = window.location.hash || '#/';

    const route = this._routes.find((r) => r.path === request);
    if (!route) {
      this.navigate(PATH.NOTFOUND);
      return;
    }

    route.page();
  }
}

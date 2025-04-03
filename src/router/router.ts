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
    this.handlePathChange();
  }
  public navigate(url: string): void {
    history.pushState({}, '', url);
    this.handlePathChange();
  }

  private createRoutes(): IRoutes[] {
    return [
      { path: '', page: () => this._app._homePage.view() },
      { path: PATH.HOME, page: () => this._app._homePage.view() },
      { path: PATH.GARAGE, page: () => this._app._garagePage.view() },
      { path: PATH.WINNERS, page: () => this._app._winnersPage.view() },
      { path: PATH.NOTFOUND, page: () => this._app._notFoundPage.view() },
    ];
  }

  private handlePathChange(): void {
    const request = globalThis.location.pathname;
    console.log(globalThis.location);
    const route = this._routes.find((r) => r.path === request);
    if (!route) {
      this.navigate(PATH.NOTFOUND);
      return;
    }

    route.page();
  }
}

import { IRoutes } from '../main';
import { PATH } from './path';

const data = {
  hashAndSlash: 1,
};

export class Router {
  private _routes: IRoutes[];
  private _currentPath: string;

  constructor(routes: IRoutes[]) {
    this._routes = routes;
    this._currentPath = '#/';
    window.addEventListener('hashchange', () => this.handlePathChange());
    this.handlePathChange();
  }
  public navigate(url: string): void {
    window.location.hash = url;
    this.handlePathChange();
  }

  private handlePathChange(): void {
    const hash = window.location.hash.slice(data.hashAndSlash);
    const url = new URL(hash, window.location.origin);
    const pathname = url.pathname;

    if (pathname !== this._currentPath) {
      this._currentPath = pathname;
      const route = this._routes.find((r) => r.path === pathname);
      if (!route) {
        this.navigate(PATH.NOTFOUND);
        return;
      }

      route.page();
    }
  }
}

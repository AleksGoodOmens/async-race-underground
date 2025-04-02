import { PATH } from '../../router/path';

const data = {
  logo: 'Async-Race Underground',
};

export class Header {
  private _container: HTMLHeadElement;
  constructor() {
    this._container = document.createElement('header');
    this.view();
  }

  private view() {
    const logo = document.createElement('a');
    logo.textContent = data.logo;
    logo.href = PATH.HOME;

    this.container.append(logo);
  }

  get container() {
    return this._container;
  }
}

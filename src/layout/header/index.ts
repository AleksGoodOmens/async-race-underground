import { BaseElement } from '../../base/base-element';
import { PATH } from '../../router/path';
import styles from './header.module.css';

const data = {
  logo: 'Async-Race Underground',
};

const classes = {
  header: styles['container'],
};

export class Header {
  private _container: BaseElement<HTMLHeadElement>;
  constructor() {
    this._container = new BaseElement({
      tag: 'header',
      className: classes.header,
    });
    this.view();
  }

  private view() {
    const logo = document.createElement('a');
    logo.textContent = data.logo;
    logo.href = PATH.HOME;

    this.container.append(logo);
  }

  get container() {
    return this._container.element;
  }
}

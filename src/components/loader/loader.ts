import styles from './loader.module.css';

const classes = {
  loader: styles['loader'],
};

export class Loader {
  private _loader: HTMLDivElement;
  constructor() {
    this._loader = document.createElement('div');
    this._loader.classList.add(classes.loader);
  }

  public get loader() {
    return this._loader;
  }
}

interface IParameters {
  textContent: string;
  href: string;
  callback: () => void;
}

export class Link {
  private _link: HTMLAnchorElement;
  constructor(parameters: IParameters) {
    this._link = document.createElement('a');
    this.view(parameters);
  }

  private view(parameters: IParameters) {
    this._link.textContent = parameters.textContent;
    this._link.href = parameters.href;

    this._link.addEventListener('click', (event) => {
      event.preventDefault();
      parameters.callback();
    });
  }

  get link() {
    return this._link;
  }
}

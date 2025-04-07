import { BaseElement } from '../../base/base-element';

interface IParameters {
  textContent: string;
  callback: (event?: Event) => void;
  className?: string;
}

export class Button {
  private _element: BaseElement<HTMLButtonElement>;
  constructor(parameters: IParameters) {
    this._element = new BaseElement({
      tag: 'button',
      textContent: parameters.textContent,
      className: parameters.className,
    });

    this.view(parameters);
  }

  private view(parameters: IParameters) {
    this._element.element.addEventListener('click', (event) =>
      parameters.callback(event)
    );
  }

  public get element() {
    return this._element.element;
  }
}

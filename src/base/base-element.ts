interface IParameters {
  tag: string;
  className?: string;
  textContent?: string;
}

export class BaseElement<T extends HTMLElement> {
  private _element: T;
  constructor(parameters: IParameters) {
    this._element = document.createElement(parameters.tag) as T;
    if (parameters.className) this._element.classList.add(parameters.className);
    if (parameters.textContent)
      this._element.textContent = parameters.textContent;
  }

  public addClasses(...classNames: string[]) {
    this._element.classList.add(...classNames);
  }

  public append(...elements: HTMLElement[]) {
    this._element.append(...elements);
  }

  public get element() {
    return this._element;
  }
}

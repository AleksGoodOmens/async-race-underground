import modelSVG from './car.svg?raw';

interface IParameters {
  color: string;
  className: string;
}

const carIcon = () => {
  const template = document.createElement('template');
  template.innerHTML = modelSVG.trim();
  const svg = template.content.querySelector('svg') as SVGSVGElement;
  return svg;
};

export default carIcon;

export class CarIcon {
  private _container: HTMLDivElement;
  private _element: SVGSVGElement;
  constructor(parameters: IParameters) {
    this._container = document.createElement('div');
    this._element = carIcon();
    this._element.style.fill = parameters.color;
    this._container.append(this._element);
  }

  public set color(color: string) {
    this._element.style.fill = color;
  }

  public get icon() {
    return this._container;
  }
}

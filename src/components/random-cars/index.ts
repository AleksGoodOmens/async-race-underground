import { postCar } from '../../api/postCar';
import { BaseElement } from '../../base/base-element';
import { carsModels } from '../../pages/garage/cars-models';
import { ICar } from '../../pages/garage/types';

const data = {
  title: 'Random Cars',
  label: 'Amount',
  minimum: 3,
  default: 100,
  create: 'Create',
  error: 'Something go wrong, car not added',
  color: {
    maxHEX: 16777215,
    hex: 16,
    min: 6,
  },
};

export class RandomCars {
  private _element: HTMLDivElement;
  private _amount: HTMLInputElement;
  private _updateList: (newCars: ICar[]) => void;
  constructor(updateList: (newCars: ICar[]) => void) {
    this._element = new BaseElement<HTMLDivElement>({ tag: 'div' }).element;
    this._amount = new BaseElement<HTMLInputElement>({ tag: 'input' }).element;
    this._updateList = updateList;
    this.init();
  }

  private init() {
    const title = new BaseElement<HTMLHeadingElement>({
      tag: 'h2',
      textContent: data.title,
    });
    const label = new BaseElement<HTMLLabelElement>({
      tag: 'label',
      textContent: data.label,
    });

    this._amount.type = 'number';
    this._amount.min = String(data.minimum);
    this._amount.max = String(data.default + data.default);
    this._amount.value = String(data.default);

    label.append(this._amount);

    const create = new BaseElement<HTMLButtonElement>({
      tag: 'button',
      textContent: data.create,
    });

    create.element.addEventListener('click', (event: Event) =>
      this.createHandler(event)
    );

    this._element.append(title.element, label.element, create.element);
  }

  private async createHandler(event: Event) {
    const target = event.target;
    if (target instanceof HTMLButtonElement) {
      target.disabled = true;
      const allCarsAdded = [];
      for (let i = 0; i < Number.parseInt(this._amount.value); i++) {
        allCarsAdded.push(postCar(this.getRandomCar()));
      }

      const newCars = await Promise.all(allCarsAdded);
      const cars = newCars.filter(
        (car) => !Object.hasOwn(car, 'error')
      ) as ICar[];

      this._updateList(cars);
      target.disabled = false;
    }
  }

  private getRandomCar() {
    const brands = Object.keys(carsModels) as (keyof typeof carsModels)[];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const models = carsModels[randomBrand];
    const randomModel = models[Math.floor(Math.random() * models.length)];
    return {
      name: `${randomBrand} ${randomModel}`,
      color: this.getRandomHexColor(),
    };
  }

  private getRandomHexColor() {
    return `#${Math.floor(Math.random() * data.color.maxHEX)
      .toString(data.color.hex)
      .padStart(data.color.min, '0')}`;
  }

  public get element() {
    return this._element;
  }
}

import { endpoints } from '../../api/endpoints';
import { carsModels } from '../../pages/garage/cars-models';
import { ICar } from '../../pages/garage/types';
import { buildUrl } from '../../utils/buildUrl';

const data = {
  title: 'Random Cars',
  label: 'Amount',
  minimum: 3,
  default: 100,
  create: 'Create',
  error: 'Something go wrong, car not added',
  color: {
    maxHEX: 256,
    hex: 16,
    min: 6,
  },
};

type returnData =
  | ICar
  | {
      error: string;
    };

export class RandomCars {
  private _element: HTMLDivElement;
  private _amount: HTMLInputElement;
  private _updateList: () => void;
  constructor(updateList: () => void) {
    this._element = document.createElement('div');
    this._amount = document.createElement('input');
    this._updateList = updateList;
    this.init();
  }

  private init() {
    const title = document.createElement('h2');
    title.textContent = data.title;

    const label = document.createElement('label');
    label.textContent = data.label;

    this._amount.type = 'number';
    this._amount.min = String(data.minimum);
    this._amount.max = String(data.default + data.default);
    this._amount.value = String(data.default);

    label.append(this._amount);

    const create = document.createElement('button');
    create.textContent = data.create;

    create.addEventListener('click', (event: Event) =>
      this.createHandler(event)
    );

    this._element.append(title, label, create);
  }

  private async createHandler(event: Event) {
    const target = event.target;
    if (target instanceof HTMLButtonElement) {
      target.disabled = true;
      const allCarsAdded = [];
      for (let i = 0; i < Number.parseInt(this._amount.value); i++) {
        allCarsAdded.push(this.addCar(this.getRandomCar()));
      }

      await Promise.all(allCarsAdded);
      this._updateList();
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

  public async addCar(car: ICar): Promise<returnData> {
    const url = buildUrl(endpoints.BASE, endpoints.GARAGE, {});

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car),
      });

      if (!response.ok) return { error: data.error + response.statusText };

      const json: ICar = await response.json();
      return json;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      }
      return { error: data.error };
    }
  }

  public get element() {
    return this._element;
  }
}

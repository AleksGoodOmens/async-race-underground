import { BaseElement } from '../../base/base-element';
import { ICar } from '../../pages/garage/types';
import { CarItem } from '../car-item/carItem';
import styles from './car-list.module.css';

interface IParameters {
  cars: ICar[];
  fetchCars: () => void;
  setTunning: (car: ICar) => void;
}

const data = {
  message: 'No cars at list',
};

const classes = {
  container: styles['container'],
};

export class CarList {
  private _list: HTMLUListElement;
  private _fetch: () => void;
  private _tunning: (car: ICar) => void;
  private _carItems: CarItem[];

  constructor(parameters: IParameters) {
    this._list = new BaseElement<HTMLUListElement>({
      tag: 'ul',
      className: classes.container,
    }).element;
    this._fetch = () => parameters.fetchCars();
    this._carItems = [];
    this._tunning = parameters.setTunning;
  }

  public view(cars: ICar[]) {
    this.clear();

    if (!cars.length)
      this._list.append(
        new BaseElement<HTMLHeadingElement>({
          tag: 'h2',
          textContent: data.message,
        }).element
      );

    const carItems = cars.map(
      (car) =>
        new CarItem({
          car,
          fetch: () => this._fetch(),
          tunning: (car: ICar) => this._tunning(car),
        })
    );

    this._list.append(...carItems.map((car) => car.element));
    this._carItems = carItems;
  }

  public get cars() {
    return this._carItems;
  }

  public get list() {
    return this._list;
  }

  public clear() {
    while (this._list.lastChild) {
      this._list.lastChild.remove();
    }
  }
}

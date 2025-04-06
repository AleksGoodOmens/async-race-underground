import { BaseElement } from '../../base/base-element';
import { ICar } from '../../pages/garage/types';
import { CarItem } from '../car-item/carItem';

const data = {
  message: 'No cars at list',
};

export class CarList {
  private _list: HTMLUListElement;
  private _fetch: () => void;
  constructor(fetch: () => void) {
    this._list = new BaseElement<HTMLUListElement>({ tag: 'ul' }).element;
    this._fetch = () => fetch();
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

    this._list.append(
      ...cars.map(
        (car) =>
          new CarItem({ type: 'auto', car, fetch: () => this._fetch() }).element
      )
    );
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

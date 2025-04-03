import { ICar } from '../../pages/garage/types';

const data = {
  message: 'No cars at list',
};

export class CarList {
  private _list: HTMLUListElement;
  constructor() {
    this._list = document.createElement('ul');
  }

  public view(cars: ICar[], error: string | null) {
    this.clear();
    if (cars.length) {
      const carsElements = cars.map((car) => {
        const container = document.createElement('li');
        const name = document.createElement('h3');
        const model = document.createElement('div');
        const picker = document.createElement('input');

        const update = document.createElement('button');
        const del = document.createElement('button');

        name.textContent = car.name;

        model.style.backgroundColor = car.color;

        picker.type = 'color';
        picker.value = car.color;

        update.textContent = 'update';

        del.textContent = 'del';

        container.append(name, model, picker, update, del);
        return container;
      });

      this._list.append(...carsElements);
      return;
    } else {
      const message = document.createElement('h2');
      message.textContent = error || data.message;
      this._list.append(message);
    }
  }

  public get list() {
    return this._list;
  }

  private clear() {
    while (this._list.lastChild) {
      this._list.lastChild.remove();
    }
  }
}

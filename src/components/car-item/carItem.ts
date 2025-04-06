import { deleteCar } from '../../api/deleteCar';
import { updateCar } from '../../api/updateCar';
import { BaseElement } from '../../base/base-element';
import { ICar } from '../../pages/garage/types';
import { Button } from '../button/button';
import { CarIcon } from './car';
import styles from './carItem.module.css';

interface IParameters {
  type: 'manual' | 'auto';
  car: ICar;
  fetch: () => void;
}

const data = {
  placeholder: 'Car model',
  delBtn: 'del',
  updateBtn: 'update',
  addBtn: 'add',
  timeout: 20,
};

const classes = {
  container: styles['container'],
};

export class CarItem {
  private _element: BaseElement<HTMLLIElement>;
  private _name: BaseElement<HTMLInputElement>;
  private _model: CarIcon;
  private _picker: BaseElement<HTMLInputElement>;
  private _updateBtn: Button;
  private _id: BaseElement<HTMLDivElement>;
  constructor(parameters: IParameters) {
    this._element = new BaseElement<HTMLLIElement>({
      tag: 'li',
      className: classes.container,
    });
    this._id = new BaseElement<HTMLDivElement>({
      tag: 'div',
      textContent: `#${parameters.car.id}`,
    });
    this._name = new BaseElement<HTMLInputElement>({ tag: 'input' });
    this._picker = new BaseElement<HTMLInputElement>({ tag: 'input' });
    this._model = new CarIcon({ className: 'svg', color: '#fff' });
    this._updateBtn = new Button({
      textContent: data.updateBtn,
      callback: () => {
        this.handleUpdate(parameters.car.id);
      },
    });

    if (parameters.type === 'auto')
      this.viewAuto(parameters.car, () => parameters.fetch());
  }

  private viewAuto(car: ICar, fetch: () => void) {
    this._name.element.placeholder = data.placeholder;
    this._name.element.value = car.name;

    this._model.color = car.color;

    this._picker.element.type = 'color';
    this._picker.element.value = car.color;

    this._picker.element.addEventListener('input', () => {
      const callback = this.handleChangeColor(this._picker.element.value);
      callback();
    });

    const delButton = new Button({
      textContent: data.delBtn,
      callback: () => {
        if (car.id) this.handleDelete(car.id, () => fetch());
      },
    });

    this.element.append(
      this._id.element,
      this._name.element,
      this._model.icon,
      this._picker.element,
      this._updateBtn.element,
      delButton.element
    );
  }

  private async handleDelete(id: number, fetch: () => void) {
    const isDeleted = await deleteCar(id);
    if (isDeleted) {
      fetch();
    }
  }

  private async handleUpdate(id?: number) {
    this._picker.element.disabled = true;
    this._name.element.disabled = true;
    this._updateBtn.element.disabled = true;

    const updatedData = await updateCar({
      id: id,
      color: this._picker.element.value,
      name: this._name.element.value,
    });

    if (updatedData) {
      this._picker.element.value = updatedData.color;
      this._name.element.value = updatedData.name;
    } else {
      this._name.element.value = 'error';
    }

    this._picker.element.disabled = false;
    this._name.element.disabled = false;
    this._updateBtn.element.disabled = false;
  }

  private handleChangeColor(color: string) {
    let timeOut: undefined | number;

    return () => {
      if (timeOut) {
        clearTimeout(timeOut);
      }

      timeOut = setTimeout(() => {
        this._model.color = color;
      }, data.timeout);
    };
  }

  get element() {
    return this._element.element;
  }
}

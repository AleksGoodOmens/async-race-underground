import { BaseElement } from '../../base/base-element';
import { ICar } from '../../pages/garage/types';
import { Button } from '../button/button';
import { CarIcon } from '../car-item/car';
import styles from './repair.module.css';

interface IParameters {
  button: string;
  callback: (car: ICar) => void;
}

const data = {
  modelPlaceholder: 'Car Model',
  timeout: 20,
  defaultColor: '#ffffff',
};

const classes = {
  form: styles['form'],
  name: styles['name'],
  color: styles['color'],
  modelAndPicker: styles['wrapper'],
  button: [styles['button'], 'button'],
};

export class Repair {
  private _element: BaseElement<HTMLFormElement>;
  private _name: BaseElement<HTMLInputElement>;
  private _model: CarIcon;
  private _picker: BaseElement<HTMLInputElement>;
  private _submit: Button;
  private _data?: ICar;

  constructor(parameters: IParameters) {
    this._element = new BaseElement<HTMLFormElement>({
      tag: 'form',
      className: classes.form,
    });
    this._name = new BaseElement<HTMLInputElement>({
      tag: 'input',
      className: classes.name,
    });
    this._picker = new BaseElement<HTMLInputElement>({
      tag: 'input',
      className: classes.color,
    });
    this._data = undefined;
    this._model = new CarIcon({ className: 'svg', color: data.defaultColor });
    this._submit = new Button({
      textContent: parameters.button,
      callback: (event) => {
        if (event) {
          event.preventDefault();
        }
        if (!this._name.element.value.length) return;
        parameters.callback({
          id: this._data?.id,
          name: this._name.element.value,
          color: this._picker.element.value,
        });
      },
    });

    this.draw();
  }

  private draw() {
    this._submit.element.classList.add(...classes.button);

    this._picker.element.type = 'color';
    this._picker.element.value = data.defaultColor;
    this._picker.element.style.backgroundColor = this._picker.element.value;
    this._picker.element.addEventListener('input', () => {
      const callback = this.handleChangeColor(this._picker.element.value);
      callback();
    });

    this._model.icon.classList.add('svg');

    this._name.element.placeholder = data.modelPlaceholder;

    const modelAndPicker = new BaseElement({
      tag: 'div',
      className: classes.modelAndPicker,
    });
    modelAndPicker.append(this._model.icon, this._picker.element);

    this._element.append(
      this._name.element,
      modelAndPicker.element,
      this._submit.element
    );
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

  public reset() {
    this._data = undefined;
    this._name.element.value = '';
    this._picker.element.value = data.defaultColor;
    this._model.color = data.defaultColor;
  }

  public get element() {
    return this._element.element;
  }

  public setCar(car: ICar) {
    this._data = car;
    this._name.element.value = car.name;
    this._picker.element.value = car.color;
    this._model.color = car.color;
  }
}

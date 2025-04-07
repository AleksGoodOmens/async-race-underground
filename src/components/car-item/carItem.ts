import { carEngineControl, IStartResponse } from '../../api/carEngineControl';
import { deleteCar } from '../../api/deleteCar';
import { BaseElement } from '../../base/base-element';
import { ICar } from '../../pages/garage/types';
import { shortString } from '../../utils/shortString';
import { Button } from '../button/button';
import { CarIcon } from './car';
import { CarAnimator } from './car-animation';
import styles from './carItem.module.css';

interface IParameters {
  car: ICar;
  fetch: () => void;
  tunning: (car: ICar) => void;
}

const data = {
  delBtn: 'delete',
  select: 'select',
  start: 'start',
  stop: 'stop',
  FULL_TRACK: 100,
  START_INDEX: 0,
  END_INDEX: -2,
};

const classes = {
  container: styles['container'],
  track: styles['track'],
  controls: styles['controls'],
  car: styles['car'],
  name: styles['name'],
  delete: styles['delete'],
  select: styles['select'],
  start: styles['start'],
  stop: styles['stop'],
};

export class CarItem {
  private _element: BaseElement<HTMLLIElement>;
  private _fetch: () => void;
  private _tunning: (car: ICar) => void;
  private _name: BaseElement<HTMLDivElement>;
  private _deleteBtn: Button;
  private _selectBtn: Button;
  private _startBtn: Button;
  private _stopBtn: Button;
  private _track: BaseElement<HTMLDivElement>;
  private _model: CarIcon;
  private _carAnimator: CarAnimator;

  constructor(parameters: IParameters) {
    this._fetch = parameters.fetch;
    this._tunning = parameters.tunning;
    this._element = new BaseElement({
      tag: 'li',
      className: classes.container,
    });
    this._name = new BaseElement({
      tag: 'div',
      className: classes.name,
      textContent: shortString(parameters.car.name),
    });
    this._deleteBtn = new Button({
      textContent: data.delBtn,
      className: classes.delete,
      callback: () => {
        if (parameters.car.id) this.handleDelete(parameters.car.id);
      },
    });
    this._selectBtn = new Button({
      textContent: data.select,
      className: classes.select,
      callback: () => {
        this.handleSelect(parameters.car);
      },
    });
    this._startBtn = new Button({
      textContent: data.start,
      className: classes.start,
      callback: () => this.handleStart(parameters.car.id),
    });
    this._stopBtn = new Button({
      textContent: data.stop,
      className: classes.stop,
      callback: () => this.handleStop(parameters.car.id),
    });
    this._track = new BaseElement({ tag: 'div', className: classes.track });
    this._model = new CarIcon({
      className: 'svg',
      color: parameters.car.color,
    });
    this._model.icon.classList.add(classes.car);

    const carControls = new BaseElement({
      tag: 'div',
      className: classes.controls,
    });

    this._carAnimator = new CarAnimator(this._model.icon);

    carControls.append(
      this._name.element,
      this._selectBtn.element,
      this._deleteBtn.element,
      this._startBtn.element,
      this._stopBtn.element
    );

    this._track.append(this._model.icon);

    this.element.append(carControls.element, this._track.element);
  }

  private handleSelect(car: ICar) {
    this._tunning(car);
  }

  private async handleStop(id?: number) {
    if (id) {
      await carEngineControl({
        id,
        status: 'stopped',
      });
    }

    this._carAnimator.reset();
  }
  private async handleDelete(id: number) {
    const isDeleted = await deleteCar(id);
    if (isDeleted) this._fetch();
  }

  public async handleStart(id?: number) {
    if (id) {
      const started: IStartResponse = await carEngineControl({
        id,
        status: 'started',
      });
      const { distance, velocity } = started;
      const trackLength =
        Number.parseFloat(
          window
            .getComputedStyle(this._track.element)
            .width.slice(data.START_INDEX, data.END_INDEX)
        ) -
        Number.parseFloat(
          window
            .getComputedStyle(this._model.icon)
            .width.slice(data.START_INDEX, data.END_INDEX)
        );
      this._carAnimator.start(distance, velocity, trackLength);
      const drive = await carEngineControl({ id, status: 'drive' });

      if (drive.error) this._carAnimator.stop();
    }
  }

  get element() {
    return this._element.element;
  }
}

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
  win: styles['win'],
};

export class CarItem {
  private _parameters: IParameters;
  private _element: BaseElement<HTMLLIElement>;
  private _buttons: {
    _deleteButton: Button;
    _selectButton: Button;
    _startButton: Button;
    _stopButton: Button;
  };
  private _name: BaseElement<HTMLDivElement>;
  private _track: BaseElement<HTMLDivElement>;
  private _model: CarIcon;
  private _carAnimator: CarAnimator;
  private _isWinning: boolean;

  constructor(parameters: IParameters) {
    this._parameters = {
      car: parameters.car,
      fetch: parameters.fetch,
      tunning: parameters.tunning,
    };
    this._buttons = this.drawButtons();
    this._element = new BaseElement({
      tag: 'li',
      className: classes.container,
    });
    this._track = new BaseElement({ tag: 'div', className: classes.track });
    this._name = new BaseElement({
      tag: 'div',
      className: classes.name,
      textContent: shortString(parameters.car.name),
    });
    this._model = new CarIcon({
      className: 'svg',
      color: parameters.car.color,
    });
    this._carAnimator = new CarAnimator(this._model.icon);
    this._isWinning = false;

    this.init();
  }

  private drawButtons() {
    const _deleteButton = new Button({
      textContent: data.delBtn,
      className: classes.delete,
      callback: () => {
        this.handleDelete(this._parameters.car.id as number);
      },
    });
    const _selectButton = new Button({
      textContent: data.select,
      className: classes.select,
      callback: () => {
        this.handleSelect(this._parameters.car);
      },
    });
    const _startButton = new Button({
      textContent: data.start,
      className: classes.start,
      callback: () => this.handleTestDrive(this._parameters.car.id as number),
    });
    const _stopButton = new Button({
      textContent: data.stop,
      className: classes.stop,
      callback: () => this.handleStop(this._parameters.car.id),
    });
    return { _deleteButton, _selectButton, _startButton, _stopButton };
  }

  private init() {
    this._model.icon.classList.add(classes.car);

    const carControls = new BaseElement({
      tag: 'div',
      className: classes.controls,
    });

    carControls.append(
      this._name.element,
      this._buttons._selectButton.element,
      this._buttons._deleteButton.element,
      this._buttons._startButton.element,
      this._buttons._stopButton.element
    );

    this._track.append(this._model.icon);

    this.element.append(carControls.element, this._track.element);
  }

  private handleSelect(car: ICar) {
    this._parameters.tunning(car);
  }
  private async handleDelete(id: number) {
    const isDeleted = await deleteCar(id);
    if (isDeleted) this._parameters.fetch();
  }

  private async handleTestDrive(id: number) {
    const data = await this.handleStart(id);

    if (!data) return console.log('engine is broken');

    await this.handleMove(data);
  }
  public async handleStop(id?: number) {
    if (id) {
      await carEngineControl({
        id,
        status: 'stopped',
      });
    }
    if (this._isWinning) {
      this._isWinning = false;
      this.element.lastChild?.remove();
    }

    this._carAnimator.reset();
  }

  public async handleStart(id?: number) {
    if (!id) return;

    const started: IStartResponse = await carEngineControl({
      id,
      status: 'started',
    });
    if (started) {
      return started;
    }
  }

  public async handleMove(data: IStartResponse) {
    const trackWidth = this._track.element.clientWidth;
    const carWidth = this._model.icon.clientWidth;

    const trackLength = trackWidth - carWidth;
    const duration = this._carAnimator.start(
      data.distance,
      data.velocity,
      trackLength
    );
    const drive = await carEngineControl({ id: data.id, status: 'drive' });

    if (drive.error) {
      this._carAnimator.stop();
      return {
        id: data.id,
        finish: false,
        time: 0,
      };
    }

    if (drive.success) {
      return {
        id: data.id,
        finish: true,
        time: duration,
      };
    }
  }

  public makeItWin(time: string) {
    const message = new BaseElement({
      tag: 'div',
      className: classes.win,
      textContent: `${this._parameters.car.name} with ${time}`,
    });
    this.element.append(message.element);
    this._isWinning = true;
  }

  get id() {
    return this._parameters.car.id;
  }

  get element() {
    return this._element.element;
  }
}

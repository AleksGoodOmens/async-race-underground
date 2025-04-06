import { deleteCar } from '../../api/deleteCar';
import { endpoints } from '../../api/endpoints';
import { getData } from '../../api/getData';
import { BaseElement } from '../../base/base-element';
import { directions, ICar } from '../../pages/garage/types';
import { buildUrl } from '../../utils/buildUrl';
import { Button } from '../button/button';
import styles from './pagination.module.css';

const data = {
  back: '<<',
  next: '>>',
  amount: '1/1',
  clear: 'delete list',
  ONE: 1,
};

const classes = {
  container: styles['container'],
};

interface IParameters {
  currentPage: number;
  totalPages: number;
}

interface IConstructorParameters {
  changePage: (direction: directions) => void;
  clearList: () => void;
}

export class Pagination {
  private _container: BaseElement<HTMLDivElement>;
  private _back: Button;
  private _next: Button;
  private _amount: HTMLDivElement;
  private _clear: Button;
  private _changePage: (direction: directions) => void;
  private _clearList: () => void;
  constructor(parameters: IConstructorParameters) {
    this._container = new BaseElement<HTMLDivElement>({
      tag: 'div',
      className: classes.container,
    });
    this._back = new Button({
      textContent: data.back,
      callback: () => this.changePageHandler(directions.back),
    });
    this._next = new Button({
      textContent: data.next,
      callback: () => this.changePageHandler(directions.next),
    });
    this._amount = new BaseElement<HTMLDivElement>({
      tag: 'div',
      textContent: data.amount,
    }).element;
    this._clear = new Button({
      textContent: data.clear,
      callback: () => this.deletePageHandler(),
    });
    this._changePage = parameters.changePage;
    this._clearList = parameters.clearList;

    this._container.append(
      this._back.element,
      this._amount,
      this._next.element,
      this._clear.element
    );
  }

  private async deletePageHandler() {
    this._clear.element.disabled = true;

    const url = buildUrl(endpoints.BASE, endpoints.GARAGE, {});
    const responseData = await getData<ICar[]>(url);
    if ('error' in responseData) {
      return;
    }
    const promises = responseData.data.map((car) => {
      if (car.id) return deleteCar(car.id);
    });
    await Promise.all(promises);
    this._clear.element.disabled = false;
    this._clearList();
  }

  private changePageHandler(direction: directions) {
    this._changePage(direction);
  }

  public update(parameters: IParameters) {
    if (parameters.currentPage <= data.ONE) this._back.element.disabled = true;
    else this._back.element.disabled = false;

    if (parameters.currentPage >= parameters.totalPages)
      this._next.element.disabled = true;
    else this._next.element.disabled = false;

    this._amount.textContent = `${parameters.currentPage} / ${parameters.totalPages}`;

    if (!parameters.totalPages) this._clear.element.disabled = true;
    else this._clear.element.disabled = false;
  }

  public get element() {
    return this._container.element;
  }
}

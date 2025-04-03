import { directions } from '../../pages/garage/types';

const data = {
  back: '<<',
  next: '>>',
  amount: '1/1',
  clear: 'Clear',
  ONE: 1,
};

interface IParameters {
  currentPage: number;
  totalPages: number;
}

export class Pagination {
  private _container: HTMLDivElement;
  private _back: HTMLButtonElement;
  private _next: HTMLButtonElement;
  private _amount: HTMLDivElement;
  private _changePage: (direction: directions) => void;
  constructor(changePage: (direction: directions) => void) {
    this._container = document.createElement('div');
    this._back = document.createElement('button');
    this._next = document.createElement('button');
    this._amount = document.createElement('div');
    this._changePage = changePage;
    this.init();
  }

  private init() {
    this._back.textContent = data.back;
    this._next.textContent = data.next;
    this._amount.textContent = data.amount;
    const clear = document.createElement('button');
    clear.textContent = data.clear;

    this._back.addEventListener('click', () =>
      this.changePageHandler(directions.back)
    );
    this._next.addEventListener('click', () =>
      this.changePageHandler(directions.next)
    );

    this._container.append(this._back, this._amount, this._next, clear);
  }

  private changePageHandler(direction: directions) {
    this._changePage(direction);
  }

  public update(parameters: IParameters) {
    if (parameters.currentPage <= data.ONE) {
      this._back.disabled = true;
    } else {
      this._back.disabled = false;
    }
    if (parameters.currentPage >= parameters.totalPages) {
      this._next.disabled = true;
    } else {
      this._next.disabled = false;
    }
    this._amount.textContent = `${parameters.currentPage} / ${parameters.totalPages}`;
  }

  public get htmlElement() {
    return this._container;
  }
}

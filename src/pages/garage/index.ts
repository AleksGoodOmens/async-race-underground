import { endpoints } from '../../api/endpoints';
import { getData } from '../../api/getData';
import { BaseElement } from '../../base/base-element';
import { Page } from '../../base/page';
import { CarList } from '../../components/car-list';
import { Link } from '../../components/link';
import { Loader } from '../../components/loader/loader';
import { Pagination } from '../../components/pagination';
import { RandomCars } from '../../components/random-cars';
import { PATH } from '../../router/path';
import { buildUrl } from '../../utils/buildUrl';
import { getNumberValueFromSearchParameters } from '../../utils/getNumberValueFromSearchParameters';
import styles from './garage.module.css';
import { directions, ICar } from './types';

const data = {
  title: 'Garage',
  link: 'Winners',
  searchParams: { limit: '_limit', page: '_page' },
  defaultLimit: 7,
  defaultPage: 1,
  FIRST: 0,
};

const classes = {
  wrapper: styles['wrapper'],
};

export class GaragePage extends Page {
  private _currentPage: number;
  private _totalCars: number;
  private _cars: ICar[];
  private _carList: CarList;
  private _pagination: Pagination;
  private _randomCars: RandomCars;

  constructor() {
    super();
    this.page.append(new Loader().loader);

    this._currentPage = getNumberValueFromSearchParameters(
      data.searchParams.page,
      data.defaultPage
    );
    this._totalCars = 0;
    this._cars = [];

    this.fetchCars();

    this._carList = new CarList();
    this._pagination = new Pagination({
      changePage: (direction: directions) => this.changePage(direction),
      clearList: () => this.clearList(),
    });
    this._randomCars = new RandomCars((cars: ICar[]) => this.update(cars));
  }

  public changePage(direction: directions) {
    this._currentPage += direction;

    this.updateUrl();
    this._carList.clear();
    this._carList.list.append(new Loader().loader);
    this.fetchCars();
  }

  private updateUrl() {
    const searchParameters = new URLSearchParams();
    searchParameters.set(data.searchParams.page, String(this._currentPage));

    window.location.hash = `${PATH.GARAGE}?${searchParameters.toString()}`;
  }

  public async view() {
    this.clear();

    const title = new BaseElement({ tag: 'h1', textContent: data.title });

    const winnersLink = new Link({
      href: PATH.WINNERS,
      textContent: data.link,
      callback: () => {},
    });

    const wrapper = new BaseElement({ tag: 'div', className: classes.wrapper });
    wrapper.append(this._pagination.element, this._randomCars.element);

    this._carList.view(this._cars);
    this.page.append(
      title.element,
      winnersLink.link,
      wrapper.element,
      this._carList.list
    );
  }

  public async clearList() {
    this._cars = [];
    this._totalCars = 0;
    this._currentPage = 1;
    this.updateUrl();
    this.fetchCars();
  }

  public async fetchCars() {
    const url = buildUrl(endpoints.BASE, endpoints.GARAGE, {
      [data.searchParams.limit]: getNumberValueFromSearchParameters(
        data.searchParams.limit,
        data.defaultLimit
      ),
      [data.searchParams.page]: this._currentPage,
    });

    const returnedData = await getData<ICar[]>(url);

    if ('error' in returnedData) {
      this.viewError(returnedData.error);
      return;
    }

    this._cars = returnedData.data;

    if (returnedData.totalAmount) {
      const value = Number.parseInt(returnedData.totalAmount);

      this._totalCars = value;
      this.update();
    }

    this.view();
  }

  private update(newCars?: ICar[]) {
    if (newCars) {
      this._totalCars += newCars.length;
      if (this._cars.length < data.defaultLimit)
        this._cars.push(
          ...newCars.slice(
            data.FIRST,
            data.defaultLimit - this._cars.length + data.FIRST
          )
        );
      this._carList.view(this._cars);
    }
    this._pagination.update({
      totalPages: Math.ceil(this._totalCars / data.defaultLimit),
      currentPage: this._currentPage,
    });
  }

  private viewError(message: string) {
    this.clear();
    const h1 = new BaseElement<HTMLHeadingElement>({
      tag: 'h2',
      textContent: message,
    }).element;

    this.page.append(h1);
  }
}

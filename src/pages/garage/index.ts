import { endpoints } from '../../api/endpoints';
import { getData } from '../../api/getData';
import { postCar } from '../../api/postCar';
import { updateCar } from '../../api/updateCar';
import { BaseElement } from '../../base/base-element';
import { Page } from '../../base/page';
import { CarList } from '../../components/car-list';
import { Link } from '../../components/link';
import { Loader } from '../../components/loader/loader';
import { Pagination } from '../../components/pagination';
import { RaceControls } from '../../components/race-controls';
import { RandomCars } from '../../components/random-cars';
import { Repair } from '../../components/repair/repair';
import { PATH } from '../../router/path';
import { buildUrl } from '../../utils/buildUrl';
import { getNumberValueFromSearchParameters } from '../../utils/getNumberValueFromSearchParameters';
import styles from './garage.module.css';
import { directions, ICar } from './types';

const data = {
  title: 'Garage',
  link: '===> Winners',
  searchParams: { limit: '_limit', page: '_page' },
  defaultLimit: 7,
  defaultPage: 1,
  FIRST: 0,
};

const classes = {
  page: styles['page'],
  wrapper: styles['wrapper'],
  repairStation: styles['station'],
  link: styles['link'],
};

export class GaragePage extends Page {
  private _currentPage: number;
  private _totalCars: number;
  private _cars: ICar[];
  private _carList: CarList;
  private _raceControls: RaceControls;
  private _carUpdate: Repair;
  private _carCreate: Repair;
  private _pagination: Pagination;
  private _randomCars: RandomCars;
  private _navigate: () => void;

  constructor(navigateTo: () => void) {
    super();
    this._navigate = navigateTo;
    this.page.append(new Loader().loader);
    this.page.classList.add(classes.page);
    this._carUpdate = new Repair({
      button: 'tunning',
      callback: (car: ICar) => this.handleTunningCar(car),
    });
    this._carCreate = new Repair({
      button: 'Create',
      callback: (car: ICar) => this.handleAddCar(car),
    });

    this._currentPage = getNumberValueFromSearchParameters(
      data.searchParams.page,
      data.defaultPage
    );
    this._totalCars = 0;
    this._cars = [];

    this.fetchCars();
    this._carList = new CarList({
      cars: this._cars,
      setTunning: (car: ICar) => this._carUpdate.setCar(car),
      fetchCars: () => this.fetchCars(),
    });
    this._raceControls = new RaceControls();

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

    const title = new BaseElement({
      tag: 'h1',
      textContent: data.title,
      className: 'page-title',
    });

    const winnersLink = new Link({
      href: PATH.WINNERS,
      textContent: data.link,
      className: classes.link,
      callback: this._navigate,
    });

    const header = new BaseElement({ tag: 'header', className: 'page-header' });
    header.append(title.element, winnersLink.link);

    const repairStation = new BaseElement({
      tag: 'div',
      className: classes.repairStation,
    });
    repairStation.append(this._carUpdate.element, this._carCreate.element);

    const wrapper = new BaseElement({ tag: 'div', className: classes.wrapper });
    wrapper.append(this._pagination.element, this._randomCars.element);

    this._carList.view(this._cars);
    this.page.append(
      header.element,
      repairStation.element,
      wrapper.element,
      this._raceControls.element,
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
  public fetchCars() {
    const url = buildUrl(endpoints.BASE, endpoints.GARAGE, {
      [data.searchParams.limit]: getNumberValueFromSearchParameters(
        data.searchParams.limit,
        data.defaultLimit
      ),
      [data.searchParams.page]: this._currentPage,
    });

    (async () => {
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
      this._raceControls.cars = this._carList.cars;
    })();
  }
  private async handleAddCar(car: ICar) {
    await postCar(car);
    this._carCreate.reset();
    this.fetchCars();
  }
  private async handleTunningCar(car: ICar) {
    const updateRequest = await updateCar(car);
    if (updateRequest) {
      this._carUpdate.reset();
      this.fetchCars();
    }
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
      this._raceControls.cars = this._carList.cars;
    }
    this._pagination.update({
      totalCars: this._totalCars,
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

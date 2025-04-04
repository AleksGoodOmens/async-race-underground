import { deleteCar } from '../../api/deleteCar';
import { endpoints } from '../../api/endpoints';
import { getData } from '../../api/getData';
import { Page } from '../../base/page';
import { CarList } from '../../components/car-list';
import { Link } from '../../components/link';
import { Pagination } from '../../components/pagination';
import { RandomCars } from '../../components/random-cars';
import { App } from '../../main';
import { PATH } from '../../router/path';
import { buildUrl } from '../../utils/buildUrl';
import { getNumberValueFromSearchParameters } from '../../utils/getNumberValueFromSearchParameters';
import { directions, ICar } from './types';

const data = {
  title: 'Garage',
  link: 'Winners',
  searchParams: { limit: '_limit', page: '_page' },
  defaultLimit: 7,
  defaultPage: 1,
};

export class GaragePage extends Page {
  private _carList: CarList;
  private _cars: ICar[];
  private _totalCars: number;
  private _errorMessage: string | null;
  private _pagination: Pagination;
  private _randomCars: RandomCars;
  private _currentPage: number;

  constructor(app: App) {
    super(app);
    this._errorMessage = null;
    this._cars = [];
    this._carList = new CarList();
    this._pagination = new Pagination({
      changePage: (direction: directions) => this.changePage(direction),
      clearList: () => this.clearList(),
    });
    this._randomCars = new RandomCars(() => this.update());
    this._totalCars = 0;
    this._currentPage = getNumberValueFromSearchParameters(
      data.searchParams.page,
      data.defaultPage
    );
  }

  public changePage(direction: directions) {
    this._currentPage += direction;
    const searchParameters = new URLSearchParams();
    searchParameters.set(data.searchParams.page, String(this._currentPage));

    window.location.hash = `/${endpoints.GARAGE}?${searchParameters.toString()}`;

    this.update();
  }

  public async view() {
    this.clear();
    const title = document.createElement('h1');
    title.textContent = data.title;

    const winnersLink = new Link({
      href: PATH.WINNERS,
      textContent: data.link,
      callback: () => this._app.router.navigate(PATH.WINNERS),
    }).link;

    this.page.append(
      title,
      winnersLink,
      this._pagination.htmlElement,
      this._randomCars.element,
      this._carList.list
    );
    this._app.main.append(this.page);

    await this.fetchCars();

    this.update();
  }

  public async clearList() {
    const promises = this._cars.map((car) => {
      if (car.id) return deleteCar(car.id);
    });
    await Promise.all(promises);

    await this.update();
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
      this._errorMessage = returnedData.error;
      return;
    }

    this._cars = returnedData.data;

    if (returnedData.totalAmount) {
      const value = Number.parseInt(returnedData.totalAmount);

      this._totalCars = value;
    }
  }

  public async update() {
    await this.fetchCars();
    this._carList.view(this._cars, this._errorMessage);
    this._pagination.update({
      totalPages: Math.ceil(this._totalCars / data.defaultLimit),
      currentPage: this._currentPage,
    });
  }
}

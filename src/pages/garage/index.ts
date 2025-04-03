import { endpoints } from '../../api/endpoints';
import { getData } from '../../api/getData';
import { Page } from '../../base/page';
import { CarList } from '../../components/car-list';
import { Link } from '../../components/link';
import { App } from '../../main';
import { PATH } from '../../router/path';
import { buildUrl } from '../../utils/buildUrl';
import { getNumberValueFromSearchParameters } from '../../utils/getNumberValueFromSearchParameters';
import { ICar } from './types';

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
  private _errorMessage: string | null;
  constructor(app: App) {
    super(app);
    this._errorMessage = null;
    this._cars = [];
    this._carList = new CarList();
  }

  public async view() {
    this.clear();
    const title = document.createElement('h1');
    title.textContent = data.title;

    const winnersLink = new Link({
      textContent: data.link,
      href: PATH.WINNERS,
      callback: () => this._app.router.navigate(PATH.WINNERS),
    }).link;

    await this.fetchCars();

    this._carList.view(this._cars, this._errorMessage);

    this.page.append(title, winnersLink, this._carList.list);
    this._app.main.append(this.page);
  }

  public async fetchCars() {
    const url = buildUrl(endpoints.BASE, endpoints.GARAGE, {
      [data.searchParams.limit]: getNumberValueFromSearchParameters(
        data.searchParams.limit,
        data.defaultLimit
      ),
      [data.searchParams.page]: getNumberValueFromSearchParameters(
        data.searchParams.page,
        data.defaultPage
      ),
    });

    const returnedData = await getData<ICar[]>(url);

    if ('error' in returnedData) {
      this._errorMessage = returnedData.error;
      return;
    }

    this._cars = returnedData.data;
  }
}

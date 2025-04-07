import { Page } from '../../base/page';
import { Link } from '../../components/link';
import { PATH } from '../../router/path';

const data = {
  title: 'Winners',
  link: 'Go to the Garage',
};

export class WinnersPage extends Page {
  private _navigate: () => void;
  constructor(navigateTo: () => void) {
    super();
    this._navigate = navigateTo;
    this.view();
  }

  public view() {
    this.clear();
    const title = document.createElement('h1');
    title.textContent = data.title;

    const garageLink = new Link({
      textContent: data.link,
      href: PATH.GARAGE,
      callback: this._navigate,
    }).link;

    this.page.append(title, garageLink);
  }
}

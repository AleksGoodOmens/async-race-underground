import { Page } from '../../base/page';
import { Link } from '../../components/link';
import { App } from '../../main';
import { PATH } from '../../router/path';

const data = {
  title: 'Winners',
  link: 'Go to the Garage',
};

export class WinnersPage extends Page {
  constructor(app: App) {
    super(app);
  }

  public view() {
    this.clear();
    const title = document.createElement('h1');
    title.textContent = data.title;

    const garageLink = new Link({
      textContent: data.link,
      href: PATH.GARAGE,
      callback: () => this._app.router.navigate(PATH.GARAGE),
    }).link;

    this.page.append(title, garageLink);
    this._app.main.append(this.page);
  }
}

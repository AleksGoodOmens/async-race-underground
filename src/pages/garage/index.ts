import { Page } from '../../base/page';
import { Link } from '../../components/link';
import { App } from '../../main';
import { PATH } from '../../router/path';

const data = {
  title: 'Garage',
  link: 'Winners',
};

export class GaragePage extends Page {
  constructor(app: App) {
    super(app);
  }

  public view() {
    this.clear();
    const title = document.createElement('h1');
    title.textContent = data.title;

    const winnersLink = new Link({
      textContent: data.link,
      href: PATH.WINNERS,
      callback: () => this._app.router.navigate(PATH.WINNERS),
    }).link;

    this.page.append(title, winnersLink);
    this._app.main.append(this.page);
  }
}

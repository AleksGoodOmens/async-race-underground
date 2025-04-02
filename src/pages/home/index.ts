import { Page } from '../../base/page';
import { Link } from '../../components/link';
import { App } from '../../main';
import { PATH } from '../../router/path';

const data = {
  title: 'home',
  start: 'Race',
};

export class HomePage extends Page {
  constructor(app: App) {
    super(app);
  }

  public view() {
    this.clear();
    const title = document.createElement('h1');
    title.textContent = data.title;

    const startLink = new Link({
      textContent: data.start,
      href: PATH.GARAGE,
      callback: () => this._app.router.navigate(PATH.GARAGE),
    }).link;

    this.page.append(title, startLink);
    this._app.main.append(this.page);
  }
}

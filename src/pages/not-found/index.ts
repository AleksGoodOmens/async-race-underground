import { Page } from '../../base/page';
import { Link } from '../../components/link';
import { App } from '../../main';
import { PATH } from '../../router/path';

const data = {
  title: 'This page not found',
  link: 'Go to home page',
};

export class NotFoundPage extends Page {
  constructor(app: App) {
    super(app);
  }

  public view() {
    const title = document.createElement('h1');
    title.textContent = data.title;

    const returnLink = new Link({
      textContent: data.link,
      href: PATH.HOME,
      callback: () => this._app.router.navigate(PATH.HOME),
    }).link;
    this.page.append(title, returnLink);
    this._app.main.append(this.page);
  }
}

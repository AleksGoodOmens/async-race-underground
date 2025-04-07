import { Page } from '../../base/page';
import { Link } from '../../components/link';
import { PATH } from '../../router/path';

const data = {
  title: 'This page not found',
  link: 'Go to home page',
};

export class NotFoundPage extends Page {
  private _navigate: () => void;
  constructor(navigateTo: () => void) {
    super();
    this._navigate = navigateTo;
    this.view();
  }

  public view() {
    const title = document.createElement('h1');
    title.textContent = data.title;

    const returnLink = new Link({
      textContent: data.link,
      href: PATH.HOME,
      callback: this._navigate,
    }).link;
    this.page.append(title, returnLink);
  }
}

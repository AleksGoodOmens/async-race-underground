import { BaseElement } from '../../base/base-element';
import { Page } from '../../base/page';
import { Link } from '../../components/link';
import { PATH } from '../../router/path';

const data = {
  title: 'home',
  start: 'Race',
};

export class HomePage extends Page {
  constructor(navigateTo: () => void) {
    super();
    this.view(navigateTo);
  }

  private view(navigateTo: () => void) {
    const title = new BaseElement({ tag: 'h1', textContent: data.title });

    const startLink = new Link({
      textContent: data.start,
      href: PATH.GARAGE,
      callback: navigateTo,
    });

    this.page.append(title.element, startLink.link);
  }
}

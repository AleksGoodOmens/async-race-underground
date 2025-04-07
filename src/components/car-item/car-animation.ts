export class CarAnimator {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public start(
    distance: number,
    velocity: number,
    trackLength: number
  ): number {
    const duration = distance / trackLength / velocity;

    this.element.style.transition = `transform ${duration}s linear`;
    this.element.style.transform = `translateX(${trackLength}px)`;

    return duration;
  }

  public stop() {
    const computedStyle = getComputedStyle(this.element);
    const matrix = new DOMMatrixReadOnly(computedStyle.transform);
    const currentX = matrix.m41;

    this.element.style.transition = 'none';
    this.element.style.transform = `translateX(${currentX}px)`;
  }

  public reset() {
    this.element.style.transition = 'none';
    this.element.style.transform = 'translateX(0)';
  }
}

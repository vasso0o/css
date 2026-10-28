import { Directive, ElementRef, afterNextRender, inject, input, numberAttribute } from '@angular/core';

/**
 * Fades and lifts an element in when it scrolls into view. Server-rendered HTML stays fully visible;
 * only elements below the fold are hidden after hydration, so there is no flash and no-JS still works.
 * The `.rv` / `.rv-in` classes live in styles.css.
 */
@Directive({ selector: '[reveal]' })
export class Reveal {
  /** Optional stagger delay in milliseconds, e.g. [reveal]="i * 80". */
  readonly delay = input(0, { alias: 'reveal', transform: (v: unknown) => numberAttribute(v, 0) });

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    afterNextRender(() => {
      if (
        typeof IntersectionObserver === 'undefined' ||
        matchMedia('(prefers-reduced-motion: reduce)').matches ||
        el.getBoundingClientRect().top < window.innerHeight * 0.92
      ) {
        return;
      }
      el.style.transitionDelay = `${this.delay()}ms`;
      el.classList.add('rv');
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            el.classList.add('rv-in');
            io.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      io.observe(el);
    });
  }
}

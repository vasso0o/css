import { Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { BlockBase, isSafeUrl } from './block-style';

/** Coverflow carousel: the active slide is large and opaque, neighbours shrink and fade. */
@Component({
  selector: 'block-carousel',
  template: `
    @if (slides().length) {
      <section class="wrap" (mouseenter)="paused.set(true)" (mouseleave)="paused.set(false)" (focusin)="paused.set(true)" (focusout)="paused.set(false)">
        @if (text('title')) {
          <h2>{{ text('title') }}</h2>
        }
        <div
          class="stage"
          role="group"
          aria-roledescription="carousel"
          tabindex="0"
          (keydown.arrowright)="go(active() + 1)"
          (keydown.arrowleft)="go(active() - 1)"
          (pointerdown)="down($event)"
          (pointerup)="up($event)"
        >
          @for (s of slides(); track $index) {
            <figure
              class="slide"
              [class.active]="$index === active()"
              [style]="slideStyle($index)"
              [attr.aria-hidden]="$index !== active()"
              (click)="go($index)"
            >
              <img [src]="s['url']" [alt]="s['alt'] ?? ''" draggable="false" [attr.loading]="$index === 0 ? 'eager' : 'lazy'" />
              @if (s['title'] || s['text']) {
                <figcaption>
                  @if (s['title']) {
                    <strong>{{ s['title'] }}</strong>
                  }
                  @if (s['text']) {
                    <span>{{ s['text'] }}</span>
                  }
                </figcaption>
              }
            </figure>
          }
          @if (slides().length > 1) {
            <button class="arrow prev" type="button" aria-label="Previous slide" (click)="go(active() - 1)">‹</button>
            <button class="arrow next" type="button" aria-label="Next slide" (click)="go(active() + 1)">›</button>
          }
        </div>
        @if (slides().length > 1) {
          <div class="dots">
            @for (s of slides(); track $index) {
              <button type="button" [class.on]="$index === active()" [attr.aria-label]="'Go to slide ' + ($index + 1)" (click)="go($index)"></button>
            }
          </div>
        }
      </section>
    }
  `,
  styles: `
    :host { display: block; background: var(--bg, transparent); color: var(--fg, var(--c-fg)); overflow: hidden; }
    .wrap { max-width: var(--max, 1120px); margin: 0 auto; padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 2)) var(--pad-x, var(--site-pad))); }
    h2 { font-size: clamp(1.6rem, 3.2vw, 2.3rem); margin: 0 0 1.5rem; text-align: var(--align, center); letter-spacing: -.01em; }
    .stage { position: relative; aspect-ratio: 16 / 8; min-height: 240px; touch-action: pan-y; user-select: none; outline: none; }
    .stage:focus-visible { outline: 2px solid var(--accent, var(--c-accent)); outline-offset: 6px; border-radius: var(--site-radius); }
    .slide { position: absolute; top: 0; bottom: 0; left: 15%; width: 70%; margin: 0; overflow: hidden; cursor: pointer; border-radius: var(--img-radius, var(--radius, calc(var(--site-radius) * 2)));
      box-shadow: 0 30px 60px -30px rgba(0,0,0,.6); background: var(--c-surface);
      transition: transform .7s cubic-bezier(.22,.8,.2,1), opacity .7s ease, filter .7s ease; will-change: transform, opacity; }
    .slide.active { cursor: default; }
    .slide img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 6s ease-out; }
    .slide.active img { transform: scale(1.06); }
    figcaption { position: absolute; inset: auto 0 0; padding: 3rem 1.5rem 1.25rem; color: #fff; display: flex; flex-direction: column; gap: .25rem; text-align: left;
      background: linear-gradient(transparent, rgba(0,0,0,.72)); opacity: 0; transform: translateY(14px); transition: opacity .6s ease .25s, transform .6s ease .25s; }
    .slide.active figcaption { opacity: 1; transform: none; }
    figcaption strong { font-size: clamp(1.1rem, 2.4vw, 1.6rem); }
    figcaption span { opacity: .9; max-width: 60ch; }
    .arrow { all: unset; cursor: pointer; position: absolute; top: 50%; z-index: 20; width: 2.8rem; height: 2.8rem; margin-top: -1.4rem; display: grid; place-items: center; font-size: 1.8rem; line-height: 1; color: #fff; border-radius: 50%; background: rgba(0,0,0,.45); backdrop-filter: blur(6px); transition: background .2s, transform .2s; }
    .arrow:hover { background: var(--accent, var(--c-accent)); transform: scale(1.1); }
    .arrow:focus-visible { outline: 2px solid #fff; }
    .prev { left: 0; }
    .next { right: 0; }
    .dots { display: flex; justify-content: center; gap: .5rem; margin-top: 1.25rem; }
    .dots button { all: unset; cursor: pointer; width: .6rem; height: .6rem; border-radius: 999px; background: var(--c-line); transition: width .35s, background .35s; }
    .dots button.on { width: 1.8rem; background: var(--accent, var(--c-accent)); }
    .dots button:focus-visible { outline: 2px solid var(--accent, var(--c-accent)); outline-offset: 2px; }
    @media (max-width: 640px) { .stage { aspect-ratio: 4 / 3; } .slide { left: 8%; width: 84%; } }
    @media (prefers-reduced-motion: reduce) { .slide, .slide img, figcaption { transition-duration: .01ms; } }
  `,
})
export class CarouselBlock extends BlockBase {
  readonly active = signal(0);
  readonly paused = signal(false);
  private startX: number | null = null;

  constructor() {
    super();
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (this.text('autoplay') === 'false') return;
      const ms = this.num('interval', 5, 2, 30) * 1000;
      const timer = setInterval(() => {
        if (!this.paused() && !document.hidden && this.slides().length > 1) this.go(this.active() + 1);
      }, ms);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  slides() {
    return this.items().filter((i) => isSafeUrl(i['url']));
  }

  go(i: number) {
    const n = this.slides().length;
    if (n) this.active.set(((i % n) + n) % n);
  }

  down(e: PointerEvent) {
    this.startX = e.clientX;
  }

  up(e: PointerEvent) {
    if (this.startX === null) return;
    const dx = e.clientX - this.startX;
    this.startX = null;
    if (Math.abs(dx) > 45) this.go(this.active() + (dx < 0 ? 1 : -1));
  }

  slideStyle(i: number): Record<string, string> {
    const n = this.slides().length;
    let d = (((i - this.active()) % n) + n) % n;
    if (d > n / 2) d -= n;
    const abs = Math.abs(d);
    const visible = abs <= 1;
    return {
      transform: `translateX(${d * 56}%) scale(${Math.max(0.6, 1 - abs * 0.2)})`,
      opacity: abs === 0 ? '1' : visible ? '0.45' : '0',
      filter: abs === 0 ? 'none' : 'saturate(.7) blur(1.5px)',
      zIndex: String(10 - abs),
      pointerEvents: visible ? 'auto' : 'none',
    };
  }
}

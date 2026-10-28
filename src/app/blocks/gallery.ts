import { Component, signal } from '@angular/core';
import { BlockBase, isSafeUrl } from './block-style';
import { Reveal } from './reveal';

@Component({
  selector: 'block-gallery',
  imports: [Reveal],
  host: { '(document:keydown)': 'onKey($event)' },
  template: `
    <section class="wrap">
      @if (text('title')) {
        <h2 reveal>{{ text('title') }}</h2>
      }
      <div class="grid" [style.--cols]="columns()">
        @for (img of images(); track $index) {
          <figure [reveal]="($index % 6) * 70">
            <button type="button" (click)="show($index)" [attr.aria-label]="'Open ' + (img['caption'] || img['alt'] || 'image')">
              <img [src]="img['url']" [alt]="img['alt'] ?? ''" loading="lazy" decoding="async" />
              @if (img['caption']) {
                <figcaption>{{ img['caption'] }}</figcaption>
              }
            </button>
          </figure>
        }
      </div>
    </section>

    @if (current(); as c) {
      <div class="lightbox" role="dialog" aria-modal="true" (click)="close()">
        <button class="x" type="button" aria-label="Close" (click)="close()">✕</button>
        @if (images().length > 1) {
          <button class="nav prev" type="button" aria-label="Previous" (click)="step(-1); $event.stopPropagation()">‹</button>
          <button class="nav next" type="button" aria-label="Next" (click)="step(1); $event.stopPropagation()">›</button>
        }
        <figure (click)="$event.stopPropagation()">
          <img [src]="c['url']" [alt]="c['alt'] ?? ''" />
          @if (c['caption']) {
            <figcaption>{{ c['caption'] }}</figcaption>
          }
        </figure>
      </div>
    }
  `,
  styles: `
    :host { display: block; background: var(--bg, transparent); color: var(--fg, var(--c-fg)); }
    .wrap { max-width: var(--max, 1120px); margin: 0 auto; padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 2)) var(--pad-x, var(--site-pad))); }
    h2 { font-size: clamp(1.6rem, 3.2vw, 2.3rem); letter-spacing: -.01em; margin: 0 0 1.5rem; text-align: var(--align, left); }
    .grid { --cols: 3; display: grid; gap: var(--gap, 1rem); grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 560px) { .grid { grid-template-columns: repeat(min(var(--cols), 3), 1fr); } }
    @media (min-width: 900px) { .grid { grid-template-columns: repeat(var(--cols), 1fr); } }
    @media (max-width: 400px) { .grid { grid-template-columns: 1fr; } }
    figure { margin: 0; }
    figure button { all: unset; box-sizing: border-box; display: block; position: relative; width: 100%; cursor: zoom-in; overflow: hidden; border-radius: var(--img-radius, var(--radius, calc(var(--site-radius) * 1.5))); aspect-ratio: 4 / 3; background: var(--c-surface); box-shadow: 0 14px 34px -22px rgba(0,0,0,.5); }
    figure button:focus-visible { outline: 2px solid var(--accent, var(--c-accent)); outline-offset: 3px; }
    figure img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s cubic-bezier(.2,.7,.2,1); }
    figure button:hover img { transform: scale(1.08); }
    figure figcaption { position: absolute; inset: auto 0 0; padding: 2rem 1rem .85rem; color: #fff; font-size: .9rem; background: linear-gradient(transparent, rgba(0,0,0,.7)); transform: translateY(100%); transition: transform .35s ease; }
    figure button:hover figcaption, figure button:focus-visible figcaption { transform: none; }
    @media (hover: none) { figure figcaption { transform: none; } }
    .lightbox { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; background: rgba(0,0,0,.88); animation: fade .25s ease both; padding: 3rem 1rem; }
    .lightbox figure { max-width: min(1100px, 100%); max-height: 100%; text-align: center; color: #fff; }
    .lightbox img { max-width: 100%; max-height: 80vh; border-radius: var(--site-radius); box-shadow: 0 30px 80px rgba(0,0,0,.6); animation: pop .35s cubic-bezier(.2,.7,.2,1) both; }
    .lightbox figcaption { margin-top: .9rem; }
    .lightbox button { all: unset; cursor: pointer; position: absolute; color: #fff; font-size: 2rem; line-height: 1; width: 3rem; height: 3rem; display: grid; place-items: center; border-radius: 50%; background: rgba(255,255,255,.12); transition: background .2s; }
    .lightbox button:hover { background: rgba(255,255,255,.25); }
    .x { top: 1rem; right: 1rem; font-size: 1.2rem !important; }
    .prev { left: 1rem; top: 50%; }
    .next { right: 1rem; top: 50%; }
    @keyframes fade { from { opacity: 0; } }
    @keyframes pop { from { opacity: 0; transform: scale(.94); } }
  `,
})
export class GalleryBlock extends BlockBase {
  readonly index = signal<number | null>(null);

  images() {
    return this.items().filter((i) => isSafeUrl(i['url']));
  }
  columns() {
    return this.num('columns', 3, 1, 6);
  }
  current() {
    const i = this.index();
    return i === null ? null : (this.images()[i] ?? null);
  }
  show(i: number) {
    this.index.set(i);
  }
  close() {
    this.index.set(null);
  }
  step(d: number) {
    const n = this.images().length;
    this.index.update((i) => (i === null ? null : (i + d + n) % n));
  }
  onKey(e: KeyboardEvent) {
    if (this.index() === null) return;
    if (e.key === 'Escape') this.close();
    else if (e.key === 'ArrowRight') this.step(1);
    else if (e.key === 'ArrowLeft') this.step(-1);
  }
}

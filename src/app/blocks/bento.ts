import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlockBase, BlockItem, isExternal, isSafeUrl } from './block-style';
import { Reveal } from './reveal';

@Component({
  selector: 'block-bento',
  imports: [NgTemplateOutlet, RouterLink, Reveal],
  template: `
    <section class="wrap">
      @if (text('title')) {
        <h2 reveal>{{ text('title') }}</h2>
      }
      <div class="grid">
        @for (t of tiles(); track $index) {
          @if (link(t); as href) {
            @if (isExt(href)) {
              <a class="tile" [class]="cls(t)" [href]="href" [reveal]="($index % 8) * 70">
                <ng-container [ngTemplateOutlet]="body" [ngTemplateOutletContext]="{ $implicit: t, linked: true }" />
              </a>
            } @else {
              <a class="tile" [class]="cls(t)" [routerLink]="href" [reveal]="($index % 8) * 70">
                <ng-container [ngTemplateOutlet]="body" [ngTemplateOutletContext]="{ $implicit: t, linked: true }" />
              </a>
            }
          } @else {
            <div class="tile" [class]="cls(t)" [reveal]="($index % 8) * 70">
              <ng-container [ngTemplateOutlet]="body" [ngTemplateOutletContext]="{ $implicit: t, linked: false }" />
            </div>
          }
        }
      </div>
    </section>

    <ng-template #body let-t let-linked="linked">
      @if (img(t)) {
        <img [src]="img(t)" alt="" loading="lazy" decoding="async" />
      }
      <div class="txt">
        @if (t['title']) {
          <h3>{{ t['title'] }}</h3>
        }
        @if (t['text']) {
          <p>{{ t['text'] }}</p>
        }
      </div>
      @if (linked) {
        <span class="go" aria-hidden="true">↗</span>
      }
    </ng-template>
  `,
  styles: `
    :host { display: block; background: var(--bg, transparent); color: var(--fg, var(--c-fg)); }
    .wrap { max-width: var(--max, 1120px); margin: 0 auto; padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 2)) var(--pad-x, var(--site-pad))); }
    h2 { font-size: clamp(1.6rem, 3.2vw, 2.3rem); letter-spacing: -.01em; margin: 0 0 1.5rem; text-align: var(--align, left); }
    .grid { display: grid; gap: var(--gap, 1rem); grid-template-columns: 1fr; grid-auto-rows: minmax(170px, auto); grid-auto-flow: dense; }
    @media (min-width: 520px) {
      .grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 190px; }
      .wide, .large { grid-column: span 2; }
      .tall, .large { grid-row: span 2; }
    }
    @media (min-width: 900px) { .grid { grid-template-columns: repeat(4, 1fr); grid-auto-rows: 200px; } }
    .tile { position: relative; isolation: isolate; overflow: hidden; display: flex; align-items: flex-end; padding: calc(var(--site-pad) * .85); text-decoration: none; color: var(--fg, var(--c-fg));
      border-radius: var(--radius, calc(var(--site-radius) * 2)); border: 1px solid var(--border, var(--c-line));
      background: linear-gradient(145deg, var(--c-surface), color-mix(in srgb, var(--c-accent) 10%, var(--c-surface)));
      transition: transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s; }
    .tile:hover { transform: translateY(-5px); box-shadow: 0 24px 44px -24px rgba(0,0,0,.45); }
    .tile.has-img { color: #fff; border-color: transparent; }
    .tile img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.2,.7,.2,1); }
    .tile.has-img::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(transparent 25%, rgba(0,0,0,.78)); }
    .tile:hover img { transform: scale(1.08); }
    .txt { display: flex; flex-direction: column; gap: .3rem; max-width: 42ch; }
    h3 { margin: 0; font-size: 1.15rem; line-height: 1.25; }
    .large h3 { font-size: clamp(1.4rem, 2.6vw, 2rem); }
    p { margin: 0; font-size: .95rem; opacity: .82; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; white-space: pre-line; }
    .go { position: absolute; top: .9rem; right: .9rem; width: 2.2rem; height: 2.2rem; display: grid; place-items: center; border-radius: 50%; background: var(--accent, var(--c-accent)); color: var(--accent-fg, var(--c-accent-fg)); transform: scale(.6) rotate(-45deg); opacity: 0; transition: transform .35s, opacity .35s; }
    .tile:hover .go, .tile:focus-visible .go { transform: none; opacity: 1; }
  `,
})
export class BentoBlock extends BlockBase {
  tiles() {
    return this.items().filter((t) => t['title'] || t['text'] || t['imageUrl']);
  }
  img(t: BlockItem) {
    return isSafeUrl(t['imageUrl']) ? t['imageUrl'] : '';
  }
  link(t: BlockItem) {
    return isSafeUrl(t['url']) ? t['url'] : '';
  }
  isExt = isExternal;
  cls(t: BlockItem) {
    const size = ['wide', 'tall', 'large'].includes(t['size']) ? t['size'] : 'small';
    return `tile ${size}${this.img(t) ? ' has-img' : ''}`;
  }
}

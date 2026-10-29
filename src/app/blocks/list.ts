import { Component } from '@angular/core';
import { BlockBase, isSafeUrl } from './block-style';

/** Styled list. Vertical: image left, list right. Horizontal: cards in a row over an optional parallax image. */
@Component({
  selector: 'block-list',
  template: `
    @if (horizontal()) {
      <section class="h" [class.has-bg]="!!image()" [style.background-image]="image() ? 'url(' + image() + ')' : null">
        <div class="wrap">
          @if (text('title')) {
            <h2>{{ text('title') }}</h2>
          }
          <ul class="row" [attr.data-style]="listStyle()">
            @for (item of items(); track $index) {
              <li [style.--i]="$index">
                <span class="mark" aria-hidden="true">{{ $index + 1 }}</span>
                @if (item['title']) {
                  <strong>{{ item['title'] }}</strong>
                }
                @if (item['text']) {
                  <span class="t">{{ item['text'] }}</span>
                }
              </li>
            }
          </ul>
        </div>
      </section>
    } @else {
      <section class="v">
        <div class="wrap" [class.no-img]="!image()">
          @if (image()) {
            <figure><img [src]="image()" [alt]="text('alt')" loading="lazy" /></figure>
          }
          <div class="body">
            @if (text('title')) {
              <h2>{{ text('title') }}</h2>
            }
            <ul class="col" [attr.data-style]="listStyle()">
              @for (item of items(); track $index) {
                <li [style.--i]="$index">
                  <span class="mark" aria-hidden="true">{{ $index + 1 }}</span>
                  <span class="copy">
                    @if (item['title']) {
                      <strong>{{ item['title'] }}</strong>
                    }
                    @if (item['text']) {
                      <span class="t">{{ item['text'] }}</span>
                    }
                  </span>
                </li>
              }
            </ul>
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    :host { display: block; background: var(--bg, transparent); color: var(--fg, var(--c-fg)); }
    h2 { font-size: clamp(1.7rem, 3.5vw, 2.5rem); line-height: 1.15; letter-spacing: -.01em; margin: 0 0 1.5rem; text-wrap: balance; }
    ul { list-style: none; margin: 0; padding: 0; }
    li { position: relative; opacity: 0; transform: translateY(14px); animation: rise .6s cubic-bezier(.2,.8,.2,1) calc(var(--i) * 80ms) forwards; }
    strong { display: block; font-size: 1.1rem; margin-bottom: .2rem; }
    .t { color: var(--muted, var(--c-muted)); }

    .mark { flex: none; display: inline-grid; place-items: center; width: 2.1rem; height: 2.1rem; border-radius: 50%;
      background: color-mix(in srgb, var(--accent, var(--c-accent)) 16%, transparent); color: var(--accent, var(--c-accent)); font-weight: 700; font-size: .9rem; }
    [data-style='numbers'] .mark { font-size: .95rem; }
    [data-style='bullets'] .mark, [data-style='checks'] .mark, [data-style='arrows'] .mark { font-size: 0; }
    [data-style='bullets'] .mark::before { content: ''; width: .55rem; height: .55rem; border-radius: 50%; background: currentColor; }
    [data-style='checks'] .mark::before { content: '✓'; font-size: 1rem; }
    [data-style='arrows'] .mark::before { content: '→'; font-size: 1.1rem; }

    .v .wrap { max-width: var(--max, 1100px); margin: 0 auto; padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 2.5)) var(--pad-x, var(--site-pad)));
      display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: clamp(1.5rem, 5vw, 4rem); align-items: center; }
    .v .wrap.no-img { grid-template-columns: minmax(0, 1fr); max-width: var(--max, 760px); }
    figure { margin: 0; position: relative; }
    figure::before { content: ''; position: absolute; inset: 1rem -1rem -1rem 1rem; border-radius: var(--radius, var(--site-radius)); background: color-mix(in srgb, var(--accent, var(--c-accent)) 22%, transparent); z-index: 0; }
    figure img { position: relative; z-index: 1; display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: var(--radius, var(--site-radius)); box-shadow: 0 24px 50px -22px rgba(0,0,0,.45); }
    .col { display: grid; gap: .5rem; }
    .col li { display: flex; gap: 1rem; align-items: flex-start; padding: 1rem 1.15rem; border-radius: var(--radius, var(--site-radius)); background: var(--c-surface);
      border: 1px solid var(--c-line); transition: transform .25s, box-shadow .25s, border-color .25s; }
    .col li:hover { transform: translateX(6px); border-color: var(--accent, var(--c-accent)); box-shadow: 0 14px 30px -18px rgba(0,0,0,.45); }
    .copy { display: block; }

    .h { position: relative; isolation: isolate; background-size: cover; background-position: center; background-attachment: fixed; }
    .h.has-bg { color: #fff; }
    .h.has-bg::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.7)); z-index: -1; }
    .h .wrap { max-width: var(--max, 1200px); margin: 0 auto; padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 4)) var(--pad-x, var(--site-pad))); }
    .h h2 { text-align: center; }
    .row { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1.25rem; }
    .row li { display: flex; flex-flow: row wrap; align-items: center; gap: .7rem; padding: 1.5rem; border-radius: var(--radius, var(--site-radius)); background: var(--c-surface); color: var(--c-fg);
      border: 1px solid var(--c-line); transition: transform .3s, box-shadow .3s; }
    .row li strong { margin: 0; }
    .row li .t { flex-basis: 100%; }
    .h.has-bg .row li { background: rgba(255,255,255,.12); color: #fff; border-color: rgba(255,255,255,.28); backdrop-filter: blur(10px); }
    .h.has-bg .t { color: rgba(255,255,255,.82); }
    .h.has-bg .mark { background: rgba(255,255,255,.2); color: #fff; }
    .row li:hover { transform: translateY(-6px); box-shadow: 0 22px 40px -22px rgba(0,0,0,.6); }

    @keyframes rise { to { opacity: 1; transform: none; } }
    @media (max-width: 800px) {
      .v .wrap { grid-template-columns: minmax(0, 1fr); }
      .h { background-attachment: scroll; }
    }
    @media (prefers-reduced-motion: reduce) { li { animation: none; opacity: 1; transform: none; } .h { background-attachment: scroll; } }
  `,
})
export class ListBlock extends BlockBase {
  horizontal() {
    return this.text('orientation') === 'horizontal';
  }
  listStyle() {
    const s = this.text('listStyle');
    return ['bullets', 'numbers', 'checks', 'arrows'].includes(s) ? s : 'checks';
  }
  image() {
    const u = this.text('imageUrl');
    return isSafeUrl(u) && !/[()'"\s]/.test(u) ? u : '';
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlockBase, isExternal, isSafeUrl } from './block-style';
import { Reveal } from './reveal';

@Component({
  selector: 'block-image-text',
  imports: [RouterLink, Reveal],
  template: `
    <section class="row" [class.right]="right()" [class.no-img]="!image()">
      @if (image()) {
        <div class="media" reveal>
          <img [src]="image()" [alt]="text('alt')" loading="lazy" decoding="async" />
        </div>
      }
      <div class="copy" [reveal]="140">
        @if (text('eyebrow')) {
          <p class="eyebrow">{{ text('eyebrow') }}</p>
        }
        <h2>{{ text('heading', 'title', 'text') }}</h2>
        @if (text('body')) {
          <p class="body">{{ text('body') }}</p>
        }
        @if (text('buttonLabel') && url()) {
          @if (external()) {
            <a class="cta" [href]="url()">{{ text('buttonLabel') }} <span aria-hidden="true">→</span></a>
          } @else {
            <a class="cta" [routerLink]="url()">{{ text('buttonLabel') }} <span aria-hidden="true">→</span></a>
          }
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; background: var(--bg, transparent); color: var(--fg, var(--c-fg)); }
    .row { max-width: var(--max, 1120px); margin: 0 auto; padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 2.5)) var(--pad-x, var(--site-pad))); display: grid; gap: var(--gap, clamp(2rem, 5vw, 5rem)); align-items: center; }
    .media { position: relative; }
    .media::before { content: ''; position: absolute; inset: 7% -5% -7% 5%; z-index: 0; border-radius: var(--img-radius, calc(var(--site-radius) * 2.5)); background: linear-gradient(135deg, var(--accent, var(--c-accent)), var(--c-secondary)); opacity: .22; transform: rotate(-3deg); transition: transform .5s ease, opacity .5s; }
    .media:hover::before { transform: rotate(-6deg) scale(1.03); opacity: .35; }
    img { position: relative; z-index: 1; display: block; width: 100%; aspect-ratio: 5 / 4; object-fit: cover; border-radius: var(--img-radius, calc(var(--site-radius) * 2)); box-shadow: 0 28px 60px -28px rgba(0,0,0,.5); transition: transform .5s ease; }
    .media:hover img { transform: translateY(-6px); }
    .eyebrow { text-transform: uppercase; letter-spacing: .14em; font-size: .78rem; font-weight: 700; color: var(--accent, var(--c-accent)); margin: 0 0 .75rem; }
    h2 { font-size: clamp(1.8rem, 3.6vw, 2.8rem); line-height: 1.12; letter-spacing: -.015em; margin: 0 0 1.1rem; text-wrap: balance; }
    .body { margin: 0 0 1.75rem; font-size: 1.08rem; color: var(--muted, var(--c-muted)); white-space: pre-line; max-width: 60ch; }
    .cta { display: inline-flex; gap: .5rem; align-items: center; padding: .85rem 1.6rem; border-radius: var(--btn-radius, var(--site-radius)); background: var(--accent, var(--c-accent)); color: var(--accent-fg, var(--c-accent-fg)); text-decoration: none; font-weight: 600; transition: transform .2s, gap .2s; }
    .cta:hover { transform: translateY(-2px); gap: .85rem; }
    @media (min-width: 760px) {
      .row:not(.no-img) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .row.right .media { order: 2; }
      .row.right .media::before { inset: 7% 5% -7% -5%; transform: rotate(3deg); }
    }
    .no-img { max-width: var(--max, 760px); }
  `,
})
export class ImageTextBlock extends BlockBase {
  image() {
    const u = this.text('imageUrl', 'image', 'url');
    return isSafeUrl(u) ? u : '';
  }
  url() {
    const u = this.text('buttonUrl');
    return isSafeUrl(u) ? u : '';
  }
  external() {
    return isExternal(this.url());
  }
  right() {
    return /^(right|end)$/i.test(this.text('imagePosition'));
  }
}

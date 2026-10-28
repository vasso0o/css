import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlockBase, isExternal, isSafeUrl } from './block-style';

@Component({
  selector: 'block-full-hero',
  imports: [RouterLink],
  template: `
    <section class="full" [style.min-height]="minHeight()">
      @if (image()) {
        <img class="bg" [src]="image()" [alt]="text('alt')" />
      }
      <div class="shade" [style.opacity]="overlay()"></div>
      <div class="content">
        @if (text('eyebrow')) {
          <p class="eyebrow">{{ text('eyebrow') }}</p>
        }
        <h1>{{ text('title', 'heading', 'text') }}</h1>
        @if (text('subtitle', 'body')) {
          <p class="sub">{{ text('subtitle', 'body') }}</p>
        }
        @if (text('buttonLabel') && url()) {
          @if (external()) {
            <a class="cta" [href]="url()">{{ text('buttonLabel') }}</a>
          } @else {
            <a class="cta" [routerLink]="url()">{{ text('buttonLabel') }}</a>
          }
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .full { position: relative; isolation: isolate; overflow: hidden; display: flex; align-items: center; justify-content: center; color: #fff;
      background: linear-gradient(135deg, color-mix(in srgb, var(--accent, var(--c-accent)) 80%, #000), color-mix(in srgb, var(--c-secondary) 65%, #000)); }
    .bg { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; animation: kenburns 22s ease-out both; }
    .shade { position: absolute; inset: 0; z-index: -1; background: #000; }
    .content { width: 100%; max-width: var(--max, 920px); padding: calc(var(--site-pad) * 3) var(--site-pad); display: flex; flex-direction: column; align-items: center; text-align: center; }
    :host([data-align='left']) .content { align-items: flex-start; text-align: left; }
    :host([data-align='right']) .content { align-items: flex-end; text-align: right; }
    .content > * { animation: rise .9s cubic-bezier(.2,.7,.2,1) both; }
    .content > :nth-child(2) { animation-delay: .12s; }
    .content > :nth-child(3) { animation-delay: .24s; }
    .content > :nth-child(4) { animation-delay: .36s; }
    .eyebrow { text-transform: uppercase; letter-spacing: .16em; font-size: .8rem; font-weight: 700; margin: 0 0 1rem; opacity: .85; }
    h1 { font-size: clamp(2.3rem, 6vw, 4.6rem); line-height: 1.04; letter-spacing: -.025em; margin: 0 0 1.25rem; text-wrap: balance; text-shadow: 0 2px 30px rgba(0,0,0,.35); }
    .sub { font-size: clamp(1.05rem, 2vw, 1.3rem); max-width: 56ch; margin: 0 0 2rem; opacity: .92; text-wrap: pretty; white-space: pre-line; }
    .cta { display: inline-block; padding: .95rem 2rem; border-radius: var(--btn-radius, var(--site-radius)); background: var(--accent, var(--c-accent)); color: var(--accent-fg, var(--c-accent-fg)); text-decoration: none; font-weight: 600; box-shadow: 0 14px 34px -12px rgba(0,0,0,.6); transition: transform .2s, filter .2s; }
    .cta:hover { transform: translateY(-3px) scale(1.03); filter: brightness(1.08); }
    @keyframes kenburns { from { transform: scale(1.14); } to { transform: scale(1); } }
    @keyframes rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .bg, .content > * { animation: none; } }
  `,
})
export class FullHeroBlock extends BlockBase {
  image() {
    const u = this.text('imageUrl', 'image');
    return isSafeUrl(u) ? u : '';
  }
  url() {
    const u = this.text('buttonUrl');
    return isSafeUrl(u) ? u : '';
  }
  external() {
    return isExternal(this.url());
  }
  overlay() {
    return this.num('overlay', 40, 0, 100) / 100;
  }
  minHeight() {
    return `${this.num('height', 70, 20, 100)}vh`;
  }
}

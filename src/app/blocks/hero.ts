import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlockBase, isExternal, isSafeUrl } from './block-style';

@Component({
  selector: 'block-hero',
  imports: [RouterLink],
  template: `
    <section class="hero" [class.split]="image()" [class.flip]="flip()">
      <div class="copy">
        @if (text('eyebrow')) {
          <p class="eyebrow">{{ text('eyebrow') }}</p>
        }
        <h1>{{ text('title', 'text', 'heading') }}</h1>
        @if (text('subtitle', 'body', 'description')) {
          <p class="sub">{{ text('subtitle', 'body', 'description') }}</p>
        }
        @if (text('buttonLabel', 'ctaLabel')) {
          @if (external()) {
            <a class="cta" [href]="url()">{{ text('buttonLabel', 'ctaLabel') }}</a>
          } @else {
            <a class="cta" [routerLink]="url() || '/'">{{ text('buttonLabel', 'ctaLabel') }}</a>
          }
        }
      </div>
      @if (image()) {
        <div class="media">
          <img [src]="image()" [alt]="text('imageAlt', 'alt')" />
        </div>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      background: var(--bg, linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 14%, var(--c-bg)) 0%, color-mix(in srgb, var(--c-secondary) 14%, var(--c-bg)) 100%));
      color: var(--fg, var(--c-fg));
      text-align: var(--align, center);
    }
    .hero {
      max-width: var(--max, 1120px);
      margin: 0 auto;
      padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 3)) var(--pad-x, var(--site-pad)));
      display: grid;
      gap: var(--gap, clamp(1.5rem, 4vw, 4rem));
    }
    .copy { display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .hero.split { grid-template-columns: 1fr; }
    .hero.split .copy { align-items: flex-start; text-align: left; }
    .media { position: relative; }
    .media img {
      display: block;
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: var(--img-radius, var(--radius, calc(var(--site-radius) * 2)));
      box-shadow: 0 30px 60px -28px rgba(0, 0, 0, .45);
    }
    @media (min-width: 720px) {
      .hero.split { grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: center; }
      .hero.split.flip .media { order: -1; }
    }
    :host([data-align='right']) .hero.split .copy { align-items: flex-end; text-align: right; }
    :host([data-align='center']) .hero.split .copy { align-items: center; text-align: center; }
    .eyebrow { text-transform: uppercase; letter-spacing: .14em; font-size: .78rem; font-weight: 700; color: var(--accent, var(--c-accent)); margin: 0 0 1rem; }
    h1 { font-size: clamp(2rem, 4.6vw, 3.6rem); line-height: 1.08; letter-spacing: -.02em; margin: 0 0 1.25rem; text-wrap: balance; }
    .sub { font-size: 1.15rem; color: var(--muted, var(--c-muted)); margin: 0 0 2rem; max-width: 56ch; text-wrap: pretty; white-space: pre-line; }
    .cta { display: inline-block; padding: .9rem 1.8rem; border-radius: var(--btn-radius, var(--site-radius)); background: var(--accent, var(--c-accent)); color: var(--accent-fg, var(--c-accent-fg)); text-decoration: none; font-weight: 600; box-shadow: 0 8px 24px -10px var(--accent, var(--c-accent)); transition: transform .15s; }
    .cta:hover { transform: translateY(-2px); }
  `,
})
export class HeroBlock extends BlockBase {
  url() {
    const u = this.text('buttonUrl', 'ctaUrl');
    return isSafeUrl(u) ? u : '';
  }
  external() {
    return isExternal(this.url());
  }
  image() {
    const u = this.text('imageUrl', 'image');
    return isSafeUrl(u) ? u : '';
  }
  flip() {
    return /^(left|start)$/i.test(this.text('imagePosition', 'imageSide', 'imageAlign', 'layout'));
  }
}

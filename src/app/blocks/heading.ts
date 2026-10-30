import { Component } from '@angular/core';
import { BlockBase, isSafeUrl, schemaColor } from './block-style';

@Component({
  selector: 'block-heading',
  template: `
    <div class="bg" [class.has-bg]="!!image()" [style.background-image]="image() ? 'url(' + image() + ')' : null" [style.--ov]="overlay()">
    <section class="wrap" [class.side]="side()" [class.split]="split()">
      @if (text('eyebrow')) {
        <p class="eyebrow" [style.font-size.px]="size('eyebrowSize')" [style.color]="schemaColor(text('eyebrowColor'))">{{ text('eyebrow') }}</p>
      }
      <div class="main">
        <h2 [style.font-size.px]="size('headingSize')" [style.color]="schemaColor(text('headingColor'))">{{ text('text', 'title', 'heading') }}</h2>
        @if (text('body', 'subtitle')) {
          <p class="body" [style.font-size.px]="size('bodySize')" [style.color]="schemaColor(text('bodyColor'))">{{ text('body', 'subtitle') }}</p>
        }
      </div>
    </section>
    </div>
  `,
  styles: `
    .bg { position: relative; isolation: isolate; border-radius: inherit; }
    .bg.has-bg { background-size: cover; background-position: center; background-attachment: fixed; color: #fff; overflow: hidden; }
    .bg.has-bg::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,var(--ov, .4)); z-index: -1; }
    .has-bg .body { color: rgba(255,255,255,.85); }
    :host { display: block; background: var(--bg, transparent); color: var(--fg, var(--c-fg)); text-align: var(--align, left); border-radius: var(--radius, var(--site-radius)); }
    .wrap { max-width: var(--max, 960px); margin: 0 auto; padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 2.5)) var(--pad-x, var(--site-pad))); }
    .wrap.side { display: grid; grid-template-columns: minmax(140px, 1fr) minmax(0, 3fr); gap: clamp(1rem, 4vw, 3rem); align-items: start; }
    .wrap.split { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); grid-template-areas: 'eyebrow body' 'head body'; column-gap: clamp(1.5rem, 6vw, 5rem); align-items: end; }
    .split .main { display: contents; }
    .split .eyebrow { grid-area: eyebrow; align-self: start; }
    .split h2 { grid-area: head; margin: 0; }
    .split .body { grid-area: body; max-width: none; }
    @media (max-width: 800px) { .wrap.split { grid-template-columns: minmax(0, 1fr); grid-template-areas: 'eyebrow' 'head' 'body'; row-gap: 1rem; } }
    .eyebrow { text-transform: uppercase; letter-spacing: .14em; font-size: .75rem; font-weight: 700; color: var(--accent, var(--c-accent)); margin: 0 0 .5rem; }
    .side .eyebrow { margin: .6rem 0 0; }
    h2 { font-size: clamp(1.7rem, 3.5vw, 2.5rem); line-height: 1.15; letter-spacing: -.01em; margin: 0 0 1rem; text-wrap: balance; }
    .body { font-size: 1.1rem; color: var(--muted, var(--c-muted)); margin: 0; white-space: pre-line; max-width: 70ch; }
    :host([data-align='center']) .body { margin-inline: auto; }
    :host([data-align='right']) .body { margin-left: auto; }
    @media (max-width: 700px) { .bg.has-bg { background-attachment: scroll; } }
    @media (prefers-reduced-motion: reduce) { .bg.has-bg { background-attachment: scroll; } }
    @media (max-width: 700px) { .wrap.side { grid-template-columns: minmax(0, 1fr); gap: 0; } .side .eyebrow { margin: 0 0 .5rem; } }
  `,
})
export class HeadingBlock extends BlockBase {
  protected readonly schemaColor = schemaColor;

  image() {
    const u = this.text('bgImage');
    return isSafeUrl(u) && !/[()'"\s]/.test(u) ? u : '';
  }

  overlay() {
    return String(this.num('bgOverlay', 40, 0, 100) / 100);
  }

  split() {
    return this.text('layout') === 'split';
  }

  side() {
    return !this.split() && this.text('eyebrow') !== '' && this.text('eyebrowPosition') === 'left';
  }

  /** Pixel size from the CMS, or null to keep the stylesheet default. */
  size(key: string) {
    const raw = this.data()[key];
    return raw?.trim() ? this.num(key, 0, 1, 1000) : null;
  }
}

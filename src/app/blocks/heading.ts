import { Component } from '@angular/core';
import { BlockBase } from './block-style';

@Component({
  selector: 'block-heading',
  template: `
    <section class="wrap">
      @if (text('eyebrow')) {
        <p class="eyebrow">{{ text('eyebrow') }}</p>
      }
      <h2>{{ text('text', 'title', 'heading') }}</h2>
      @if (text('body', 'subtitle')) {
        <p class="body">{{ text('body', 'subtitle') }}</p>
      }
    </section>
  `,
  styles: `
    :host { display: block; background: var(--bg, transparent); color: var(--fg, var(--c-fg)); text-align: var(--align, left); border-radius: var(--radius, var(--site-radius)); }
    .wrap { max-width: var(--max, 960px); margin: 0 auto; padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 2.5)) var(--pad-x, var(--site-pad))); }
    .eyebrow { text-transform: uppercase; letter-spacing: .14em; font-size: .75rem; font-weight: 700; color: var(--accent, var(--c-accent)); margin: 0 0 .5rem; }
    h2 { font-size: clamp(1.7rem, 3.5vw, 2.5rem); line-height: 1.15; letter-spacing: -.01em; margin: 0 0 1rem; text-wrap: balance; }
    .body { font-size: 1.1rem; color: var(--muted, var(--c-muted)); margin: 0; white-space: pre-line; max-width: 70ch; }
    :host([data-align='center']) .body { margin-inline: auto; }
    :host([data-align='right']) .body { margin-left: auto; }
  `,
})
export class HeadingBlock extends BlockBase {}

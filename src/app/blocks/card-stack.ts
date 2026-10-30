import { Component } from '@angular/core';
import { BlockBase } from './block-style';

/** Cards in a wrapping flex row; each card has a title, text and optional comma-separated tags. */
@Component({
  selector: 'block-card-stack',
  template: `
    <section class="wrap">
      @if (text('title')) {
        <h2>{{ text('title') }}</h2>
      }
      <div class="cards">
        @for (item of items(); track $index) {
          <article class="card">
            @if (item['title']) {
              <h3>{{ item['title'] }}</h3>
            }
            @if (item['text']) {
              <p>{{ item['text'] }}</p>
            }
            @if (tags(item['tags']).length) {
              <ul class="tags">
                @for (tag of tags(item['tags']); track $index) {
                  <li>{{ tag }}</li>
                }
              </ul>
            }
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; background: var(--bg, transparent); color: var(--fg, var(--c-fg)); }
    .wrap { max-width: var(--max, 1100px); margin: 0 auto; padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 2.5)) var(--pad-x, var(--site-pad))); }
    h2 { font-size: clamp(1.7rem, 3.5vw, 2.5rem); line-height: 1.15; letter-spacing: -.01em; margin: 0 0 1.75rem; text-wrap: balance; }
    .cards { display: flex; flex-wrap: wrap; gap: var(--gap, 1.5rem); }
    .card { flex: 1 1 260px; min-width: 0; display: flex; flex-direction: column; gap: .9rem; padding: clamp(1.4rem, 3vw, 1.9rem);
      border-radius: calc(var(--radius, var(--site-radius)) * 2); background: var(--c-surface); border: 1px solid var(--c-line);
      transition: transform .25s, box-shadow .25s, border-color .25s; }
    .card:hover { transform: translateY(-4px); border-color: var(--accent, var(--c-accent)); box-shadow: 0 22px 40px -24px rgba(0,0,0,.5); }
    h3 { margin: 0; font-size: 1.2rem; line-height: 1.25; }
    p { margin: 0; color: var(--muted, var(--c-muted)); line-height: 1.6; white-space: pre-line; }
    .tags { list-style: none; margin: auto 0 0; padding: .35rem 0 0; display: flex; flex-wrap: wrap; gap: .5rem; }
    .tags li { padding: .3rem .75rem; font-size: .85rem; border-radius: calc(var(--radius, var(--site-radius)) * .8); border: 1px solid var(--c-line);
      background: color-mix(in srgb, var(--c-fg) 4%, transparent); }
  `,
})
export class CardStackBlock extends BlockBase {
  tags(raw?: string): string[] {
    return (raw ?? '').split(',').map((t) => t.trim()).filter(Boolean);
  }
}

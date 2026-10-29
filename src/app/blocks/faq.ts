import { Component, signal } from '@angular/core';
import { BlockBase } from './block-style';
import { Reveal } from './reveal';

/** Accordion. Supports the multi-question form (`title` + `items`) and the legacy single `question`/`answer`. */
@Component({
  selector: 'block-faq',
  imports: [Reveal],
  template: `
    <section class="wrap" reveal>
      @if (text('title')) {
        <h2>{{ text('title') }}</h2>
      }
      @for (q of entries(); track $index){
        <div class="item" [class.open]="open() === $index">
          <h3>
            <button type="button" [attr.aria-expanded]="open() === $index" (click)="toggle($index)">
              <span>{{ q.question }}</span>
              <i aria-hidden="true"></i>
            </button>
          </h3>
          <div class="panel">
            <div><p>{{ q.answer }}</p></div>
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    :host { display: block; }
    .wrap { max-width: var(--max, 820px); margin: 0 auto; padding: var(--pad-y, calc(var(--site-pad) * 1.5)) var(--pad-x, var(--site-pad)); text-align: var(--align, left); }
    h2 { font-size: clamp(1.6rem, 3.2vw, 2.3rem); letter-spacing: -.01em; margin: 0 0 1.5rem; text-wrap: balance; }
    h3 { margin: 0; font-size: 1rem; }
    .item { background: var(--bg, var(--c-surface)); color: var(--fg, var(--c-fg)); border: 1px solid var(--border, var(--c-line)); border-radius: var(--radius, var(--site-radius)); margin-bottom: .75rem; overflow: hidden; transition: box-shadow .25s, border-color .25s; }
    .item.open { border-color: var(--accent, var(--c-accent)); box-shadow: 0 12px 30px -18px var(--accent, var(--c-accent)); }
    button { all: unset; box-sizing: border-box; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: calc(var(--site-pad) * .7) var(--site-pad); font-weight: 600; font-size: 1.05rem; }
    button:focus-visible { outline: 2px solid var(--accent, var(--c-accent)); outline-offset: -2px; }
    i { position: relative; flex: none; width: 1.1rem; height: 1.1rem; }
    i::before, i::after { content: ''; position: absolute; inset: 50% 0 auto; height: 2px; margin-top: -1px; background: var(--accent, var(--c-accent)); border-radius: 2px; transition: transform .3s; }
    i::after { transform: rotate(90deg); }
    .open i::after { transform: rotate(0); }
    .panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s ease; }
    .open .panel { grid-template-rows: 1fr; }
    .panel > div { overflow: hidden; }
    p { margin: 0; padding: 0 var(--site-pad) calc(var(--site-pad) * .8); color: var(--muted, var(--c-muted)); white-space: pre-line; }
  `,
})
export class FaqBlock extends BlockBase {
  readonly open = signal(0);

  entries() {
    const list = this.items().filter((i) => i['question'] || i['answer']);
    if (list.length) return list.map((i) => ({ question: i['question'] ?? '', answer: i['answer'] ?? '' }));
    const q = this.text('question');
    return q || this.text('answer') ? [{ question: q, answer: this.text('answer') }] : [];
  }

  toggle(i: number) {
    this.open.update((cur) => (cur === i ? -1 : i));
  }
}

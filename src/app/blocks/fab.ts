import { Component, inject } from '@angular/core';
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlockBase, isExternal, isSafeUrl } from './block-style';

/** Floating action button pinned to a corner of the screen. */
@Component({
  selector: 'block-fab',
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    @if (text('label') || text('icon')) {
      @if (!url()) {
        <button type="button" class="fab" [class.left]="left()" (click)="top()" [attr.aria-label]="text('label') || 'Back to top'">
          <ng-container [ngTemplateOutlet]="inner" />
        </button>
      } @else if (external()) {
        <a class="fab" [class.left]="left()" [href]="url()" [attr.aria-label]="text('label')">
          <ng-container [ngTemplateOutlet]="inner" />
        </a>
      } @else {
        <a class="fab" [class.left]="left()" [routerLink]="url()" [attr.aria-label]="text('label')">
          <ng-container [ngTemplateOutlet]="inner" />
        </a>
      }
    }
    <ng-template #inner>
      @if (text('icon')) {
        <span class="ic" aria-hidden="true">{{ text('icon') }}</span>
      }
      @if (text('label')) {
        <span class="lb">{{ text('label') }}</span>
      }
    </ng-template>
  `,
  styles: `
    :host { display: contents; }
    .fab { all: unset; box-sizing: border-box; cursor: pointer; position: fixed; z-index: 50; right: max(1rem, env(safe-area-inset-right)); bottom: max(1rem, env(safe-area-inset-bottom));
      display: inline-flex; align-items: center; gap: .6rem; padding: .85rem 1.3rem; border-radius: var(--btn-radius, 999px);
      background: var(--accent, var(--c-accent)); color: var(--accent-fg, var(--c-accent-fg)); font: 600 1rem/1 system-ui, sans-serif;
      box-shadow: 0 16px 36px -10px rgba(0,0,0,.5); animation: pop .7s cubic-bezier(.2,.9,.3,1.3) .4s both; transition: transform .25s, box-shadow .25s; }
    .fab.left { right: auto; left: max(1rem, env(safe-area-inset-left)); }
    .fab::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: var(--accent, var(--c-accent)); z-index: -1; animation: pulse 2.6s ease-out infinite; }
    .fab:hover { transform: translateY(-4px) scale(1.04); box-shadow: 0 22px 44px -12px rgba(0,0,0,.55); }
    .fab:focus-visible { outline: 3px solid var(--c-fg); outline-offset: 3px; }
    .ic { font-size: 1.25rem; line-height: 1; }
    @keyframes pop { from { opacity: 0; transform: translateY(24px) scale(.6); } }
    @keyframes pulse { from { opacity: .5; transform: scale(1); } to { opacity: 0; transform: scale(1.5, 1.9); } }
    @media (max-width: 520px) { .fab { padding: .95rem; } .lb { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); } }
    @media (prefers-reduced-motion: reduce) { .fab, .fab::before { animation: none; } }
  `,
})
export class FabBlock extends BlockBase {
  private readonly doc = inject(DOCUMENT);

  url() {
    const u = this.text('url');
    return isSafeUrl(u) ? u : '';
  }
  external() {
    return isExternal(this.url());
  }
  left() {
    return /left/i.test(this.text('position'));
  }
  top() {
    this.doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

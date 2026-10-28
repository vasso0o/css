import { Component } from '@angular/core';
import { BlockBase, isSafeUrl } from './block-style';

@Component({
  selector: 'block-image',
  template: `
    @if (src()) {
      <figure>
        <img [src]="src()" [alt]="text('alt')" loading="lazy" decoding="async" />
        @if (text('caption')) {
          <figcaption>{{ text('caption') }}</figcaption>
        }
      </figure>
    }
  `,
  styles: `
    :host { display: block; background: var(--bg, transparent); text-align: var(--align, center); }
    figure { max-width: var(--max, 960px); margin: 0 auto; padding: var(--pad, var(--pad-y, var(--site-pad)) var(--pad-x, var(--site-pad))); }
    img { display: inline-block; max-width: 100%; height: auto; border-radius: var(--img-radius, var(--radius, calc(var(--site-radius) * 1.5))); box-shadow: 0 18px 48px -24px rgba(0,0,0,.35); }
    figcaption { margin-top: .75rem; font-size: .92rem; color: var(--muted, var(--c-muted)); }
  `,
})
export class ImageBlock extends BlockBase {
  src() {
    const u = this.text('url', 'imageUrl', 'src');
    return isSafeUrl(u) ? u : '';
  }
}

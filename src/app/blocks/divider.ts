import { Component } from '@angular/core';
import { BlockBase } from './block-style';

// Color-schema tokens saved by the CMS (e.g. "--primary") mapped to the site's theme variables.
const SCHEMA: Record<string, string> = {
  '--primary': 'var(--c-accent)',
  '--secondary': 'var(--c-secondary)',
  '--background': 'var(--c-bg)',
  '--surface': 'var(--c-surface)',
  '--text': 'var(--c-fg)',
};

/** Horizontal rule; `height` is in pixels and `color` is a schema token or a hex color. */
@Component({
  selector: 'block-divider',
  template: `<hr [style.height.px]="height()" [style.background]="color()" />`,
  styles: `
    :host { display: block; }
    hr { border: 0; margin: 0; width: 100%; }
  `,
})
export class DividerBlock extends BlockBase {
  height() {
    return this.num('height', 1, 1, 1000);
  }
  color() {
    const value = this.text('color');
    return SCHEMA[value] ?? (/^#[0-9a-f]{3,8}$/i.test(value) ? value : 'var(--c-line)');
  }
}

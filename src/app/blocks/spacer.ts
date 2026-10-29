import { Component } from '@angular/core';
import { BlockBase } from './block-style';

/** Empty vertical space; `height` is in pixels. */
@Component({
  selector: 'block-spacer',
  template: `<div [style.height.px]="height()" aria-hidden="true"></div>`,
  styles: `:host { display: block; }`,
})
export class SpacerBlock extends BlockBase {
  height() {
    return this.num('height', 40, 1, 1000);
  }
}

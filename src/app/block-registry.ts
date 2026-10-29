import { Type } from '@angular/core';
import { BlockType } from './models';
import { HeroBlock } from './blocks/hero';
import { HeadingBlock } from './blocks/heading';
import { ImageBlock } from './blocks/image';
import { ButtonBlock } from './blocks/button';
import { FaqBlock } from './blocks/faq';
import { GalleryBlock } from './blocks/gallery';
import { CarouselBlock } from './blocks/carousel';
import { FullHeroBlock } from './blocks/full-hero';
import { ImageTextBlock } from './blocks/image-text';
import { BentoBlock } from './blocks/bento';
import { FabBlock } from './blocks/fab';
import { SpacerBlock } from './blocks/spacer';
import { DividerBlock } from './blocks/divider';
import { ButtonGroupBlock } from './blocks/button-group';
import { ListBlock } from './blocks/list';

// Add a styled component here to support a new block type from the CMS schema.
export const BLOCK_REGISTRY: Record<BlockType, Type<unknown>> = {
  hero: HeroBlock,
  heading: HeadingBlock,
  image: ImageBlock,
  button: ButtonBlock,
  faq: FaqBlock,
  gallery: GalleryBlock,
  carousel: CarouselBlock,
  fullHero: FullHeroBlock,
  imageText: ImageTextBlock,
  bento: BentoBlock,
  fab: FabBlock,
  spacer: SpacerBlock,
  divider: DividerBlock,
  buttonGroup: ButtonGroupBlock,
  list: ListBlock,
};

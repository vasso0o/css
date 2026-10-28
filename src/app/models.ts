export type BlockType =
  | 'hero'
  | 'heading'
  | 'image'
  | 'button'
  | 'faq'
  | 'gallery'
  | 'carousel'
  | 'fullHero'
  | 'imageText'
  | 'bento'
  | 'fab';

export interface Block {
  id: string;
  type: BlockType | (string & {});
  data: Record<string, string>;
  items?: unknown;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}

export interface Branding {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl: string;
}

export interface MenuItem {
  label: string;
  url: string;
}

export interface Palette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
}

export interface Theme {
  defaultMode: 'light' | 'dark' | 'auto';
  light: Palette;
  dark: Palette;
  cornerRadius: number;
  padding: number;
}

export interface Site {
  branding: Branding | null;
  menus: { navigation: MenuItem[]; footer: MenuItem[] };
  theme: Theme | null;
}

export interface CmsContent {
  pages: Page[];
  site: Site;
}

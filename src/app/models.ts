export type BlockType =
  | 'heading'
  | 'image'
  | 'button'
  | 'faq'
  | 'gallery'
  | 'carousel'
  | 'fullHero'
  | 'imageText'
  | 'bento'
  | 'fab'
  | 'spacer'
  | 'divider'
  | 'buttonGroup'
  | 'list'
  | 'cardStack';

export interface Block {
  id: string;
  type: BlockType | (string & {});
  data: Record<string, string>;
  items?: unknown;
  order?: number;
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
  domain: string;
  logoSize?: number;
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
  headingFont?: string;
  bodyFont?: string;
  baseSize?: number;
  headingWeight?: number;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Footer {
  layout: 'columns' | 'centered';
  description: string;
  phone: string;
  address: string;
  social: SocialLink[];
  copyright: string;
  showLogo: boolean;
  showEmail: boolean;
  backToTop: boolean;
}

export interface Site {
  branding: Branding | null;
  menus: { navigation: MenuItem[]; footer: MenuItem[] };
  theme: Theme | null;
  footer?: Footer | null;
}

export interface CmsContent {
  pages: Page[];
  site: Site;
}

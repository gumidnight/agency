export type NavigationItem = {
  label: string;
  href: string;
};

export type VisionItem = {
  title: string;
  description: string;
};

export type JourneyMilestone = {
  year: string;
  title: string;
  description: string;
};

export type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
  imageZoom?: number;
};

export type Partner = {
  name: string;
  logo: string;
  href?: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteContent = {
  organization: {
    name: string;
    fullName: string;
    logo: string;
    tagline: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
    keywords: string[];
  };
  navigation: NavigationItem[];
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    image: string;
  };
  whoWeAre: {
    title: string;
    text: string;
    image: string;
  };
  vision: {
    title: string;
    image: string;
    items: VisionItem[];
  };
  journey: {
    title: string;
    image: string;
    milestones: JourneyMilestone[];
  };
  team: {
    title: string;
    members: TeamMember[];
  };
  partners: {
    title: string;
    items: Partner[];
  };
  footer: {
    contactTitle: string;
    socialTitle: string;
    email: string;
    phone: string;
    address: string;
    copyright: string;
    socials: SocialLink[];
  };
};

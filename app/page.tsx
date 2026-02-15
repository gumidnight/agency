import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Journey from '@/components/Journey';
import Partners from '@/components/Partners';
import Team from '@/components/Team';
import Vision from '@/components/Vision';
import WhoWeAre from '@/components/WhoWeAre';
import { siteContent } from '@/lib/site-content';

export default function Home() {
  const content = siteContent;

  return (
    <main className="overflow-x-hidden bg-federation-background text-white">
      <Header
        logo={content.organization.logo}
        orgName={content.organization.name}
        navigation={content.navigation}
      />

      <Hero
        badge={content.hero.badge}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        image={content.hero.image}
        ctaLabel={content.hero.ctaLabel}
        ctaHref={content.hero.ctaHref}
      />

      <WhoWeAre
        title={content.whoWeAre.title}
        text={content.whoWeAre.text}
        image={content.whoWeAre.image}
      />

      <Vision title={content.vision.title} items={content.vision.items} />

      <Journey
        title={content.journey.title}
        milestones={content.journey.milestones}
      />

      <Team title={content.team.title} members={content.team.members} />

      <Partners title={content.partners.title} items={content.partners.items} />

      <Footer
        logo={content.organization.logo}
        orgName={content.organization.name}
        fullName={content.organization.fullName}
        contactTitle={content.footer.contactTitle}
        socialTitle={content.footer.socialTitle}
        email={content.footer.email}
        phone={content.footer.phone}
        address={content.footer.address}
        copyright={content.footer.copyright}
        socials={content.footer.socials}
      />
    </main>
  );
}

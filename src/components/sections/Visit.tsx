import Button from '@/components/ui/Button';
import SectionHead from '@/components/ui/SectionHead';
import type { SiteSettings } from '@/lib/content';
import s from './Visit.module.scss';

/** Compact visit band: heading, then the four facts people look for, phone first. */
export default function Visit({ settings }: { settings: SiteSettings }) {
  return (
    <section id="visit" className={s.visit} aria-labelledby="visit-title">
      <div className={s.inner}>
        <div className={s.head}>
          <SectionHead index="07" kicker="Επίσκεψη" title="Ελάτε από κοντά" id="visit-title" tone="light" />
          <p className={s.lead}>Στο παλιό σινεμά των Καναλίων, ~25 χλμ. από τον Βόλο. Σχολεία, ομάδες και μεμονωμένοι επισκέπτες.</p>
        </div>
        <dl className={s.facts}>
          <div><dt>Τηλέφωνο</dt><dd><a className={s.phone} href={`tel:${settings.phone}`}>{settings.phoneDisplay}</a></dd></div>
          <div><dt>Ώρες</dt><dd>{settings.hours ?? 'Κατόπιν ραντεβού'}</dd></div>
          <div><dt>Διεύθυνση</dt><dd>{settings.address}</dd></div>
          <div><dt>Email</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd></div>
        </dl>
        <div className={s.actions}>
          <Button href="https://www.google.com/maps/dir/?api=1&destination=39.5009492,22.8852162" external variant="cream" arrow>Οδηγίες</Button>
          <Button href={settings.virtualTourUrl} external variant="ghost">Virtual Tour 360°</Button>
        </div>
      </div>
    </section>
  );
}

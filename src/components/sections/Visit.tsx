import Button from '@/components/ui/Button';
import type { SiteSettings } from '@/lib/content';
import s from './Visit.module.scss';

/** Visit block: phone first and large — what older visitors and teachers look for first. */
export default function Visit({ settings }: { settings: SiteSettings }) {
  return (
    <section id="visit" className={s.visit} aria-labelledby="visit-title">
      <div className={s.inner}>
        <div className={s.intro}>
          <span className={s.label}>Επίσκεψη · Κανάλια Μαγνησίας</span>
          <h2 id="visit-title" className={s.h}>Ελάτε<br /><em>από κοντά</em></h2>
          <p>Στο παλιό σινεμά, στο κέντρο του χωριού, ~25 χλμ. από τον Βόλο. Σχολεία, ομάδες και μεμονωμένοι επισκέπτες, με ραντεβού.</p>
        </div>
        <div className={s.info}>
          <a href={`tel:${settings.phone}`} className={s.phone}>{settings.phoneDisplay}</a>
          <dl className={s.grid}>
            <div><dt>Ώρες</dt><dd>{settings.hours ?? 'Κατόπιν ραντεβού'}</dd></div>
            <div><dt>Είσοδος</dt><dd>{settings.admission ?? 'Ενημερωθείτε τηλεφωνικά'}</dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd></div>
            <div><dt>Κινητό</dt><dd><a href={`tel:${settings.mobile}`}>{settings.mobileDisplay}</a></dd></div>
          </dl>
          <div className={s.actions}>
            <Button href="https://www.google.com/maps/dir/?api=1&destination=39.5009492,22.8852162" external variant="cream" arrow>Οδηγίες</Button>
            <Button href={settings.virtualTourUrl} external variant="ghost">Virtual Tour 360°</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

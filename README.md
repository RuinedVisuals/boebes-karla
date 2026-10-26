# Μουσείο Λιμναίου Πολιτισμού Κάρλας — website

Νέο site του [boebes-karla.gr](https://boebes-karla.gr): Next.js 15 (App Router) · TypeScript · SCSS modules · GSAP + ScrollTrigger · Lenis · raw WebGL · Sanity. Deploy στο Vercel.

Σχεδιαστική ιδέα: το site είναι στημένο σαν κατάλογος έκθεσης. Κάθε ενότητα έχει αριθμό καταλόγου και ήσυχο τίτλο, και τον τόνο τον δίνουν η ταινία, οι εικόνες και το WebGL.

## Ξεκίνημα

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Χωρίς ρυθμίσεις, το site τρέχει με τα τοπικά δεδομένα του `src/lib/content.ts`. Για Sanity, αντιγράψτε το `.env.example` σε `.env.local` και συμπληρώστε το `NEXT_PUBLIC_SANITY_PROJECT_ID`.

## Δομή

```
src/
  app/
    layout.tsx            γραμματοσειρές (self-hosted, ελληνικά + λατινικά), metadata
    page.tsx              η αρχική: συνθέτει τις ενότητες
    globals.scss          reset, CSS variables, a11y (μέγεθος γραμμάτων, αντίθεση, χωρίς κίνηση)
    api/revalidate/       webhook του Sanity → ανανέωση περιεχομένου
  styles/                 _tokens.scss · _mixins.scss · _wave.scss (το κύμα των μεταβάσεων)
  components/
    providers/Experience  Lenis + GSAP ticker, page transitions, μενού, ρυθμίσεις προσβασιμότητας
    layout/               Nav · Menu (WebGL) · Cover (κουρτίνα μετάβασης) · Cursor · Footer
    sections/             Hero · Manifesto · Karavi · Hall · Halls · Events · Cinema · Archive · Visit
    ui/                   SectionHead · Button · Icon · SplitChars · Lightbox · VideoModal
  webgl/                  gl.ts (μικρό toolkit) · heroVideo.ts · hall.ts (κοίλη αίθουσα) · menuStage.ts
  lib/                    content.ts (τύποι + τοπικά δεδομένα) · nav.ts · gsap.ts · useDragInertia.ts · sanity/
studio/                   Sanity Studio (ξεχωριστό package): schemas για όλο το περιεχόμενο
public/images/            προσωρινές εικόνες από τα posters της έκθεσης
public/videos/museum.mp4  η ταινία του hero (βουβή, 2,1 MB)
```

Κάθε component έχει δικό του `*.module.scss`, που φορτώνει τα `tokens` και τα `mixins` (`@use 'tokens' as *;`).

## Ενότητες αρχικής

Κάθε ενότητα ανοίγει με το ίδιο ήσυχο `SectionHead`: αριθμό καταλόγου, γραμμή, ετικέτα και τίτλο σε serif με πεζά. Τα μεγέθη τα κρατούν οι εικόνες και το βίντεο, όχι οι τίτλοι.

| # | Ενότητα | Τι κάνει | Τεχνική |
|---|---|---|---|
| — | Hero | Η ταινία του μουσείου σε σκοτεινό grade, με ρευστή κίνηση, κυματάκι γύρω από τον κέρσορα και κόκκο φιλμ. Με το scroll «αποσύρεται» σε πλαίσιο | WebGL (`webgl/heroVideo.ts`), ScrollTrigger. Χωρίς βίντεο πέφτει στην εικόνα |
| 00 | Το μουσείο | Δύο στήλες: τίτλος αριστερά, η πρόταση δεξιά. Οι λέξεις φωτίζονται και οι εικόνες ανοίγουν σε πλάτος. Από κάτω τέσσερα νούμερα | ScrollTrigger scrub |
| 01 | Το Καράβι | Καρφωμένη εικόνα αριστερά, τρία κεφάλαια από τα κείμενα της έκθεσης δεξιά, εικόνες που αποκαλύπτονται με wipe, η ημερίδα | ScrollTrigger + CSS clip-path |
| 02 | Η αίθουσα | Κοίλη αίθουσα εκθεμάτων, μεγάλη | WebGL |
| 03 | Αίθουσες | Στήλη πληροφοριών και 3D coverflow. Η ενότητα παίρνει τον τόνο της ενεργής αίθουσας | `useDragInertia` |
| 04 | Δράσεις | Λίστα με φίλτρα, πεζά για να διαβάζεται, εικόνα που ακολουθεί τον κέρσορα | `gsap.quickTo` |
| 05 | Βίντεο | Καρφωμένη οριζόντια διαδρομή | ScrollTrigger pin |
| 06 | Αρχείο | Φωτεινός πίνακας και lightbox | GSAP ticker |
| 07 | Επίσκεψη | Συμπαγής ζώνη με τηλέφωνο, ώρες, διεύθυνση, email | — |

Header με scrollspy (μια τελεία κάτω από την ενότητα όπου βρίσκεται ο επισκέπτης). Μενού σε πλήρη οθόνη με κύμα στο άνοιγμα και στο κλείσιμο, και κάτω πληροφορίες επίσκεψης και σχολείων.

### Βίντεο hero

Βάλτε την ταινία του μουσείου στο `public/videos/museum.mp4` (από `boebes-karla.gr/wp-content/uploads/2022/06/museum.mp4`), ιδανικά H.264, 1920px, βουβή, ≤ 8 MB. Πρέπει να σερβίρεται από το ίδιο domain, γιατί το WebGL δεν μπορεί να διαβάσει βίντεο από άλλο domain χωρίς CORS. Από το Sanity: πεδίο «Βίντεο hero».

## Προσβασιμότητα

- `prefers-reduced-motion`: χωρίς Lenis, χωρίς WebGL κίνηση, χωρίς custom cursor, χωρίς μεταβάσεις. (Οι διακόπτες μεγέθους, αντίθεσης και κίνησης έχουν φύγει από το μενού. Ο κώδικας υποστήριξης μένει στο `Experience`, αν θελήσετε να τους ξαναβάλετε π.χ. σε μια σελίδα «Προσβασιμότητα».)
- Βίντεο hero με κουμπί παύσης.
- Κάθε overlay (μενού, lightbox, βίντεο) κλείνει με Esc και επιστρέφει το focus εκεί που ήταν. Skip link, `aria-live` στους μετρητές.
- Το custom cursor εμφανίζεται μόνο με ποντίκι (`pointer: fine`).
- Όταν δεν υπάρχει WebGL, η αίθουσα γίνεται λωρίδα εικόνων και το μενού δείχνει απλή εικόνα.

## Sanity

```bash
cd studio && npm install && SANITY_STUDIO_PROJECT_ID=xxxx npm run dev
```

Τύποι περιεχομένου: `siteSettings`, `homePage` (hero, βίντεο, μανιφέστο, εκθέματα, αίθουσες), `exhibit`, `hall`, `activity`, `mediaItem`, `archiveCategory`, `archivePhoto`. Ό,τι λείπει από το Sanity συμπληρώνεται από τα τοπικά δεδομένα, ώστε η σελίδα να μη μένει ποτέ άδεια.

Webhook: `POST https://<site>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`.

## Εκκρεμότητες περιεχομένου

- Πραγματικές φωτογραφίες στη θέση των αποσπασμάτων από τα posters, λεζάντες για τις 14 φωτογραφίες του αρχείου. Καθαρή έκδοση της ταινίας του hero χωρίς τα υδατογραφήματα, αν υπάρχει.
- YouTube IDs για τα βίντεο ΜΜΕ.
- Ωράριο και τιμές εισόδου.
- Επιβεβαίωση των τηλεφώνων: τα `tel:` links του παλιού site δεν ταιριάζουν με τα νούμερα που εμφανίζονται.
- Εσωτερικές σελίδες (`/karavi`, `/draseis/[slug]`, `/archeio`, `/periigisi`) και αγγλική έκδοση.

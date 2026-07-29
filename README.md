# Between Sight & Shadow

A launch-ready static website for an educator combining prior vision-therapy experience, chronic-illness and hypermobility advocacy, holistic support, and accessible witchcraft.

## Preview locally

Open `index.html` directly in a browser, or run a local web server from this folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish

This folder can be uploaded to GitHub Pages, Netlify, Cloudflare Pages, or nearly any static web host. For GitHub Pages, place all files at the repository root and enable Pages in repository settings.

## Personalize before launch

Search the project for these terms:

- `[Name]`
- `[Name] is`
- `YOUR-FORM-ID`
- `Setup needed`
- `Before launch`
- `Personalize before launch`

Replace the About-page placeholders with her exact name, pronouns, training, years of experience, and only the health information she consents to disclose. Connect the contact form, add social accounts, and have the disclaimer reviewed before selling health-related services.

## Included

- Responsive multi-page design
- Accessible dark-academia palette
- Keyboard navigation and skip link
- Text-size control and high-contrast mode
- Reduced-motion support
- Home, About, Vision, Embodiment, Witchcraft, Resources, Journal, Contact, Disclaimer, Privacy, Sources, and 404 pages
- Researched launch copy and clear medical/spiritual boundaries
- No framework or build step required

## Important scope note

The site intentionally presents its creator as an educator and former vision therapist, not as an optometrist or provider of individualized vision therapy. Change that language only after confirming her current credentials, scope, licensing, insurance, and local legal requirements.

## The Body Ledger prototype

The following pages form the connected symptom-tracking and appointment-preparation prototype:

- `pages/body-ledger.html` — demo sign-in and account introduction
- `pages/body-ledger-dashboard.html` — dashboard and quick symptom log
- `pages/body-ledger-log.html` — detailed symptom entry
- `pages/body-ledger-patterns.html` — neutral browser-generated summaries
- `pages/body-ledger-appointments.html` — appointment records
- `pages/body-ledger-builder.html` — appointment packet generator and print/PDF view
- `pages/body-ledger-profile.html` — optional profile context and local deletion
- `assets/body-ledger.js` — local prototype logic

### Important prototype limitation

The current version uses browser `localStorage` so the workflow can be tested before a backend exists. Do not collect real private health information with this prototype. Local storage is not encrypted, does not provide user separation, and is not appropriate for a launched health-data service.

### Suggested Supabase tables

- `profiles`: `id`, `user_id`, preferred name, pronouns, optional health context, timestamps
- `symptom_entries`: `id`, `user_id`, date, time, symptom, severity, duration, activity, environment, body area, worse, helped, impact, notes, timestamps
- `appointments`: `id`, `user_id`, provider, specialty, date, time, reason, notes, timestamps
- `appointment_packets`: `id`, `user_id`, appointment_id, selected symptoms, date range, questions, editable summary, timestamps

Every user-owned table should include a non-null `user_id` linked to `auth.users(id)` and strict Row Level Security policies limiting select, insert, update, and delete to `auth.uid() = user_id`.

Before launch, add email verification, password reset, account export, permanent deletion, a clear privacy policy, a data-retention policy, and professional legal/privacy review. Avoid advertising pixels and unnecessary analytics inside authenticated Body Ledger pages.

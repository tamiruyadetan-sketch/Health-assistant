# PRD — Disease Info & AI Health Assistant Platform

## 1. Overview

A responsive (mobile + desktop) web platform where users browse disease
categories from a top navigation bar, hover/tap to reveal a dropdown of
specific diseases within that category, open a detail page for the disease
they select, and optionally chat with an AI assistant about that specific
disease. The entire experience is available in **English** and
**Afaan Oromoo**.

## 2. Goals

- Give users fast, structured, easy-to-understand health information.
- Organize at least 12 disease categories, each with multiple diseases.
- Let users get conversational, disease-specific answers from an AI assistant.
- Fully bilingual (EN / OM), switchable at any time.
- Fully responsive: works well on phones, tablets, and desktops.
- Fast top-level navigation (hover dropdown on desktop, tap dropdown on mobile).

## 3. Non-Goals (out of scope for v1)

- Diagnosing users or replacing a doctor.
- Prescribing medication or dosages.
- Storing sensitive personal health records (no EHR/EMR functionality).
- Video consultations / telemedicine.
- Payments (v1 is free/informational).

## 4. Target Users

- General public seeking simple, trustworthy explanations of common diseases.
- Afaan Oromoo speakers underserved by English-only health content.
- Students (e.g., nursing/medical/CS) wanting a reference + AI Q&A tool.

## 5. Core Features

### 5.1 Top Navigation Bar
- Sticky top bar visible on all pages.
- **12 disease categories**, each with a full, named disease list — final,
  confirmed taxonomy (see `prisma/seed-data.ts` for the machine-readable
  version):

  1. **Skin Diseases** (20) — Acne, Eczema, Psoriasis, Dermatitis, Rosacea,
     Urticaria (Hives), Vitiligo, Alopecia Areata, Impetigo, Cellulitis,
     Scabies, Ringworm, Warts, Herpes Simplex, Shingles (Herpes Zoster),
     Melasma, Skin Tags, Seborrheic Dermatitis, Contact Dermatitis, Skin Cancer
  2. **Blood Diseases** (15) — Iron-Deficiency Anemia, Vitamin B12
     Deficiency Anemia, Folate-Deficiency Anemia, Aplastic Anemia,
     Hemolytic Anemia, Sickle Cell Disease, Thalassemia, Hemophilia,
     Von Willebrand Disease, Leukemia, Lymphoma, Multiple Myeloma,
     Thrombocytopenia, Neutropenia, Polycythemia Vera
  3. **Heart & Cardiovascular Diseases** (15) — Hypertension, Coronary
     Artery Disease, Heart Failure, Heart Attack (MI), Arrhythmia, Atrial
     Fibrillation, Cardiomyopathy, Congenital Heart Disease, Heart Valve
     Disease, Rheumatic Heart Disease, Peripheral Artery Disease, Aortic
     Aneurysm, DVT, Pulmonary Embolism, Endocarditis
  4. **Respiratory Diseases** (15) — Asthma, Pneumonia, Tuberculosis, COPD,
     Chronic Bronchitis, Emphysema, Influenza, Common Cold, Bronchitis,
     Sinusitis, Allergic Rhinitis, Sleep Apnea, Pulmonary Fibrosis,
     Pleurisy, Lung Cancer
  5. **Neurological Diseases** (15) — Migraine, Epilepsy, Stroke,
     Parkinson's, Alzheimer's, Multiple Sclerosis, Meningitis, Encephalitis,
     Peripheral Neuropathy, Bell's Palsy, Huntington's Disease, ALS, Brain
     Tumors, Trigeminal Neuralgia, Dementia
  6. **Digestive System Diseases** (19) — GERD, Gastritis, Peptic Ulcer
     Disease, IBS, IBD, Crohn's Disease, Ulcerative Colitis, Celiac Disease,
     Constipation, Diarrhea, Appendicitis, Gallstones, Cholecystitis,
     Pancreatitis, Hepatitis, Cirrhosis, Fatty Liver Disease,
     Gastroenteritis, Colorectal Cancer
  7. **Musculoskeletal Diseases** (16) — Osteoarthritis, Rheumatoid
     Arthritis, Gout, Osteoporosis, Osteomyelitis, Fibromyalgia,
     Tendinitis, Bursitis, Carpal Tunnel Syndrome, Low Back Pain,
     Scoliosis, Ankylosing Spondylitis, Muscular Dystrophy, Lupus-related
     Joint Disease, Bone Fractures, Sports-related Injuries
  8. **Infectious Diseases** (20) — Malaria, HIV/AIDS, Tuberculosis,
     Cholera, Typhoid Fever, Dengue Fever, Measles, Mumps, Rubella,
     Chickenpox, COVID-19, Influenza, Hepatitis B, Hepatitis C, Meningitis,
     Rabies, Tetanus, Polio, STIs, Schistosomiasis
  9. **Endocrine & Metabolic Diseases** (17) — Type 1 Diabetes, Type 2
     Diabetes, Gestational Diabetes, Prediabetes, Hyperthyroidism,
     Hypothyroidism, Goiter, Graves' Disease, Hashimoto's Thyroiditis,
     Cushing's Syndrome, Addison's Disease, PCOS, Metabolic Syndrome,
     Hyperlipidemia, Vitamin D Deficiency, Hyperparathyroidism, Obesity
  10. **Kidney & Urinary Diseases** (15) — UTI, Kidney Stones, CKD, AKI,
      Kidney Infection (Pyelonephritis), Glomerulonephritis, Nephrotic
      Syndrome, Polycystic Kidney Disease, Kidney Failure, Urinary
      Incontinence, Overactive Bladder, Cystitis, BPH, Prostatitis,
      Kidney Cancer
  11. **Eye Diseases** (18) — Cataract, Glaucoma, Conjunctivitis, Dry Eye
      Disease, Diabetic Retinopathy, AMD, Retinal Detachment, Keratitis,
      Uveitis, Blepharitis, Strabismus, Amblyopia, Color Blindness,
      Refractive Errors, Myopia, Hyperopia, Astigmatism, Eye Infections
  12. **Ear, Nose & Throat Diseases** (17) — Otitis Media, Otitis Externa,
      Hearing Loss, Tinnitus, Ménière's Disease, Sinusitis, Allergic
      Rhinitis, Nasal Polyps, Deviated Septum, Tonsillitis, Pharyngitis,
      Laryngitis, Sleep Apnea, Epistaxis (Nosebleed), Vertigo, Throat
      Infections, Head & Neck Cancers

  Raw total across categories: 210. **6 diseases legitimately belong to
  two categories** (Tuberculosis and Influenza: Respiratory + Infectious;
  Meningitis: Neurological + Infectious; Sinusitis, Allergic Rhinitis,
  Sleep Apnea: Respiratory + ENT). Deduplicated, that's **196 unique
  diseases**. This is why the data model uses a many-to-many
  disease↔category relationship rather than one category per disease
  (see `04-DATABASE.md`) — a disease like Tuberculosis must appear in
  both the Respiratory and Infectious dropdowns without being two
  separate database rows.
- Hovering (desktop) or tapping (mobile) a category opens a dropdown
  listing every disease under it. A disease in two categories simply
  appears in both dropdowns and resolves to the same page.
- Selecting a disease navigates to `/disease/:slug`.

### 5.2 Top-Right Utility Bar
Three controls, always visible:
1. **Brightness** — toggle light/dark theme (persisted in localStorage).
2. **About** — opens an About page/modal (mission, disclaimer, contact).
3. **Choose Language** — switches EN ⇄ Afaan Oromoo, persisted, affects
   all static text + database-sourced content + AI responses.

### 5.3 Home Page
- Hero section briefly explaining the platform.
- Category grid/cards mirroring the nav dropdowns (for mobile-friendly
  browsing without needing to hover).
- Search bar to jump directly to a disease by name.

### 5.4 Disease Detail Page (`/disease/:slug`)
Structured, plain-language sections, in this order:
1. **What is it?** — short definition.
2. **What causes this disease?** — underlying cause(s) / risk factors.
3. **How does a person become affected?** — transmission / how it's
   acquired (infection route, genetic, lifestyle-driven, etc. — framed
   appropriately per disease; e.g. "inherited" for Thalassemia vs.
   "airborne droplets" for Tuberculosis vs. "chronic high blood pressure
   over time" for Heart Failure).
4. **How can it be prevented?** — practical prevention/risk-reduction
   guidance; for non-preventable genetic/congenital conditions, this
   section instead covers early detection / management to reduce
   complications.
5. **Symptoms** — bullet list.
6. **Foods recommended** — bullet list.
7. **Foods to avoid** — bullet list.
8. **When to see a doctor** — short guidance + disclaimer.
9. **Ask the AI Assistant** — embedded chat widget scoped to this disease,
   able to answer follow-ups on any of the above (cause, transmission,
   prevention, symptoms, diet) in the user's chosen language.

This exact field set (`whatIsIt`, `causes`, `howAcquired`, `prevention`,
`symptoms`, `foodsRecommended`, `foodsToAvoid`) is what's modeled in the
database — see `04-DATABASE.md` — and what the AI system prompt is
grounded on, so the assistant's answers stay consistent with the page.

### 5.5 AI Assistant
- Chat widget on each disease page, pre-loaded with that disease's context.
- User types a question in EN or OM; assistant answers in the same language.
- Answers are general/educational, never diagnostic; always includes a
  short reminder to consult a professional for personal medical decisions.
- Backend proxies the request to the LLM API — API key never touches the
  frontend (see Security doc).

### 5.6 Bilingual Support
- All static UI strings and all database disease content have EN + OM
  versions.
- Language selection persists across sessions (localStorage + optional
  user profile if auth is added later).

## 6. User Stories

- As a visitor, I can hover "Blood Disease" in the nav and see a dropdown
  of blood diseases without clicking anything.
- As a visitor, I can tap a disease category on mobile and see the same
  dropdown as a touch-friendly menu.
- As a visitor, I can read a disease page and understand, in under two
  minutes, what it is, its symptoms, and what to eat/avoid.
- As a visitor, I can switch the whole site to Afaan Oromoo with one click.
- As a visitor, I can ask the AI assistant a follow-up question about the
  disease I'm currently reading about and get a same-language answer.
- As a visitor, I can toggle dark mode for comfortable night reading.

## 7. Success Metrics

- ≥ 12 categories, ≥ 60 diseases total published at launch.
- Page load (LCP) < 2.5s on 4G mobile.
- AI response time < 4s median.
- Both languages fully translated for all shipped content (0 missing keys).
- Mobile Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices).

## 8. Assumptions & Constraints

- Content (disease descriptions, symptoms, food lists) is authored/reviewed
  by the team or a credentialed source — the AI is a *supplement*, not the
  source of truth for static content.
- Afaan Oromoo translations must be produced by a fluent
  translator/reviewer; do not rely solely on machine translation for
  published static content.

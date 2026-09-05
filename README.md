# Medical Board Exam Interactive Reviewer
An interactive, responsive HTML/JS questionnaire application designed to review medical subjects for licensure examinations (such as the PLE).

## 📌 Disclaimer & Project Notes
* **Educational & Fun Project:** This repository is an informal, non-profit personal study project created outside of medical school for learning, practice, and review purposes.
* **No Copyright Infringement Intended:** All question banks, concepts, and clinical rationales are used strictly under fair use for personal study and peer review. All original copyrights belong to their respective authors and board review sources.
* **Future Outlook:** Beyond board exam preparation, this project serves as an initial sandbox for experimenting with web technologies, data structuring, and potential Health Information System (HIS) development in the future.

## Features
- **Multiple Review Modes:** 
  - 📝 **Exam Mode:** Answer questions without immediate rationales.
  - 🔍 **Review Mode:** Instantly reveal rationales after selecting an answer.
  - 🗝 **Answer Key Mode:** View all correct answers and rationales immediately.
- **Granular Filtering:** Filter by section (Obstetrics, Gynecology), question type (Clinical vs. Conceptual), or topic tags (Preeclampsia, Contraception, STI, etc.).
- **Summary & Scoring:** Interactive score card modal with instant grade calculations.
- **Tabular View:** Searchable summary table containing stems, answers, and rationales for fast revision.
- **Responsive UI:** Custom design system built with CSS variables, accessible on desktop and mobile.
- **Centralized theming:** Every page loads `style.css` and declares its palette with `data-course` and `data-theme` (`light` or `dark`). The shared `theme.js` controller provides the theme toggle and remembers the user's preference.

## Project Structure

```text
.
├── index.html                       # Main landing page and year-level navigation
├── style.css                        # Centralized responsive styles and course themes
├── theme.js                         # Shared light/dark theme controller
├── app.js                           # Shared UI behavior (filters and scoring)
├── README.md                        # Project overview and usage notes
├── _config.yml                      # Jekyll config for GitHub Pages
├── tools/
│   ├── Html2Word.html               # HTML-to-Word conversion utility
│   └── mht2html.html                # MHT to HTML conversion utility
├── subjects/
│   ├── yl1/
│   │   ├── anatomy/Anatomy.html
│   │   ├── biochemistry/harper.html
│   │   ├── family-community-health/FMC1.html
│   │   ├── histology/Histo.html
│   │   ├── physiology/Physio.html
│   │   └── research/Research.html
│   ├── yl2/
│   │   ├── microbiology/micro.html
│   │   ├── obgyn/obgyn.html
│   │   ├── obgyn/OBGYNE_DIGITAL_HistoryPE.html
│   │   ├── pathology/Pathotoya.html
│   │   ├── pediatrics/pedia.html
│   │   ├── pediatrics/pediasgdkael.html
│   │   └── pharmacology/pharma.html
│   ├── yl3/
│   │   └── internal-medicine/IM.html
│   └── yl4/
│       └── (reserved for future clerkship modules)
```

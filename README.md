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

## Project Structure

```text
.
├── index.html          # Main HTML layout and UI components
├── styles.css          # Core CSS variables and layout styles
├── app.js              # State management, filter logic, rendering engine
└── data/
    └── obgyn.js        # Question dataset (192 items)


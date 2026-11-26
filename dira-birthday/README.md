# Dira Birthday — one-page gift website

A mobile-first, single-page birthday website dedicated to Ishimwe Diane (Dira). Built with plain HTML, CSS and vanilla JavaScript for GitHub Pages.

## What's included

- One continuous responsive page (not multiple pages)
- Personalized birthday hero, letter, qualities, Bible passages, prayer, memories, wishes, surprise reveal and final dedication
- Five supplied photos optimized as WebP without changing the people or scenes
- Supplied portrait MP4 video with native play/pause controls
- Photo gallery with keyboard-accessible lightbox, previous/next controls and captions
- Scroll reveal animations, reading progress indicator, mobile navigation and interactive birthday details
- Supplied birthday song with a visitor-controlled play/pause button (no autoplay)
- GitHub Pages fallback that rebuilds the supplied song from 13 small text assets when the MP3 binary is unavailable
- Reduced-motion and keyboard-focus support

## Project structure

```text
Dira-Birthday/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── favicon.svg
    ├── images/
    │   ├── dira-portrait-01.webp
    │   ├── dira-portrait-02.webp
    │   ├── dira-portrait-03.webp
    │   ├── dira-portrait-04.webp
    │   └── dira-portrait-05.webp
    ├── videos/
    │   └── dira-memory-video.mp4
    └── audio/
        ├── happy-birthday-song.mp3
        └── README.txt
```

## Preview locally

Open `index.html` in a modern browser. For a more realistic local preview, run a small server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Birthday song

This project package includes the supplied song at:

```text
assets/audio/happy-birthday-song.mp3
```

The GitHub page uses the same path. Upload this MP3 into `dira-birthday/assets/audio/` in the repository to enable the music button there. Playback starts only after the visitor presses the button; there is no autoplay. Before publishing the audio in a public repository, make sure you have permission to share it publicly.

## Publish in the existing GitHub Pages repository

This project is designed to live in a dedicated subfolder of the existing `Kane-Hub-Dev/iragena.github.io` repository. Keep the existing root `index.html` and other website files untouched.

1. Upload the **contents of this Dira-Birthday folder** into a new folder named `dira-birthday/` in the repository.
2. Commit the files to the repository's `main` branch.
3. Keep the existing GitHub Pages source setting unchanged if it already publishes from `main` and the repository root.
4. Once GitHub Pages finishes publishing, the birthday page will be available at `https://kane-hub-dev.github.io/dira-birthday/`.

## Important privacy note

The GitHub repository is public. Anyone can visit the birthday page and download the photos and video. Publish only media and personal messages that you are comfortable sharing publicly, and make sure you have permission to publish them.

## Personalization notes

- The birthday is November 27. No age or birth year is assumed.
- The five photos and video supplied for this project are already linked locally.
- The English Bible quotations use the King James Version. The Kinyarwanda Colossians wording follows Bibiliya Yera; the Kinyarwanda Proverbs wording is explicitly labelled as a paraphrase, not an exact quotation.
- All sections are on the same `index.html` page; navigation scrolls to anchors within that page.
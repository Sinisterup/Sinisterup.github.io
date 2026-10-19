# sinisterup.github.io

Portfolio site for Tan Shang Ren — gameplay programmer (Unity, Unreal Engine, VR).
Live at https://sinisterup.github.io/

Plain static site: `index.html`, `style.css`, `main.js`, `favicon.svg` and `Images/`. No build step.

- Pages are hash routes (`#home`, `#projects`, `#skills`).
- Projects: three featured case studies, then a smaller archive grid. Unreal cards are in the HTML with `hidden` until their clips exist.
- Keys: `1`–`3` switch pages, `4` opens email, typing on the home page flips the hero monitor to its code tab,
  `Alt` ×3 / `Caps Lock` ×3 open the access popups, `Esc` closes them.
- Preview locally with any static server, e.g. `npx serve .`

# sleimanelhajj.me — v2

React + Vite portfolio with a glassmorphic, computer-engineering theme.

## Edit content
Everything (bio, skills, experience, projects, links) lives in `src/data.js`.
Replace `public/profile.jpg` and `public/ElHajj_Sleiman_CV.pdf` to update the photo and CV.

## Run locally
```
npm install
npm run dev
```

## Deploy to GitHub Pages
```
npm run deploy
```
This builds to `dist/` and pushes it to the `gh-pages` branch. In the repo's
Settings → Pages, set the source to the `gh-pages` branch. `public/CNAME`
keeps the custom domain `sleimanelhajj.me`.

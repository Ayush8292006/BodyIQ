# BodyIQ – Prototype

Smarter Fitness. Better Results.

## Kaise chalayein (How to run)

1. Zip extract karein.
2. `index.html` par double-click karein, ye browser mein khul jayega.
3. Phone jaisa dekhne ke liye browser window chhoti karein, ya Chrome DevTools mein mobile view (Ctrl+Shift+M) on karein.
4. Phone par chalane ke liye folder ko kisi bhi static hosting par daal dein (Netlify, Vercel, GitHub Pages).

Internet sirf Google Fonts ke liye chahiye. Iske bina bhi app chalega, bas system font dikhega.

## Kya kya hai

- **Onboarding:** naam, gender, age, height, weight, goal, level (beginner/intermediate/advanced), gym/home/both, days per week, diet preference.
- **Plan screen:** daily calories (Mifflin-St Jeor formula), BMI, protein, step goal aur training split, sab answers se calculate hote hain.
- **Home:** calorie ring, steps ring, aaj ka workout, water tracker, weekly streak, aur laptop par steps chart.
- **Workout:** Gym mode mein Hevy-style set logger (sets tick karo, set add karo, volume update hota hai). Home mode mein bodyweight programs.
- **Diet:** calories left, macros (protein/carbs/fat), aaj ke meals.
- **Progress:** weight trend, stats, personal records.
- **Profile:** saari details, "Edit body data" (onboarding dobara), "Reset app".

Phone width par app ka layout (bottom tabs) aata hai. 900px se badi screen par website ka layout (black sidebar) aata hai.
Data browser ke localStorage mein save hota hai, refresh karne par bhi rehta hai.

## Folder structure

```
BodyIQ/
├── index.html        Entry page
├── css/style.css     White / black / beige theme, mobile + laptop layouts
├── js/app.js         Saara logic: onboarding, tabs, calculations
├── design-source/    Claude design canvas ki original files (sirf canvas ke andar chalti hain)
└── README.md
```

## Dhyan rakhne wali baatein

- Ye ek **prototype** hai. Meals, steps, PRs jaisa data sample hai. Login, backend, real step tracking aur food database abhi nahi hai.
- Real Android/iOS app ke liye plan mein Flutter + Firebase recommend kiya gaya hai. Is prototype ka design aur flow wahan reference ki tarah use karein.

## Colours

| Role | Hex |
| --- | --- |
| Black | #111111 |
| Background (off-white) | #F7F3EC |
| Beige | #EFE7DB |
| Tan accent | #7A6247 |
| White cards | #FFFFFF |

Fonts: Archivo (headings), Inter (body).

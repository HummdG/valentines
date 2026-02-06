# Valentine's Day Proposal Website for Hafsa 💖

A cute, interactive Valentine's Day proposal website with a playful twist!

## 🌟 Features

- Interactive proposal page with a "Yes" and "No" button
- The "No" button playfully runs away from the cursor (it can never be clicked!)
- Beautiful date plan reveal after clicking "Yes"
- Romantic animations including floating hearts
- Fully responsive design for mobile and desktop
- No external dependencies - just vanilla HTML, CSS, and JavaScript

## 📅 The Date Plan

1. **2:00 PM** - Lunch at Novikov (dress glamorous!)
2. **4:00 PM** - Sushi Making Class (be flexible/comfortable)
3. **After** - Ice Cream time!

## 🚀 Deploying to GitHub Pages

### Option 1: Quick Deploy (Recommended)

1. **Create a new GitHub repository:**
   - Go to [GitHub](https://github.com/new)
   - Name it something like `valentines-proposal` (or any name you prefer)
   - Make it **Public**
   - Don't initialize with README (we already have one)

2. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Valentine's proposal website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/valentines-proposal.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your actual GitHub username)

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on **Settings** (top right)
   - Scroll down to **Pages** (in the left sidebar under "Code and automation")
   - Under **Source**, select **Deploy from a branch**
   - Under **Branch**, select `main` and `/root` folder
   - Click **Save**

4. **Access your website:**
   - After a few minutes, your site will be live at:
   - `https://YOUR_USERNAME.github.io/valentines-proposal/`
   - You can find this URL back in the Pages settings

### Option 2: Using GitHub Desktop

1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Open GitHub Desktop and sign in to your GitHub account
3. Click **File** → **Add Local Repository**
4. Select this folder
5. Click **Publish repository** in the top bar
6. Make sure **Keep this code private** is UNCHECKED (GitHub Pages requires public repos for free tier)
7. Click **Publish Repository**
8. Follow steps 3-4 from Option 1 above

## 🎨 Customization

Feel free to customize the website:

- **Colors:** Edit `styles.css` to change the color scheme
- **Date details:** Modify the plan cards in `index.html`
- **Fonts:** Change the Google Fonts links in `index.html`
- **Animations:** Adjust animation speeds and effects in `styles.css`

## 📱 Testing Locally

Simply open `index.html` in your web browser to test the website locally before deploying.

## 💝 Notes

- The website is fully responsive and works great on mobile devices
- The "No" button uses mouse tracking, so it will move away before it can be clicked
- All animations are CSS-based for smooth performance
- No backend or database needed - it's a static site!

## 🛠️ Troubleshooting

**Website not showing up after deploying?**
- Wait 5-10 minutes after enabling GitHub Pages
- Make sure your repository is public
- Check that you selected the correct branch (main) and folder (root)
- Clear your browser cache and try again

**No button not moving away?**
- Make sure JavaScript is enabled in your browser
- Try on a different browser (Chrome, Firefox, Safari all supported)

---

Made with ❤️ for the most special Valentine!


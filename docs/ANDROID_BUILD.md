# Android Automatic Build & CI/CD Setup

This repository is configured with **Capacitor** and **GitHub Actions** for automatic Android APK builds.

## 🚀 How Automatic Build Works

Every time code is pushed to the `main` or `master` branch (or via a Pull Request / manual trigger):

1. **GitHub Actions Workflow Triggered**: `.github/workflows/android-build.yml` starts automatically.
2. **Environment Setup**: Installs Node.js 22, Java JDK 17, and dependencies.
3. **Web Build & Sync**: Runs `npm run build` and `npx cap sync android` to sync web assets into the Android native project.
4. **Gradle Compilation**:
   - Compiles **Debug APK** (`app-debug.apk`)
   - Compiles **Release APK** (`app-release-unsigned.apk` or signed if keystore configured)
5. **Artifact Upload**: Generates downloadable `.apk` files directly under the GitHub Action Run **Artifacts** section!

---

## 📥 How to Download Built APKs

1. Go to your repository on **GitHub**.
2. Click on the **Actions** tab at the top.
3. Click on the latest workflow run named **"Build Android APK"**.
4. Scroll down to the **Artifacts** section at the bottom of the page.
5. Download **`GuideNer-Debug-APK`** (or `GuideNer-Release-APK`), unzip it, and install `app-debug.apk` directly on your Android phone or emulator.

---

## 🛠 Local Commands

If you want to build or test the Android project locally on your machine:

```bash
# Build web app & sync to native android folder
npm run cap:build

# Open Android Studio to run on an emulator or connected device
npx cap open android
```

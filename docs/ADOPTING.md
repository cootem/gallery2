# Adopting this fork (all of it, or just one piece)

Read the [limits](../README.md#limits-read-this-first) first. This is a snapshot of one working install, not a tested distribution. **Back up your files and database before you change anything.**

Pick the smallest piece that solves your problem.

```bash
git clone https://github.com/cootem/gallery2.git
cd gallery2
git log --oneline fc0db55..main    # the changes, as separate commits
```

## Relationship to upstream

- `main` here is built on upstream [gregstoll/gallery2](https://github.com/gregstoll/gallery2) commit **`fc0db55`** (2024-03-18), the code the reference site actually runs, **not** upstream's current `main`. For that reason GitHub's "Sync fork" will not fast-forward it.
- Since then upstream has added work of its own: ADOdb 5.22.11, PHP 8.4 and **8.5** fixes, an ffmpeg 7 fix, and two newer themes (`flowtheme_2026`, `timeline_2026`). **If you are starting fresh, consider starting from upstream `main` and taking only what you need from here** (the add-on modules and the Carbon mobile work are not in upstream).
- I checked how the three code commits apply on top of upstream `main` as of 2026-10: the module commit and the theme commit apply cleanly; the "stock modules" commit conflicts only in `modules/rss/classes/RssHelper.class`, where upstream fixed the same `file_exists` problem its own way. **Keep upstream's version of that hunk.** Applying them cleanly is the only thing I checked there. I did not run that combination.

## Option A: only the PHP fixes for stock modules

```bash
git remote add cootem https://github.com/cootem/gallery2.git
git fetch cootem
# in your own checkout of Gallery 2:
git cherry-pick <hash of "PHP 8.2-8.5 fixes in stock modules">
```

No git? Copy these files from this repo over yours (after diffing them against yours, because they are fixes to specific lines, not replacements you should adopt blindly):
`modules/core/classes/GalleryStorage.class`, `modules/core/classes/GalleryStorage/GalleryStorageExtras.class`, `modules/rss/classes/RssHelper.class`, `modules/rss/classes/RssMapHelper.class`, `modules/linkitem/classes/GalleryLinkItem.class`. The per-file explanation is in [PHP-COMPATIBILITY.md](PHP-COMPATIBILITY.md#what-was-changed).

## Option B: only the mobile-friendly Carbon theme

```bash
cp -r themes/carbon/local              /your/gallery/themes/carbon/
cp -r themes/carbon/templates          /your/gallery/themes/carbon/
cp    themes/carbon/theme.js           /your/gallery/themes/carbon/
cp -r modules/imageframe/frames/carbon /your/gallery/modules/imageframe/frames/
```

Then clear caches (below). This **overwrites** `theme.js` and the Carbon templates. If you have customised them, merge by hand using [MOBILE.md](MOBILE.md), which lists exactly what was added.

## Option C: one or more of the add-on modules

The modules `tags`, `tagtree`, `bulkmanage`, `bulkupload` and `imagine` are Gallery plugins that upstream does not ship.

1. Copy the directory into `modules/` (for tagtree, tags must also be present).
2. In Site Admin → Plugins, **Install** then **Activate** the module.
3. If you already have an older copy installed, check [PHP-COMPATIBILITY.md → database changes](PHP-COMPATIBILITY.md#database-changes-that-are-not-in-git).

Only these versions were exercised: tags 1.4, tagtree 1.1.0, bulkmanage 1.0.0, bulkupload 1.0.1, imagine 1.0.0.

## Option D: the whole tree

Follow upstream's guidance: back up files and data, then unzip or copy this tree over your existing install. Run the Gallery upgrader (`/upgrade/`) if it asks, then remove or move `install/` and `upgrade/` out of the web root again.

### Fresh install

1. Check out this repo (or download the zip) into your web root's `gallery/` directory.
2. Follow the upstream installer notes in `README.html`. Create the database and a data directory outside the web root, writable by the web user.
3. Install ImageMagick (and `jhead`), see below.
4. Activate the plugins listed in [INSTALL-PROFILE.md](INSTALL-PROFILE.md) that you want, and set `carbon` as the default theme.
5. **Move `install/` and `upgrade/` out of the web root** when done.

## Operational gotchas

These cost real time on the reference install.

| Symptom | Cause and fix |
|---|---|
| Every thumbnail/resize shows a placeholder, and `g_isBroken=1` in `g2_Derivative` | **ImageMagick is not installed** (or the path in Site Admin is wrong). Install it, then `UPDATE g2_Derivative SET g_isBroken=0 WHERE g_isBroken=1;` and empty `<g2data>/cache/derivative`. |
| Template/CSS edits do nothing | Gallery caches rendered pages in `g2_CacheMap`. Run `TRUNCATE TABLE g2_CacheMap;` (adjust the prefix). Compiled templates live in `<g2data>/smarty/templates_c/` and are safe to empty. |
| `theme.js` / CSS changes not seen | Browsers cache them. Bump the `?v=` on the `theme.js` URL in `templates/theme.tpl`, and hard-refresh once. |
| PHP edits do nothing | opcache. Reload php-fpm (or Apache) after editing PHP files. |
| `templates/local/theme.tpl` edit has no effect | The top-level `theme.tpl` is not overridden by `local/`. Edit `templates/theme.tpl`. |
| Pages hang for ages in one browser only | A dead third-party host (the `share` module, an old badge/CDN). Disable `share`; check the page source for external URLs. |
| Tag cloud has uniform text | See the database notes in PHP-COMPATIBILITY.md. |
| Stray deprecation output on pages | Turn `display_errors` off and keep errors in the log; leave `$gallery->setDebug(false)` in `config.php`. |

### Basic hardening for a legacy app

- Remove or move `install/`, `upgrade/`, any `login.txt`, SQL dumps and `config.php~` or other editor backups out of the web root.
- Block documentation and backup files in `.htaccess`, for example:

  ```apache
  <FilesMatch "\.(md|backup|bak|log|txt)$">
      Require all denied
  </FilesMatch>
  ```
  (The `Order allow,deny` form works only if `mod_access_compat` is enabled.)
- Restrict or remove `lib/support/` after use.
- Keep PHP-FPM, the OS and the database patched; Gallery 2 itself will not receive security fixes.

## Reporting problems and contributing

Open an issue with: PHP version, web server, database, theme, plugin list, and the exact error from the PHP log. If you find another PHP 8 incompatibility, a pull request with the fix and the PHP version you tested on is the most useful thing you can send. Please also consider sending generic fixes to [gregstoll/gallery2](https://github.com/gregstoll/gallery2), the upstream the community works from.

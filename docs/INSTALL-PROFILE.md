# Install profile: what this fork was built and run against

This is the exact configuration the changes were made for. If yours differs, treat everything as **untested**.

## Platform

| | |
|---|---|
| Gallery | 2.3.2, core module 1.3.0.2 |
| Upstream base | [gregstoll/gallery2](https://github.com/gregstoll/gallery2) commit `fc0db55` (2024-03-18) |
| OS | Ubuntu |
| Web server | Apache 2.4, event MPM |
| PHP | 8.5 via php-fpm (earlier round: 8.2.28 and 8.3.19) |
| Database | MariaDB 11.8, table prefix `g2_`, column prefix `g_` |
| Graphics | ImageMagick (**required**, see ADOPTING.md), jhead |
| Default theme | `carbon` |

## Active themes

| Theme | Version | Notes |
|---|---|---|
| carbon | 1.2.6 | Customised: responsive CSS, swipe, cosmetic overrides. See [MOBILE.md](MOBILE.md) |

Other themes shipped in the tree (ajaxian, classic, floatrix, hybrid, matrix, siriux, slider, tile) are installed but **not used and not tested**.

## Active plugins (modules)

**Stock (from upstream, unchanged unless listed in [PHP-COMPATIBILITY.md](PHP-COMPATIBILITY.md))**

albumselect 1.0.11, archiveupload 1.0.10, captcha 1.1.7, core 1.3.0.2, exif 1.2.6, ffmpeg 1.0.14, flashvideo 1.0.3, hidden 1.0.9, imageframe 1.0.7, imagemagick 1.1.6, itemadd 1.0.9, jpegtran 1.0.1, linkitem 1.1.7, mime 1.1.5, netpbm 1.1.5, picasa 1.0.10, publishxp 1.0.14, rating 1.0.13, rearrange 1.0.9, remote 1.0.18, reupload 1.0.7, rss 1.1.8, sitemap 1.0.6, slideshowapplet 1.0.13, thumbnail 1.0.14, watermark 1.1.8, zipcart 1.0.15

**Not in upstream, added by this fork**

| Module | Version | Purpose |
|---|---|---|
| tags | 1.4 | Tag management, tag cloud, tag virtual albums |
| tagtree | 1.1.0 | Jump to any album using a hierarchical tag view |
| bulkmanage | 1.0.0 | Bulk editing of items |
| bulkupload | 1.0.1 | Upload files from structured data files (see `modules/bulkupload/data/sample.txt`) |
| imagine | 1.0.0 | "Imagine for Android" client support |
| imageframe: `carbon` frame | n/a | Frame used by the Carbon theme |

## Installed but inactive (not covered)

`share` (disabled on purpose: dead third-party endpoints), `map` and `downloadlink` (not in this repo), `simplified` theme (not in this repo), and every other stock module that is not listed above as active.

## Local overrides

Gallery's `local/` override directories are used for theme customisation (`themes/carbon/templates/local/`, `themes/carbon/local/`). Nothing else in the tree is overridden.

## What is deliberately not in this repository

Configuration (`config.php`), the data directory, the database, and site-specific images/logos. Everything personal to the original site was left out so the repository can be public.

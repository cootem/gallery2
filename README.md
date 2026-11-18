# gallery2 (cootem fork): PHP 8.5, mobile-friendly Carbon theme

> **This is a fork of [gregstoll/gallery2](https://github.com/gregstoll/gallery2)**, itself a
> PHP 7/8 port of the dormant [Gallery 2](http://galleryproject.org/) project (version 2.3.2, core 1.3.0.2).
> This fork is a **snapshot of one real, running install**: the changes needed to keep that site alive on
> PHP 8.5, plus a mobile-friendly Carbon theme. It is published in case it saves someone else the same work.

**Read the [limits](#limits-read-this-first) before you use it.**

## What this fork adds on top of gregstoll/gallery2

| Area | What | Details |
|---|---|---|
| PHP compatibility | Fixes for PHP 8.2 → 8.5 in core storage, RSS, link items, and the add-on modules below (static helpers, PHP 4 constructors, `create_function()`, null bind parameters) | [docs/PHP-COMPATIBILITY.md](docs/PHP-COMPATIBILITY.md) |
| Mobile | Responsive layout for the **Carbon** theme (viewport tag, fluid photo, single-column phone layout, 2-up thumbnails), plus **swipe** and **← / → arrow-key** navigation between photos | [docs/MOBILE.md](docs/MOBILE.md) |
| Add-on modules | `tags`, `tagtree`, `bulkmanage`, `bulkupload`, `imagine`, and a `carbon` ImageFrame frame, with the PHP fixes already applied | [docs/INSTALL-PROFILE.md](docs/INSTALL-PROFILE.md) |
| Docs & tooling | How to adopt all or part of this, operational gotchas, a phone-emulation swipe test | [docs/ADOPTING.md](docs/ADOPTING.md), [tools/mobile-test](tools/mobile-test) |

## The install this was built for

- **Gallery:** 2.3.2 (core module 1.3.0.2), based on upstream commit `fc0db55` (2024-03-18)
- **Stack:** Ubuntu, Apache 2.4 (event MPM) + **PHP 8.5 (php-fpm)**, MariaDB 11.8, ImageMagick
- **Theme:** `carbon` only (the other bundled themes are untouched and untested)
- **Active plugins** (everything else shipped in the tree is installed but inactive):
  - stock: albumselect, archiveupload, captcha, core, exif, ffmpeg, flashvideo, hidden, imageframe, imagemagick, itemadd, jpegtran, linkitem, mime, netpbm, picasa, publishxp, rating, rearrange, remote, reupload, rss, sitemap, slideshowapplet, thumbnail, watermark, zipcart
  - **not in upstream, added by this fork:** tags 1.4, tagtree 1.1.0, bulkmanage 1.0.0, bulkupload 1.0.1, imagine 1.0.0
- **Deliberately disabled:** `share` (depends on defunct AddThis/Facebook CDN endpoints)

Full list with versions: [docs/INSTALL-PROFILE.md](docs/INSTALL-PROFILE.md).

## Limits (read this first)

This is **not** a maintained distribution, and it is **not** broadly tested.

- **One site, one configuration.** Every change was made to keep *one* install working: the theme, plugin set and PHP version listed above. Nothing else was exercised.
- **Testing was manual.** I browsed the site (albums, photo pages, tags, tag cloud, RSS, link items) in Firefox and Chrome and watched the PHP error log. All changed PHP files pass `php -l` on PHP 8.5. I did **not** run Gallery's own unit tests, and did not test other PHP versions beyond 8.2.28/8.3.19 (earlier round) and 8.5.4 (current), other databases (PostgreSQL, Oracle, SQLite), nginx, or other themes.
- **Only the plugins listed above are covered.** Other plugins may still contain PHP 4 constructors, non-static methods called statically, `create_function()`, and so on. Expect more latent PHP 8 breakage in rarely used views.
- **Mobile support is for Carbon only.** The other themes are unchanged. Mobile behaviour was checked with scripted Chrome phone emulation (Pixel 5 profile, `tools/mobile-test`) and in the author's own browsing, not across a device matrix.
- **Known issues remain**, listed in [docs/PHP-COMPATIBILITY.md](docs/PHP-COMPATIBILITY.md#known-issues), including deprecation notices in the log.
- **Not rebased on current upstream.** This branch is based on upstream `fc0db55` (March 2024), which is what the reference site runs. Upstream has since added its own PHP 8.4/8.5 fixes, ADOdb 5.22.11 and newer responsive themes, none of which are merged or tested here. If you are starting fresh, read [docs/ADOPTING.md](docs/ADOPTING.md#relationship-to-upstream) first.
- **Security:** Gallery 2 has had no official release for over a decade. Keep `install/`, `upgrade/` and `lib/support/` out of your web root once set up, block `*.md`/`*.txt`/backup files, and consider whether you should be exposing it at all. Migration to a maintained gallery is the long-term answer.
- **No warranty, no support promise.** Issues and PRs are welcome, but I can only confirm things on my own setup.

## Quick start

If you already run Gallery 2 on PHP 7/8 and just want one piece, see [docs/ADOPTING.md](docs/ADOPTING.md). It shows how to take only the PHP fixes, only the mobile theme, or the whole tree, with the commands to do so. The three code commits on `main` are separate on purpose, so you can `git cherry-pick` them one at a time.

For a **fresh install**, follow the upstream instructions in `README.html`, then set it up as described in [docs/ADOPTING.md](docs/ADOPTING.md#fresh-install).

## Credits and license

- **Gallery 2:** Bharat Mediratta and the Gallery Project.
- **PHP 7/8 port:** Greg Stoll and contributors, [gregstoll/gallery2](https://github.com/gregstoll/gallery2). This fork would not exist without it.
- **Add-on modules** (`tags`, `tagtree`, `bulkmanage`, `bulkupload`, `imagine`) are the work of their original authors, whose copyright headers are preserved in each file.
- **Changes in this fork:** [cootem](https://github.com/cootem), with help from Claude Code.
- **License:** GPL-2.0-or-later, same as Gallery 2. See `LICENSE`.

---

## Upstream README (gregstoll/gallery2)

This is a fork of the now-dormant [gallery2](http://galleryproject.org/) project. The gallery code was written against PHP 5, and there are some changes in PHP 7 and 8 that were causing problems for me (as well as a bunch of warnings).

Since [#26](https://github.com/gregstoll/gallery2/pull/26) the code supports PHP 8, although it's very possible I've missed some problems; please open an issue if you find anything!

This code is based on gallery2 version 2.3.2 (core version 1.3.0.2)

To upgrade from a stock Gallery2 installation:
- Backup the existing files and data
- Unzip the files from this repository on top of the existing install

FYI - Brad Dutton has revived Gallery 3 that is compatible with PHP 7. I haven't tried it, but you can download it at [galleryrevival.com](http://galleryrevival.com/).

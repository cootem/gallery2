# PHP compatibility work (PHP 8.2 → 8.5)

Gallery 2 was written for PHP 5. [gregstoll/gallery2](https://github.com/gregstoll/gallery2) ported it to PHP 7/8 for the stock code. This fork fixes what was still broken **on one real site** when it ran on PHP 8.2/8.3 (January 2026) and then PHP 8.5 (November 2026). Everything is in the git history as three commits; the sections below say what each fix is and why, so you can apply it by hand to your own tree if you prefer.

Nothing here was run against Gallery's unit tests. See [Limits](../README.md#limits-read-this-first).

## Fix patterns (use these to find your own breakage)

| PHP behaviour | Symptom | Fix used |
|---|---|---|
| PHP 4 style constructors (`function ModuleName()`) are no longer constructors (removed in PHP 8) | Module/theme silently misbehaves, e.g. "Missing object for 0" | Rename to `function __construct()` |
| Non-static method called statically is a fatal error (PHP 8) | `Non-static method X::y() cannot be called statically` | Declare the method `static` |
| `create_function()` removed (PHP 8) | Fatal error in tagtree | Replace with closures/named functions |
| Strict bind-parameter counting in ADOdb mysqli | `Input array has 1 params, does not match query` | Never pass `null` as the bind array; do not bind an empty `LIMIT` |
| Dynamic properties deprecated (8.2) | Deprecation notices in the log | Declare the property (see known issue 3 below) |
| Wrong-case method name | Fatal on case-sensitive call paths | Correct the name |

## What was changed

### Stock modules (commit "PHP 8.2-8.5 fixes in stock modules")

| File | Change |
|---|---|
| `modules/core/classes/GalleryStorage.class` | `search()`: if `$data === null` use `array()`. `_setConnectionSettings()`: the non-mysqli branch called the removed `mysql_get_server_info()`; now uses `mysqli_get_server_info($db->_connectionID)` |
| `modules/core/classes/GalleryStorage/GalleryStorageExtras.class` | `execute()`: same null-to-array guard |
| `modules/rss/classes/RssHelper.class`, `RssMapHelper.class` | `isset($limit)` is always true when `$limit` defaults to 0, so an empty `LIMIT` parameter was bound. Now `if ($limit > 0)`. RssHelper also calls `file_exists()` directly instead of the nonexistent static `GalleryPlatform::file_exists` |
| `modules/linkitem/classes/GalleryLinkItem.class` | Before the redirect: clear output buffers and send `Cache-Control: no-store`, `Pragma: no-cache`, and a past `Expires`. Fixes Firefox hanging ("waiting for site…") on link items after a cached redirect. Not strictly a PHP issue, found during the upgrade |
| `modules/core/ErrorPage.inc` | Added a property declaration (but see known issue 3) |

### Add-on modules (commit "Add third-party modules…")

These are **not** in upstream. They are included because the install uses them; the PHP fixes are already applied.

| Module | Fixes |
|---|---|
| `tags` 1.4 | All 15 `TagsHelper` methods made `static`; constructor renamed; `VirtualAlbum.inc` calls `createDynamicAlbum()` (was a wrong method name); `TagCloud.inc` calls `createTagCloudFromList()` (was `…Fromlist`); `getChildIds` made static; required Core/Module API raised to match Gallery 2.3.2 (see "Database changes" below) |
| `tagtree` 1.1.0 | Constructor renamed; helper classes (`TagTreeHelper`, `TagTreeCompatibilityHelper`, `HierarchyTagFilter`, `NodeExpansionCallback.inc`) made static; `create_function()` removed in three files |
| `bulkmanage`, `bulkupload`, `imagine` | PHP 4 constructors renamed to `__construct()` |
| `imageframe` | Adds only the `frames/carbon/` frame used by the Carbon theme |

### Database changes that are not in git

Two fixes were made in the database, not in code. If you install `tags` fresh, you do not need the first; if you are moving an existing install, check both.

1. **Tags API versions.** The `tags` module's stored `_requiredCoreApi` / `_requiredModuleApi` were raised to `7,54` / `3,9` to match the code. (Fresh installs get these from `module.inc`.)
2. **Tag cloud sizing.** If every tag renders at the same size, check `classNumber` and `tagCssClass` in `g2_PluginParameterMap` (`pluginId='tags'`). Ours had decayed to `classNumber=1`. The default is `classNumber=6` and `tagCssClass=0.8|#828282&&1.2|#121212&&1.5|#00659C&&2|#008200&&2.5|#FFCB21&&3|#FF0000`. Then regenerate the CSS (`TagsHelper::createCssFile(true)`).

### Plugins to disable

- **share**: loads scripts and images from AddThis and Facebook CDN hosts that no longer exist, so pages hang until the browser gives up. Disable it in Site Admin → Plugins (`UPDATE g2_PluginMap SET g_active=0 WHERE g_pluginId='share'`).

## Known issues

These remain on the reference install and are **not** fixed in this repository:

1. `ffmpeg`: the configured binary path can go stale; no video thumbnails until you reconfigure it.
2. `photo.tpl.php` (compiled template) logs "Trying to access array offset on null" warnings.
3. `ErrorPage.inc` now declares `private $error;`, but the class actually uses `$this->_error`, so the declaration does nothing. The correct line is `private $_error;`. I kept the deployed text as-is rather than change untested code.
4. ADOdb and `tags/module.inc:51` produce deprecation notices. They are harmless; keep `display_errors` off in production.
5. The optional `map` module has a syntax error (`module.inc`, around line 468) under PHP 8. It is not part of this repository.
6. Unlisted modules and themes may still have the problems described under "Fix patterns".

## Running with PHP-FPM / opcache

After editing Gallery PHP files, reload PHP-FPM (`systemctl reload php8.x-fpm`) so opcache serves the new code. After editing templates or CSS, also clear Gallery's page cache; see [ADOPTING.md](ADOPTING.md#operational-gotchas).

## Not included on purpose

Equivalent constructor fixes were made on the live site to the `downloadlink` and `map` modules and the `simplified` theme, which are inactive there. They are not published because they are untested and not part of the install profile.

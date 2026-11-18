# Mobile-friendly Carbon theme

Gallery 2's themes predate responsive design: no viewport tag, fixed-pixel layout tables, and a photo frame built from fixed-size edge images. On a phone you get a zoomed-out desktop page. This fork makes the **Carbon** theme usable on phones and scales photos on desktop windows too.

Only **Carbon** is changed. Other themes are untouched.

## What you get

- **Viewport meta tag**, so phones render at device width.
- **Fluid photo.** On the photo page the image scales to the window (`max-width: 100%`, `max-height: 100vh − 190px`). Aspect ratio is kept.
- **Single-column layout at ≤ 768 px.** Header, breadcrumb, album and photo layout tables, and navigator become stacked blocks.
- **Thumbnail grid: 2-up at ≤ 768 px, 1-up at ≤ 420 px.**
- **Photo-page side column** fixed at 320 px on wide screens.
- **Swipe left / right** on a photo page goes to the next / previous photo.
- **← / → arrow keys** do the same on desktop.
- 16 px form fields on small screens (stops iOS zooming in on focus).

The ImageFrame border (a table of fixed-pixel images) cannot shrink, so the **edge cells are hidden** by the responsive CSS at every screen size, including desktop. If you want the frame back, delete the `ImageFrame_carbon` rules in `responsive.css`.

## Files

| File | Role |
|---|---|
| `themes/carbon/local/responsive.css` | **New.** All responsive rules. Loaded after `local/theme.css` |
| `themes/carbon/templates/theme.tpl` | Adds the viewport tag and the `responsive.css` link; loads `theme.js?v=2` |
| `themes/carbon/templates/local/theme.tpl` | Same change (identical file) |
| `themes/carbon/templates/local/album.tpl` | Copy of `album.tpl`; adds class `gsAlbumLayout` to the two-column table |
| `themes/carbon/templates/local/photo.tpl` | Copy of `photo.tpl`; adds class `gsPhotoLayout` and the `core.PhotoSizes` block |
| `themes/carbon/theme.js` | Appended: arrow-key and swipe navigation |
| `themes/carbon/local/theme.css`, `templates/local/navigatorMicroThumbs.tpl` | Small cosmetic customisations (bigger select boxes, 70 px micro thumbnails) |
| `modules/imageframe/frames/carbon/` | The Carbon ImageFrame frame the CSS refers to |

### Why both `templates/theme.tpl` and `templates/local/theme.tpl`?

Gallery's `templates/local/` override only applies to templates pulled in with `{g->theme include=…}`. The top-level `theme.tpl` is **not** overridden, so the real edit has to be in `templates/theme.tpl`. The `local/` copy is kept identical so either path works.

## How swipe and keys work

`theme.js` finds the existing Previous/Next navigator links (`.buttonPrev a`, `.buttonNext a`) and follows them, so navigation honours the album's own sort order and permissions. It only runs on photo pages (the page contains `#gsImageView`).

Swipe is accepted when all of these hold: one finger, at least 50 px horizontal, horizontal distance at least 1.3× vertical, within 1 s, and the page is not pinch-zoomed (scale ≤ 1.05). It also reacts to `touchcancel`, because mobile Firefox can cancel a touch that has scrolled slightly. Modifier keys and text fields are ignored for the arrow keys.

Add `?swipedebug=1` to a photo URL to show touch events on screen.

## Testing it

`tools/mobile-test/swipe-test.mjs` drives Chrome with a Pixel 5 profile and real touch events:

```bash
cd tools/mobile-test
npm install            # puppeteer-core only; uses your installed Chrome
node swipe-test.mjs 'https://your.site/gallery/main.php?g2_itemId=123'
```

It prints the viewport scale, whether the page overflows horizontally, and whether a left and a right swipe navigate. The script expects Chrome at `/usr/bin/google-chrome`; edit `executablePath` if yours differs. It is a smoke test for this change, not a test suite.

## After you install it

1. Copy the files above into your tree.
2. Truncate Gallery's page cache table: `TRUNCATE TABLE g2_CacheMap;` (prefix may differ). Otherwise old rendered pages are served.
3. Empty compiled templates (`<g2data>/smarty/templates_c/`). Safe to delete.
4. Hard-refresh browsers once, because they cache `theme.js` and CSS. When you edit `theme.js`, bump the `?v=` number in both `theme.tpl` files.

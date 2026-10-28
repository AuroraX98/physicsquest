# PhysicsQuest

Learn physics through 794 guided lessons, worked examples, numerical practice, and interactive models—from foundations to quantum physics.

## Version 0.9.0

- 15 introductory courses, 794 lessons, 554 numerical practice parts, and 41 interactive model types.
- Original scientific diagrams, explicit prerequisites, and model limitations.
- Optional browser-local progress and JSON import/export; no application backend or analytics.
- Buildless HTML, CSS, and JavaScript with no third-party runtime dependencies.

This is a bounded introductory learning studio, not a complete university curriculum or qualification. Scientific models are educational approximations, not safety-engineering tools.

## Run

Serve `dist/` with any static HTTP server, for example:

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. The authored curriculum is in `dist/content/*.json`.

Use an HTTP server rather than opening `index.html` directly: JavaScript modules and curriculum fetches need HTTP. The downloaded app can run from a local server without an internet connection; external reference links require internet. The hosted app does not install an offline cache or service worker, so full offline availability of the hosted site is not promised. Progress is browser-local, not synchronized between devices; export a backup before clearing browser data.

## Verify

With Node.js installed:

```sh
npm run check
npm test
```

Tests use Node's built-in test runner and require no dependency installation.

## Authorship and licensing

See [the provenance notice](docs/PROVENANCE.md). The original app code is available under the [MIT license](LICENSE). Lesson text, exercises, worked examples, and curriculum data are excluded from that grant and have no additional reuse license. See the license for its exact scope.

Standard science and factual scope references are distinguished from independently authored teaching content. This project is not affiliated with or endorsed by MIT or any university.

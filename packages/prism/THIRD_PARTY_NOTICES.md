# PRISM asset notices

## PRISM profile dependencies and assets

PRISM components are independently implemented from design and interaction references.
Employee data is not redistributed here. `prism-icon.tsx` retains 87 vector design assets from the authorized PRISM reference revision `7ecfc9a`, with a typed React adapter and instance-scoped SVG IDs. Original artwork and branding rights remain with their respective owners; this repository does not grant those rights.

- Pretendard 1.3.9, SIL Open Font License 1.1. The official variable font is served
  in `/prism/fonts/` together with `LICENSE.txt`.
- PDF.js (`pdfjs-dist` 6.3.289), Apache License 2.0. The production document viewer
  serves the package's worker; its license is included at `/prism/vendor/PDFJS-LICENSE.txt`.
- jsPDF 4.2.1 and fflate 0.8.3, MIT. Used on demand for image-page PDF generation
  and ZIP packaging; full licenses remain in their npm distributions.
- postcss-value-parser 4.2.0, MIT. Its npm distribution includes the full license.
- `react-markdown` and `remark-gfm`, MIT. They are npm dependencies; their source
  is consumed as packages rather than copied into PRISM registry source files.

Registry installation includes this notice as `PRISM_ASSET_NOTICES.md`.
Pretendard and PDF.js package distributions include their full licenses.

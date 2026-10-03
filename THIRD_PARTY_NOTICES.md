# Source and historical attribution notices

The components marked `shadcn/ui` in `registry/provenance.json` adapt
shadcn/ui source. The metadata records their exact revisions. Origin UI,
Kibo UI, and AI Elements were recorded as adaptation sources in earlier
versions. Their notices are retained for provenance and attribution even
though current component code is implemented in pydemia/ui. Tremor is a
design reference; its source was not copied. Package dependencies retain
their own licenses in the installed packages.

The earlier Message and PromptInput adaptations referenced AI Elements,
licensed under Apache-2.0. Copyright 2023 Vercel, Inc. The full license
text is in `licenses/Apache-2.0.txt`.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use these files except in compliance with the License.
You may obtain a copy of the License at
<https://www.apache.org/licenses/LICENSE-2.0>.
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

- Copyright (c) 2025 Origin UI
- Copyright (c) 2023 — Present shadcnblocks
- Copyright (c) 2023 shadcn

Origin UI, Kibo UI, and shadcn/ui are licensed under the MIT License:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## PRISM profile dependencies and assets

PRISM components are independently implemented from design and interaction references.
Employee data is not redistributed here. `prism-icon.tsx` retains 87 vector design assets from the authorized PRISM reference revision `7ecfc9a`, with a typed React adapter and instance-scoped SVG IDs. Original artwork and branding rights remain with their respective owners; this repository does not grant those rights.

- Pretendard 1.3.9, SIL Open Font License 1.1. The official variable font is served
  in `/prism/fonts/` together with `LICENSE.txt`.
- PDF.js (`pdfjs-dist` 6.3.289), Apache License 2.0. The production document viewer
  serves the package's worker; its license is included at `/prism/vendor/PDFJS-LICENSE.txt`.
- `react-markdown` and `remark-gfm`, MIT. They are npm dependencies; their source
  is consumed as packages rather than copied into PRISM registry source files.

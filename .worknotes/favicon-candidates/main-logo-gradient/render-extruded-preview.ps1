Add-Type -AssemblyName System.Drawing

$source = @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public static class ExtrudedLogoPreview {
    static readonly Color NavySide =
        ColorTranslator.FromHtml("#102A36");
    static readonly Color BurgundySide =
        ColorTranslator.FromHtml("#702440");

    public static void Render(
        string colorSource, string frontSource,
        string output, string small, string tiny
    ) {
        using (var colors = new Bitmap(colorSource))
        using (var front = new Bitmap(frontSource))
        using (var sides = new Bitmap(
            colors.Width, colors.Height,
            PixelFormat.Format32bppArgb
        ))
        using (var result = new Bitmap(
            colors.Width, colors.Height,
            PixelFormat.Format32bppArgb
        )) {
            for (int y = 0; y < colors.Height; y++) {
                for (int x = 0; x < colors.Width; x++) {
                    Color pixel = colors.GetPixel(x, y);
                    if (pixel.A == 0) continue;
                    Color side = pixel.R > 100
                        ? BurgundySide : NavySide;
                    sides.SetPixel(x, y, Color.FromArgb(
                        pixel.A, side.R, side.G, side.B
                    ));
                }
            }

            using (var graphics = Graphics.FromImage(result)) {
                graphics.Clear(Color.Transparent);
                for (int depth = 28; depth >= 1; depth--) {
                    int shiftX = (int)Math.Round(depth * 0.7);
                    graphics.DrawImageUnscaled(
                        sides, shiftX, depth
                    );
                }
                graphics.DrawImageUnscaled(front, 0, 0);
            }
            result.Save(output, ImageFormat.Png);

            for (int size = 32; size >= 16; size /= 2) {
                using (var icon = new Bitmap(
                    size, size, PixelFormat.Format32bppArgb
                ))
                using (var graphics = Graphics.FromImage(icon)) {
                    graphics.InterpolationMode =
                        InterpolationMode.HighQualityBicubic;
                    graphics.Clear(Color.Transparent);
                    graphics.DrawImage(result, 0, 0, size, size);
                    icon.Save(
                        size == 32 ? small : tiny, ImageFormat.Png
                    );
                }
            }
        }
    }
}
'@

$references = @(
    [System.Drawing.Bitmap].Assembly.Location,
    [System.Drawing.Color].Assembly.Location,
    [System.Reflection.Assembly]::Load(
        'System.Private.Windows.GdiPlus'
    ).Location,
    [System.Reflection.Assembly]::Load(
        'System.Private.Windows.Core'
    ).Location
)
Add-Type -TypeDefinition $source -ReferencedAssemblies $references

$directory = $PSScriptRoot
[ExtrudedLogoPreview]::Render(
    (Join-Path $directory 'approved-colorful-source.png'),
    (Join-Path $directory 'pydemia-logo-v2-dimensional-v4.png'),
    (Join-Path $directory 'pydemia-logo-v2-extruded.png'),
    (Join-Path $directory 'pydemia-logo-v2-extruded-32.png'),
    (Join-Path $directory 'pydemia-logo-v2-extruded-16.png')
)

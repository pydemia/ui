Add-Type -AssemblyName System.Drawing

$source = @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public static class LogoGradientPreview {
    static readonly double[] Stops = { 0, 0.28, 0.65, 1 };
    static readonly Color[] Navy = {
        ColorTranslator.FromHtml("#4A778A"),
        ColorTranslator.FromHtml("#24586B"),
        ColorTranslator.FromHtml("#103344"),
        ColorTranslator.FromHtml("#1C2732")
    };
    static readonly Color[] Burgundy = {
        ColorTranslator.FromHtml("#DC7896"),
        ColorTranslator.FromHtml("#BA365B"),
        ColorTranslator.FromHtml("#792343"),
        ColorTranslator.FromHtml("#1C181F")
    };

    static Color Shade(double position, Color[] colors) {
        position = Math.Max(0, Math.Min(1, position));
        for (int i = 1; i < Stops.Length; i++) {
            if (position > Stops[i]) continue;
            double t = (position - Stops[i - 1]) /
                (Stops[i] - Stops[i - 1]);
            int r = (int)Math.Round(colors[i - 1].R +
                t * (colors[i].R - colors[i - 1].R));
            int g = (int)Math.Round(colors[i - 1].G +
                t * (colors[i].G - colors[i - 1].G));
            int b = (int)Math.Round(colors[i - 1].B +
                t * (colors[i].B - colors[i - 1].B));
            return Color.FromArgb(r, g, b);
        }
        return colors[colors.Length - 1];
    }

    public static void Render(
        string input, string output, string small, string tiny
    ) {
        using (var original = new Bitmap(input))
        using (var result = new Bitmap(
            original.Width, original.Height,
            PixelFormat.Format32bppArgb
        )) {
            for (int y = 0; y < original.Height; y++) {
                for (int x = 0; x < original.Width; x++) {
                    Color source = original.GetPixel(x, y);
                    if (source.A == 0) continue;
                    bool burgundy = source.R > 100;
                    double position = burgundy
                        ? (x + y - 1500.0) / 1300.0
                        : (x + y - 700.0) / 1000.0;
                    Color shade = Shade(
                        position, burgundy ? Burgundy : Navy
                    );
                    if (!burgundy) {
                        double dx = x - 864.0;
                        double dy = y - 434.0;
                        double distance = Math.Sqrt(dx * dx + dy * dy);
                        double shadow = 0.12 * Math.Max(
                            0, 1 - distance / 360.0
                        );
                        Color ink = ColorTranslator.FromHtml("#103344");
                        shade = Color.FromArgb(
                            (int)Math.Round(shade.R * (1 - shadow) +
                                ink.R * shadow),
                            (int)Math.Round(shade.G * (1 - shadow) +
                                ink.G * shadow),
                            (int)Math.Round(shade.B * (1 - shadow) +
                                ink.B * shadow)
                        );
                    }
                    result.SetPixel(x, y, Color.FromArgb(
                        source.A, shade.R, shade.G, shade.B
                    ));
                }
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
[LogoGradientPreview]::Render(
    (Join-Path $directory 'approved-colorful-source.png'),
    (Join-Path $directory 'pydemia-logo-v2-dimensional-v4.png'),
    (Join-Path $directory 'pydemia-logo-v2-dimensional-v4-32.png'),
    (Join-Path $directory 'pydemia-logo-v2-dimensional-v4-16.png')
)

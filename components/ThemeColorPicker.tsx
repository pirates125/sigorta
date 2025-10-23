"use client";

import { Check } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { themeColors, ThemeColor } from "@/lib/theme-colors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function ThemeColorPicker() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tema Rengi</CardTitle>
        <CardDescription>
          Sitenin ana rengini tercih ettiğiniz renge değiştirin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {Object.values(themeColors).map((color) => (
            <button
              key={color.id}
              onClick={() => setTheme(color.id)}
              className="group relative flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200"
              title={color.name}
            >
              {/* Color Circle */}
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full shadow-md transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg ${
                    theme === color.id
                      ? "ring-4 ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                  style={{
                    backgroundColor: color.primary,
                    ...(theme === color.id && {
                      boxShadow: `0 0 0 2px white, 0 0 0 6px ${color.primary}`,
                    }),
                  }}
                >
                  {/* Checkmark for selected theme */}
                  {theme === color.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1 shadow-sm">
                        <Check
                          className="h-5 w-5"
                          style={{ color: color.primary }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Color Name & Emoji */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg" aria-hidden="true">
                  {color.emoji}
                </span>
                <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                  {color.name}
                </span>
              </div>

              {/* Shine effect on hover */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${color.primary} 0%, transparent 70%)`,
                }}
              />
            </button>
          ))}
        </div>

        {/* Selected Theme Preview */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full shadow-sm"
                style={{ backgroundColor: themeColors[theme].primary }}
              />
              <div>
                <p className="text-sm font-medium">
                  {themeColors[theme].emoji} {themeColors[theme].name}
                </p>
                <p className="text-xs text-muted-foreground">Seçili tema</p>
              </div>
            </div>

            {/* Color samples */}
            <div className="flex items-center gap-1">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: themeColors[theme].primary }}
                title="Ana renk"
              />
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: themeColors[theme].primaryHover }}
                title="Hover rengi"
              />
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: themeColors[theme].primaryLight }}
                title="Açık renk"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client"

import { Moon, Sun, Monitor, PanelLeft, PanelTop, X } from "lucide-react"
import React, { useState } from "react"
import { useTheme } from "next-themes"

import AppearanceItem from "@/components/layout/appearanceItem"
import AppearanceColorItem from "@/components/layout/appearanceColorItem"
import { Button } from "@/components/ui/button"

export default function Appearance({
  setAppearanceOpen,
  setLayoutMode,
  layoutMode,
}) {
  const [color, setColor] = useState(
    () => document.documentElement.dataset.colorPreset || "red"
  )

  const { theme, setTheme } = useTheme()

  const changeColor = (value) => {
    setColor(value)
    document.documentElement.dataset.colorPreset = value
    localStorage.setItem("colorPreset", value)
  }
  const changeLayout = (value) => {
  setLayoutMode(value)
  localStorage.setItem("layoutMode", value)
}

  return (
    <>
      <div
        onClick={() => setAppearanceOpen(false)}
        className="fixed inset-0 isolate z-50 bg-black/30 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
      />

      <div className="fixed top-0 **:select-none right-0 z-60 m-3 h-[95%] w-[90%] max-w-100 rounded-xl border bg-background p-4 shadow-xl">
        <Button
          onClick={() => setAppearanceOpen(false)}
          variant="ghost"
          size="icon"
          className="absolute top-1 right-2"
        >
          <X />
        </Button>

        <div className="mb-10 flex flex-col md:mb-5 lg:mb-10">
          <span className="font-semibold">Customize</span>
          <span className="text-sm text-muted-foreground">
            Personalize your dashboard experience.
          </span>
        </div>

        <span className="text-[14px] font-semibold">Theme</span>

        <div className="mt-2 mb-10 flex gap-2 md:mb-5 lg:mb-10">
          <AppearanceItem
            active={theme === "light"}
            onClick={() => setTheme("light")}
            icon={Sun}
            label="Light"
          />

          <AppearanceItem
            active={theme === "dark"}
            onClick={() => setTheme("dark")}
            icon={Moon}
            label="Dark"
          />

          <AppearanceItem
            active={theme === "system"}
            onClick={() => setTheme("system")}
            icon={Monitor}
            label="System"
          />
        </div>

        <span className="text-[14px] font-semibold">Color</span>

        <div className="mt-2 mb-10 flex h-auto flex-wrap gap-2 *:md:w-[31%] *:lg:w-[48%] md:mb-5 lg:mb-10">
          <AppearanceColorItem
            active={color === "slate"}
            onClick={() => changeColor("slate")}
            color="#6a727e"
            label="Slate"
          />

          <AppearanceColorItem
            active={color === "blue"}
            onClick={() => changeColor("blue")}
            color="#0079d3"
            label="Blue"
          />

          <AppearanceColorItem
            active={color === "violet"}
            onClick={() => changeColor("violet")}
            color="#615cdc"
            label="Violet"
          />

          <AppearanceColorItem
            active={color === "rose"}
            onClick={() => changeColor("rose")}
            color="#bb3181"
            label="Rose"
          />

          <AppearanceColorItem
            active={color === "orange"}
            onClick={() => changeColor("orange")}
            color="oklch(71.867% 0.19168 49.367)"
            label="Orange"
          />

          <AppearanceColorItem
            active={color === "red"}
            onClick={() => changeColor("red")}
            color="#ae0000"
            label="Red"
          />
        </div>

        <span className="mt-10 hidden text-[14px] font-semibold md:flex md:mt-5 lg:mt-10">
          Layout
        </span>

        <div className="mt-2 hidden h-auto gap-2 md:flex">
          <AppearanceItem
            active={layoutMode === "sidebar"}
            onClick={() => changeLayout("sidebar")}
            icon={PanelLeft}
            label="Sidebar"
          />

          <AppearanceItem
            active={layoutMode === "topnav"}
            onClick={() => changeLayout("topnav")}
            icon={PanelTop}
            label="Top Nav"
          />
        </div>
      </div>
    </>
  )
}
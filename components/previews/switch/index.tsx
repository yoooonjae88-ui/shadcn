import type { PreviewExample } from "@/components/previews/types"
import { SwitchBasicExample } from "./switch-basic"
import { SwitchColorsExample } from "./switch-colors"
import { SwitchControlledExample } from "./switch-controlled"
import { SwitchDisabledExample } from "./switch-disabled"
import { SwitchFormExample } from "./switch-form"
import { SwitchIndicatorsExample } from "./switch-indicators"
import { SwitchInvalidExample } from "./switch-invalid"
import { SwitchLabelExample } from "./switch-label"
import { SwitchLoadingExample } from "./switch-loading"
import { SwitchSettingsListExample } from "./switch-settings-list"
import { SwitchSizesExample } from "./switch-sizes"
import { SwitchThumbIconsExample } from "./switch-thumb-icons"

export const switchExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic",
    component: SwitchBasicExample,
    file: "components/previews/switch/switch-basic.tsx",
  },
  {
    name: "label",
    title: "With label",
    component: SwitchLabelExample,
    file: "components/previews/switch/switch-label.tsx",
  },
  {
    name: "sizes",
    title: "Sizes",
    component: SwitchSizesExample,
    file: "components/previews/switch/switch-sizes.tsx",
  },
  {
    name: "colors",
    title: "Colors",
    component: SwitchColorsExample,
    file: "components/previews/switch/switch-colors.tsx",
  },
  {
    name: "disabled",
    title: "Disabled",
    component: SwitchDisabledExample,
    file: "components/previews/switch/switch-disabled.tsx",
  },
  {
    name: "thumb-icons",
    title: "Thumb icons",
    component: SwitchThumbIconsExample,
    file: "components/previews/switch/switch-thumb-icons.tsx",
  },
  {
    name: "indicators",
    title: "Track indicators",
    component: SwitchIndicatorsExample,
    file: "components/previews/switch/switch-indicators.tsx",
  },
  {
    name: "loading",
    title: "Loading",
    component: SwitchLoadingExample,
    file: "components/previews/switch/switch-loading.tsx",
  },
  {
    name: "invalid",
    title: "Invalid",
    component: SwitchInvalidExample,
    file: "components/previews/switch/switch-invalid.tsx",
  },
  {
    name: "controlled",
    title: "Controlled",
    component: SwitchControlledExample,
    file: "components/previews/switch/switch-controlled.tsx",
  },
  {
    name: "settings-list",
    title: "Settings list",
    component: SwitchSettingsListExample,
    file: "components/previews/switch/switch-settings-list.tsx",
  },
  {
    name: "form",
    title: "Form usage",
    component: SwitchFormExample,
    file: "components/previews/switch/switch-form.tsx",
  },
]

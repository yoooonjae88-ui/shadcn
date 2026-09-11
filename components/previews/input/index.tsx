import type { PreviewExample } from "@/components/previews/types"
import { InputAddonsExample } from "./input-addons"
import { InputBasicExample } from "./input-basic"
import { InputCountExample } from "./input-count"
import { InputOtpExample } from "./input-otp"
import { InputPasswordExample } from "./input-password"
import { InputPrefixSuffixExample } from "./input-prefix-suffix"
import { InputSearchExample } from "./input-search"
import { InputStatusExample } from "./input-status"
import { InputTextareaExample } from "./input-textarea"
import { InputVariantsExample } from "./input-variants"

export const inputExamples: PreviewExample[] = [
  {
    name: "basic",
    title: "Basic & sizes",
    component: InputBasicExample,
    file: "components/previews/input/input-basic.tsx",
  },
  {
    name: "variants",
    title: "Variants",
    component: InputVariantsExample,
    file: "components/previews/input/input-variants.tsx",
  },
  {
    name: "prefix-suffix",
    title: "Prefix and suffix",
    component: InputPrefixSuffixExample,
    file: "components/previews/input/input-prefix-suffix.tsx",
  },
  {
    name: "addons",
    title: "Addons",
    component: InputAddonsExample,
    file: "components/previews/input/input-addons.tsx",
  },
  {
    name: "count",
    title: "Clear & character count",
    component: InputCountExample,
    file: "components/previews/input/input-count.tsx",
  },
  {
    name: "status",
    title: "Status & disabled",
    component: InputStatusExample,
    file: "components/previews/input/input-status.tsx",
  },
  {
    name: "password",
    title: "Password",
    component: InputPasswordExample,
    file: "components/previews/input/input-password.tsx",
  },
  {
    name: "search",
    title: "Search",
    component: InputSearchExample,
    file: "components/previews/input/input-search.tsx",
  },
  {
    name: "textarea",
    title: "Text area",
    component: InputTextareaExample,
    file: "components/previews/input/input-textarea.tsx",
  },
  {
    name: "otp",
    title: "One-time password",
    component: InputOtpExample,
    file: "components/previews/input/input-otp.tsx",
  },
]

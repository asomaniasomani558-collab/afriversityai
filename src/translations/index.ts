import { Language, TranslationDictionary } from "./types";
import { en } from "./en";
import { sw } from "./sw";
import { fr } from "./fr";
import { ar } from "./ar";
import { yo } from "./yo";
import { tw } from "./tw";
import { ha } from "./ha";
import { am } from "./am";
import { zu } from "./zu";
import { pt } from "./pt";

export * from "./types";
export { en, sw, fr, ar, yo, tw, ha, am, zu, pt };

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en,
  sw,
  fr,
  ar,
  yo,
  tw,
  ha,
  am,
  zu,
  pt,
};

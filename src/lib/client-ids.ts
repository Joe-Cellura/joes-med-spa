export const CLIENT_IDS = [
  "lumina",
  "aura-skin-laser",
  "bright-smile-dental",
  "glo-de-vie",
  "medspa-501",
  "palm",
] as const;

export type ClientId = (typeof CLIENT_IDS)[number];

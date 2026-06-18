// Ekip tek kaynak. İsimler özel ad (çevrilmez); ünvanlar çeviriden gelir (team.roles.<roleKey>).
export type Member = {
  id: string;
  name: string;
  roleKey: string;
  initials: string;
};

export const team: Member[] = [
  { id: "founder", name: "Ahmet Uçar", roleKey: "founder", initials: "AU" },
  { id: "gm", name: "Mehmet Uçar", roleKey: "gm", initials: "MU" },
  { id: "ops", name: "Kemal Demir", roleKey: "ops", initials: "KD" },
  { id: "customs", name: "Layla Haddad", roleKey: "customs", initials: "LH" },
  { id: "fleet", name: "Hasan Yılmaz", roleKey: "fleet", initials: "HY" },
  { id: "sales", name: "Zeynep Aksoy", roleKey: "sales", initials: "ZA" },
];

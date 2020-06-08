export interface IManufacturer {
  id?: string;
  name: string;
  phone: string;

  /* The SIRET code
    (French: Système d’identification du répertoire des établissements),
    or SIRET number, is an INSEE code which allows
    the geographic identification of any French establishment or business.
   */
  siret: number;
}

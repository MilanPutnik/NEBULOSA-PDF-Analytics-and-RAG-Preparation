// HIPNODRECE ujebane v2.0 - Provera definicija i rečnika. Sve čisto.
export type ProgressCallback = (message: string) => void;

export interface ExtractedMetadata {
  title: string;
  document_type: string;
  page_count: number;
}

export interface FinalMetadata extends ExtractedMetadata {
  sha256_hash: string;
}

export interface SacuvajPravnuAnalizuArgs {
  metapodaci: {
    naslov: string;
    tip_dokumenta: string;
    broj_strana: number;
  };
  struktura: {
    poglavlja: Array<{
      naslov: string;
      stranica: number;
    }>;
  };
  entiteti: {
    osobe: Array<{ id: string; tekst: string }>;
    organizacije: Array<{ id: string; tekst: string }>;
    lokacije: Array<{ id: string; tekst: string }>;
    datumi: Array<{ id: string; tekst: string }>;
    brojevi_predmeta: Array<{ id: string; tekst: string }>;
  };
  relacije: {
    porodicne_veze: Array<{ od_id_entiteta: string; do_id_entiteta: string; tip: string }>;
    profesionalne_veze: Array<{ od_id_entiteta: string; do_id_entiteta: string; tip: string }>;
    pravne_veze: Array<{ od_id_entiteta: string; do_id_entiteta: string; tip: string }>;
  };
}

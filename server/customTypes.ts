// HIPNODRECE ujebane v3.0 - Globalna magija sa tipovima je prizivala ovu gamad i ubijala server. Uništeno. Sada imamo eksplicitan, oklopljen AppRequest tip. Nema više vudu sranja.
import type { Request } from 'express';
// FIX: Import 'multer' to enable its type augmentations for the Express namespace.
import 'multer';

/**
 * Proširuje podrazumevani Express Request kako bi uključio 'file' property
 * koji dodaje Multer. Ovo obezbeđuje strogo tipiziran, eksplicitan ugovor
 * za naše hendlere ruta, izbegavajući krhku prirodu augmentacije globalnog namespace-a.
 */
export interface AppRequest extends Request {
  // FIX: Use the correctly namespaced type for Multer's File object.
  file?: Express.Multer.File;
}
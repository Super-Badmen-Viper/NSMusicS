import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { isElectron } from '@/utils/electron/isElectron'

export class Get_LocalSqlite_AnnotationInfo {
  public Get_Annotation_ItemInfo_Play_Count(item_type: string): number {
    if (isElectron) {
      const tableName = item_type
      const db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
      db.pragma('journal_mode = WAL')
      db.pragma('foreign_keys = OFF')
      try {
        db.exec('BEGIN TRANSACTION')
        const annotations = db
          .prepare(`SELECT ann_id, item_id FROM annotation WHERE item_type = ?`)
          .all(item_type)
        const validAnnotations = annotations.filter((annotation: any) => {
          const exists = db
            .prepare(`SELECT 1 FROM ${tableName} WHERE id = ?`)
            .get(annotation.item_id)
          return exists !== undefined
        })
        const invalidAnnotationIds = annotations
          .filter((annotation: any) => !validAnnotations.includes(annotation))
          .map((annotation: any) => annotation.ann_id)
        if (invalidAnnotationIds.length > 0) {
          db.prepare(
            `DELETE FROM annotation WHERE ann_id IN (${invalidAnnotationIds.map(() => '?').join(',')})`
          ).run(...invalidAnnotationIds)
        }
        db.exec('COMMIT')
        return validAnnotations.length
      } catch (error: any) {
        db.exec('ROLLBACK')
        throw new Error(`Failed to get annotation item info play count: ${error.message}`)
      } finally {
        db.close()
      }
    } else {
      // other
    }
  }
}

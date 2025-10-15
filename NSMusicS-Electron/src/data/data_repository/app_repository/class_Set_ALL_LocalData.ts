import { store_app_configs_info } from '@/data/data_stores/app_stores/store_app_configs_info'
import { isElectron } from '@/utils/electron/isElectron'
import { store_local_db_info } from '@/data/data_stores/local_stores/store_local_db_info'
import { store_app_configs_logic_save } from '@/data/data_stores/app_stores/store_app_configs_logic_save'

export class Set_ALL_LocalData {
  public Set_ALL_LocalData_To_Delete() {
    if (isElectron) {
      const db_navidrome = require('better-sqlite3')(store_app_configs_info.navidrome_db)
      db_navidrome.pragma('journal_mode = WAL')
      db_navidrome.exec('PRAGMA foreign_keys = OFF')
      db_navidrome.exec('BEGIN TRANSACTION')
      try {
        db_navidrome.exec('DELETE FROM album')
        db_navidrome.exec('DELETE FROM annotation')
        db_navidrome.exec('DELETE FROM artist')
        db_navidrome.exec('DELETE FROM media_file')
        db_navidrome.exec('DELETE FROM playlist')
        db_navidrome.exec('DELETE FROM playlist_tracks')
        db_navidrome.exec('COMMIT')
      } catch (error) {
        db_navidrome.exec('ROLLBACK')
        throw error
      } finally {
        db_navidrome.exec('PRAGMA foreign_keys = ON')
        db_navidrome.close()
      }

      const db_nsmusics = require('better-sqlite3')(store_app_configs_info.nsmusics_db)
      db_nsmusics.pragma('journal_mode = WAL')
      db_nsmusics.exec('PRAGMA foreign_keys = OFF')
      db_nsmusics.exec('BEGIN TRANSACTION')
      try {
        db_nsmusics.exec('DELETE FROM system_library_config')
        db_nsmusics.exec('COMMIT')
      } catch (error) {
        db_nsmusics.exec('ROLLBACK')
        throw error
      } finally {
        db_nsmusics.exec('PRAGMA foreign_keys = ON')
        db_nsmusics.close()
      }

      store_local_db_info.local_config_of_all_user_of_sqlite = []
      store_local_db_info.local_config_of_all_user_of_select = []

      store_app_configs_logic_save.save_system_library_config()
    } else {
      // other
    }
  }
}

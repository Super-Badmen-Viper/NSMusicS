<script setup lang="ts">
import { ref } from "vue";
import {store_player_tag_modify} from "@/store/player/store_player_tag_modify";
import {store_server_user_model} from "@/store/server/store_server_user_model";
const { ipcRenderer } = require('electron');

import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})
import { useMessage } from 'naive-ui'
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
const message = useMessage()

async function save_edit_tag() {
  if(store_server_user_model.model_server_type_of_local) {
    if (store_player_tag_modify.player_show_tag_kind === 'media') {
      const _path = store_player_tag_modify.player_current_media_path;
      const local_file = await ipcRenderer.invoke('node-taglib-sharp-get-media-path',
          store_player_tag_modify.player_current_media_path
      );
      /// local model | database media_file
      if (local_file) {
        const artist = store_player_tag_modify.player_current_media_tag.artist;
        const albumArtists = store_player_tag_modify.player_current_media_tag.albumArtists;
        const genres = store_player_tag_modify.player_current_media_tag.genres;
        //
        const array_artist = Array.isArray(artist) ? artist : artist.split(',').map(item => item.trim());
        const array_albumArtists = Array.isArray(albumArtists) ? albumArtists : albumArtists.split(',').map(item => item.trim());
        const array_genres = Array.isArray(genres) ? genres : genres.split(',').map(item => item.trim());
        //
        store_player_tag_modify.player_current_media_tag.artist = array_artist
        store_player_tag_modify.player_current_media_tag.albumArtists = array_albumArtists
        store_player_tag_modify.player_current_media_tag.genres = array_genres
        //
        const _tag = JSON.parse(JSON.stringify(store_player_tag_modify.player_current_media_tag));
        await ipcRenderer.invoke('node-taglib-sharp-set-media-tag', {_path, _tag});
        //
        message.success(t('nsmusics.view_page.mediaLibrary_media_tag_modify_success'))
      } else {
        const _tag = JSON.parse(JSON.stringify(store_player_tag_modify.player_current_media_tag));
        const artistStr =
            Array.isArray(_tag.artist) ?
                _tag.artist.join('、') : _tag.artist || '';
        const genresStr =
            Array.isArray(_tag.genres) ?
                _tag.genres.join('、') : _tag.genres || '';
        //
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');
        // table server_media_file
        const sql_server_media_file =
            `UPDATE server_media_file
              SET title = ?, artist = ?, album = ?,
                  disc_number = ?, track_number = ?,
                  year = ?, genre = ?, comment = ?,
                  lyrics = ?
              WHERE path = ?`;
        db.prepare(sql_server_media_file).run(
            _tag.title || '',
            artistStr,
            _tag.album || '',
            _tag.discCount || 0,
            _tag.trackCount || 0,
            _tag.year || 0,
            genresStr,
            _tag.comment || '',
            _tag.lyrics || '',
            _path
        );
        //
        db.close()
        //
        message.success(t('nsmusics.view_page.mediaLibrary_media_tag_modify_success') +
            ', ' + t('nsmusics.view_page.mediaLibrary_media_tag_modify_local_server_download'))
      }
    }
    else if(store_player_tag_modify.player_show_tag_kind === 'album'){
      const _tag = JSON.parse(JSON.stringify(store_player_tag_modify.player_current_album_tag));
      const artistStr =
          Array.isArray(_tag.artist) ?
              _tag.artist.join('、') : _tag.artist || '';
      const genresStr =
          Array.isArray(_tag.genres) ?
              _tag.genres.join('、') : _tag.genres || '';
      //
      const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
      db.pragma('journal_mode = WAL');
      db.exec('PRAGMA foreign_keys = OFF');
      // table server_album
      if(store_server_user_model.model_server_type_of_local_server_download) {
        const sql_server_album =
            `UPDATE server_album
              SET name = ?, artist = ?,
                  min_year = ?,max_year = ?, genre = ?
              WHERE id = ?`;
        db.prepare(sql_server_album).run(
            _tag.title || '',
            artistStr,
            _tag.year || 0,_tag.year || 0,
            genresStr,
            store_player_tag_modify.player_current_album_id
        );
      }else{
        const sql_album =
            `UPDATE album
              SET name = ?, artist = ?,
                  min_year = ?,max_year = ?, genre = ?
              WHERE id = ?`;
        db.prepare(sql_album).run(
            _tag.title || '',
            artistStr,
            _tag.year || 0,_tag.year || 0,
            genresStr,
            store_player_tag_modify.player_current_album_id
        );
      }
      //
      db.close()
      //
      message.success(t('nsmusics.view_page.mediaLibrary_media_tag_modify_success') +
          ', ' + t('nsmusics.view_page.mediaLibrary_media_tag_modify_local_server_download'))
    }
    else if(store_player_tag_modify.player_show_tag_kind === 'artist'){
      const _tag = JSON.parse(JSON.stringify(store_player_tag_modify.player_current_artist_tag));
      const artistStr =
          Array.isArray(_tag.artist) ?
              _tag.artist.join('、') : _tag.artist || '';
      const genresStr =
          Array.isArray(_tag.genres) ?
              _tag.genres.join('、') : _tag.genres || '';
      //
      const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
      db.pragma('journal_mode = WAL');
      db.exec('PRAGMA foreign_keys = OFF');
      // table server_artist
      if(store_server_user_model.model_server_type_of_local_server_download) {
        const sql_server_artist =
            `UPDATE server_artist
              SET name = ?
              WHERE id = ?`;
        db.prepare(sql_server_artist).run(
            artistStr,
            store_player_tag_modify.player_current_artist_id
        );
      }else{
        const sql_artist =
            `UPDATE artist
              SET name = ?
              WHERE id = ?`;
        db.prepare(sql_artist).run(
            artistStr,
            store_player_tag_modify.player_current_artist_id
        );
      }
      //
      db.close()
      //
      message.success(t('nsmusics.view_page.mediaLibrary_media_tag_modify_success') +
          ', ' + t('nsmusics.view_page.mediaLibrary_media_tag_modify_local_server_download'))
    }
  }else if(store_server_user_model.model_server_type_of_web){
    // ......
  }
}
</script>
<template>
  <n-space vertical :size="12">
    <n-table
        v-if="store_player_tag_modify.player_show_tag_kind === 'media'"
        style="width: 630px;
          --n-td-color-modal: transparent;--n-border-color-modal: #FFFFFF80;
          --n-td-padding:6px;" :bordered="false" :single-line="false">
      <tr>
        <td style="width: 160px;">{{ $t('filter.title') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_media_tag.title }}
        </td>
        <n-input v-else
            style="width: 500px;" clearable placeholder=""
            v-model:value="store_player_tag_modify.player_current_media_tag.title"/>
      </tr>
      <tr>
        <td>{{ $t('filter.path') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.path }}</td>
      </tr>
      <tr v-if="store_server_user_model.model_server_type_of_local && !store_server_user_model.model_server_type_of_local_server_download">
        <td>{{ $t('entity.albumArtist_other') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_media_tag.albumArtists }}
        </td>
        <n-input v-else
            style="width: 500px;" clearable placeholder="artist_1、artist_2"
            v-model:value="store_player_tag_modify.player_current_media_tag.albumArtists"/>
      </tr>
      <tr>
        <td>{{ $t('entity.artist_other') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_media_tag.artist }}
        </td>
        <n-input v-else
            style="width: 500px;" clearable placeholder="artist_1、artist_2"
            v-model:value="store_player_tag_modify.player_current_media_tag.artist"/>
      </tr>
      <tr>
        <td>{{ $t('entity.album_other') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_media_tag.album }}
        </td>
        <n-input v-else
            style="width: 500px;" clearable placeholder=""
            v-model:value="store_player_tag_modify.player_current_media_tag.album"/>
      </tr>
      <tr>
        <td>{{ $t('filter.disc') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_media_tag.discCount }}
        </td>
        <n-input-number v-else
            style="width: 500px;" clearable placeholder="" :min="0"
            v-model:value="store_player_tag_modify.player_current_media_tag.discCount"/>
      </tr>
      <tr>
        <td>{{ $t('common.trackNumber') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_media_tag.trackCount }}
        </td>
        <n-input-number v-else
            style="width: 500px;" clearable placeholder="" :min="0"
            v-model:value="store_player_tag_modify.player_current_media_tag.trackCount"/>
      </tr>
      <tr>
        <td>{{ $t('common.year') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_media_tag.year }}
        </td>
        <n-input-number v-else
            style="width: 500px;" clearable placeholder="" :min="0"
            v-model:value="store_player_tag_modify.player_current_media_tag.year"/>
      </tr>
      <tr>
        <td>{{ $t('entity.genre_other') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_media_tag.genres }}
        </td>
        <n-input v-else
            style="width: 500px;" clearable placeholder=""
           v-model:value="store_player_tag_modify.player_current_media_tag.genres"/>
      </tr>
      <tr>
        <td>{{ $t('common.duration') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.duration }}</td>
      </tr>
      <tr>
        <td>{{ $t('filter.isCompilation') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.isCompilation }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.codec') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.codec }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.bitrate') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.audioBitrate }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.channel_other') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.audioChannels }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.size') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.sizeOnDisk }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.favorite') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_starred }}</td>
      </tr>
      <tr>
        <td>{{ $t('filter.playCount') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_playCount }}</td>
      </tr>
      <tr>
        <td>{{ $t('filter.lastPlayed') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_playDate }}</td>
      </tr>
      <tr v-if="false">
        <td>{{ $t('common.modified') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.path }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.albumPeak') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.albumPeak }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.trackPeak') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.trackPeak }}</td>
      </tr>
      <tr>
        <td>{{ $t('filter.comment') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_media_tag.comment }}
        </td>
        <n-input v-else
            style="width: 500px;" clearable placeholder=""
            v-model:value="store_player_tag_modify.player_current_media_tag.comment"/>
      </tr>
      <tr v-if="!store_server_user_model.model_server_type_of_web">
        <td>{{ $t('page.fullscreenPlayer.lyrics') }}</td>
        <n-input
            style="width: 500px;" clearable placeholder="" type="textarea"
            v-model:value="store_player_tag_modify.player_current_media_tag.lyrics"/>
      </tr>
    </n-table>
    <n-table
        v-if="store_player_tag_modify.player_show_tag_kind === 'album'"
        style="width: 630px;
          --n-td-color-modal: transparent;--n-border-color-modal: #FFFFFF80;
          --n-td-padding:6px;" :bordered="false" :single-line="false">
      <tr>
        <td style="width: 160px;">{{ $t('filter.title') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_album_tag.title }}
        </td>
        <n-input v-else
                 style="width: 500px;" clearable placeholder=""
                 v-model:value="store_player_tag_modify.player_current_album_tag.title"/>
      </tr>
      <tr v-if="store_server_user_model.model_server_type_of_local && !store_server_user_model.model_server_type_of_local_server_download">
        <td>{{ $t('entity.albumArtist_other') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_album_tag.albumArtists }}
        </td>
        <n-input v-else
                 style="width: 500px;" clearable placeholder="artist_1、artist_2"
                 v-model:value="store_player_tag_modify.player_current_album_tag.albumArtists"/>
      </tr>
      <tr>
        <td>{{ $t('entity.artist_other') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_album_tag.artist }}
        </td>
        <n-input v-else
                 style="width: 500px;" clearable placeholder="artist_1、artist_2"
                 v-model:value="store_player_tag_modify.player_current_album_tag.artist"/>
      </tr>
      <tr>
        <td>{{ $t('common.year') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_album_tag.year }}
        </td>
        <n-input-number v-else
                        style="width: 500px;" clearable placeholder="" :min="0"
                        v-model:value="store_player_tag_modify.player_current_album_tag.year"/>
      </tr>
      <tr>
        <td>{{ $t('entity.genre_other') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_album_tag.genres }}
        </td>
        <n-input v-else
                 style="width: 500px;" clearable placeholder=""
                 v-model:value="store_player_tag_modify.player_current_album_tag.genres"/>
      </tr>
      <tr>
        <td>{{ $t('common.duration') }}</td>
        <td>{{ store_player_tag_modify.player_current_album_tag.duration }}</td>
      </tr>
      <tr>
        <td>{{ $t('filter.isCompilation') }}</td>
        <td>{{ store_player_tag_modify.player_current_album_tag.isCompilation }}</td>
      </tr>
      <tr v-if="store_player_tag_modify.player_show_tag_kind === 'album'">
        <td>{{ $t('filter.songCount') }}</td>
        <td>{{ store_player_tag_modify.player_current_album_tag.songCount }}</td>
      </tr>
    </n-table>
    <n-table
        v-if="store_player_tag_modify.player_show_tag_kind === 'artist'"
        style="width: 630px;
          --n-td-color-modal: transparent;--n-border-color-modal: #FFFFFF80;
          --n-td-padding:6px;" :bordered="false" :single-line="false">
      <tr>
        <td style="width: 160px;">{{ $t('entity.artist_other') }}</td>
        <td v-if="store_server_user_model.model_server_type_of_web">
          {{ store_player_tag_modify.player_current_artist_tag.artist }}
        </td>
        <n-input v-else
                 style="width: 500px;" clearable placeholder="artist_1、artist_2"
                 v-model:value="store_player_tag_modify.player_current_artist_tag.artist"/>
      </tr>
      <tr>
        <td>{{ $t('entity.genre_other') }}</td>
        <td>{{ store_player_tag_modify.player_current_artist_tag.genres }}</td>
      </tr>
    </n-table>
    <n-space justify="start" v-if="!store_server_user_model.model_server_type_of_web">
      <n-button @click="save_edit_tag();">
        {{ $t('common.save') }}
      </n-button>
    </n-space>
  </n-space>
</template>
<style>
::-webkit-scrollbar {
  display: auto;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 6px;
}
</style>
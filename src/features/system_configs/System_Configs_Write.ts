import { App_Configs } from '@/models/app_Configs/class_App_Configs';
import { Player_Configs_of_Audio_Info } from '@/models/app_Configs/class_Player_Configs_of_Audio_Info';
import { Player_Configs_of_UI } from '@/models/app_Configs/class_Player_Configs_of_UI';

export class System_Configs_Write {
    system_app_config(
        db: any,
        app_Configs: App_Configs,
    ){
        /// system_app_config
        db.exec("DELETE FROM system_app_config");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_app_config'");
        const appConfigStmt = db.prepare(`INSERT INTO system_app_config (config_key, config_value) VALUES (?, ?)`);
        Object.entries(app_Configs).forEach(([propertyName, value]) => {
            appConfigStmt.run(propertyName, value);
        });
    }

    system_player_config_of_ui(
        db: any,
        player_Configs_of_UI: Player_Configs_of_UI,
    ){
        /// system_player_config_of_ui
        db.exec("DELETE FROM system_player_config_of_ui");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_player_config_of_ui'");
        const uiConfigStmt = db.prepare(`INSERT INTO system_player_config_of_ui (config_key, config_value) VALUES (?, ?)`);
        Object.entries(player_Configs_of_UI).forEach(([propertyName, value]) => {
            uiConfigStmt.run(propertyName, value);
        });
    }

    system_player_config_of_audio(
        db: any,
        player_Configs_of_Audio_Info: Player_Configs_of_Audio_Info,
    ){
        /// system_player_config_of_audio
        db.exec("DELETE FROM system_player_config_of_audio");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_player_config_of_audio'");
        const audioConfigStmt = db.prepare(`INSERT INTO system_player_config_of_audio (config_key, config_value) VALUES (?, ?)`);
        Object.entries(player_Configs_of_Audio_Info).forEach(([propertyName, value]) => {
            audioConfigStmt.run(propertyName, value);
        });
    }

    // system_playlist_file_config(
    //     db: any,
    //     playlist_File_Configs: Media_File[],
    // ){
    //     /// system_player_config_of_audio
    //     db.exec("DELETE FROM system_playlist_file_config");
    //     db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_playlist_file_config'");
    //     const playlistConfigStmt = db.prepare(`
    //         INSERT INTO system_playlist_file_config
    //         (id,path,title,album,artist,artist_id,album_artist,album_id,has_cover_art,track_number,disc_number,year,size,suffix,duration,bit_rate,genre,compilation,
    //         created_at,updated_at,
    //         full_text,
    //         album_artist_id,order_album_name,order_album_artist_name,order_artist_name,
    //         sort_album_name,sort_artist_name,sort_album_artist_name,
    //         sort_title,disc_subtitle,
    //         mbz_track_id,mbz_album_id,mbz_artist_id,mbz_album_artist_id,mbz_album_type,mbz_album_comment,
    //         catalog_num,
    //         comment,
    //         lyrics,
    //         bpm,
    //         channels,
    //         order_title,
    //         mbz_release_track_id,
    //         rg_album_gain,rg_album_peak,rg_track_gain,rg_track_peak)
    //         VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)
    //     `);
    //     playlist_File_Configs.forEach((mediaFile) => {
    //         playlistConfigStmt.run(
    //             mediaFile.id,
    //             mediaFile.path,
    //             mediaFile.title,
    //             mediaFile.album,
    //             mediaFile.artist,
    //             mediaFile.artist_id,
    //             mediaFile.album_artist,
    //             mediaFile.album_id,
    //             mediaFile.has_cover_art,
    //             mediaFile.track_number,
    //             mediaFile.disc_number,
    //             mediaFile.year,
    //             mediaFile.size,
    //             mediaFile.suffix,
    //             mediaFile.duration,
    //             mediaFile.bit_rate,
    //             mediaFile.genre,
    //             mediaFile.compilation,
    //             mediaFile.created_at,
    //             mediaFile.updated_at,
    //             mediaFile.full_text,
    //             mediaFile.album_artist_id,
    //             mediaFile.order_album_name,
    //             mediaFile.order_album_artist_name,
    //             mediaFile.order_artist_name,
    //             mediaFile.sort_album_name,
    //             mediaFile.sort_artist_name,
    //             mediaFile.sort_album_artist_name,
    //             mediaFile.sort_title,
    //             mediaFile.disc_subtitle,
    //             mediaFile.mbz_track_id,
    //             mediaFile.mbz_album_id,
    //             mediaFile.mbz_artist_id,
    //             mediaFile.mbz_album_artist_id,
    //             mediaFile.mbz_album_type,
    //             mediaFile.mbz_album_comment,
    //             mediaFile.catalog_num,
    //             mediaFile.comment,
    //             mediaFile.lyrics,
    //             mediaFile.bpm,
    //             mediaFile.channels,
    //             mediaFile.order_title,
    //             mediaFile.mbz_release_track_id,
    //             mediaFile.rg_album_gain,
    //             mediaFile.rg_album_peak,
    //             mediaFile.rg_track_gain,
    //             mediaFile.rg_track_peak,
    //         );
    //     });
    // }
    ///
    system_playlist_item_id_config(
        db: any,
        media_file_id_of_list: string[],
    ) {
        db.exec("DELETE FROM system_playlist_file_id_config");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_playlist_file_id_config'");
        const playlistConfigStmt = db.prepare(`
            INSERT INTO system_playlist_file_id_config (media_file_id)
            VALUES (?) 
        `);
        media_file_id_of_list.forEach((mediaFileId) => {
            playlistConfigStmt.run(mediaFileId);
        });
    }

    system_view_history(
        db: any,
        view_Media_History_select_Configs: any,
        view_Media_History_Configs: Interface_View_Router_Date[],
        view_Album_History_select_Configs: any,
        view_Album_History_Configs: Interface_View_Router_Date[],
        view_Artist_History_select_Configs: any,
        view_Artist_History_Configs: Interface_View_Router_Date[],
    ){
        /// view_Media_History_select_Configs
        db.exec("DELETE FROM system_view_media_select_history");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_media_select_history'");
        const viewHistoryConfigStmt_01 = db.prepare(`
            INSERT INTO system_view_media_select_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
        );
        if(view_Media_History_select_Configs != null)
            viewHistoryConfigStmt_01.run(
                view_Media_History_select_Configs.id,
                view_Media_History_select_Configs.menu_select_active_key,
                view_Media_History_select_Configs.router_name,
                String(view_Media_History_select_Configs.router_select_model_media),
                String(view_Media_History_select_Configs.router_select_model_album),
                String(view_Media_History_select_Configs.router_select_model_artist),
                view_Media_History_select_Configs.page_lists_keyword,
                view_Media_History_select_Configs.stmt_string,
                view_Media_History_select_Configs.page_lists_selected,
                view_Media_History_select_Configs.columnKey,
                view_Media_History_select_Configs.order,
                view_Media_History_select_Configs.page_lists_scrollindex,
            );
        //
        db.exec("DELETE FROM system_view_media_history");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_media_history'");
        const viewHistoryConfigStmt_1 = db.prepare(`
            INSERT INTO system_view_media_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
        );
        view_Media_History_Configs.forEach((router_date) => {
            viewHistoryConfigStmt_1.run(
                router_date.id,
                router_date.menu_select_active_key,
                router_date.router_name,
                String(router_date.router_select_model_media),
                String(router_date.router_select_model_album),
                String(router_date.router_select_model_artist),
                router_date.page_lists_keyword,
                router_date.stmt_string,
                router_date.page_lists_selected,
                router_date.columnKey,
                router_date.order,
                router_date.page_lists_scrollindex,
            );
        });
        /// system_view_album_history
        db.exec("DELETE FROM system_view_album_select_history");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_album_select_history'");
        const viewHistoryConfigStmt_02 = db.prepare(`
            INSERT INTO system_view_album_select_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
        );
        if(view_Album_History_select_Configs != null)
            viewHistoryConfigStmt_02.run(
                view_Album_History_select_Configs.id,
                view_Album_History_select_Configs.menu_select_active_key,
                view_Album_History_select_Configs.router_name,
                String(view_Album_History_select_Configs.router_select_model_media),
                String(view_Album_History_select_Configs.router_select_model_album),
                String(view_Album_History_select_Configs.router_select_model_artist),
                view_Album_History_select_Configs.page_lists_keyword,
                view_Album_History_select_Configs.stmt_string,
                view_Album_History_select_Configs.page_lists_selected,
                view_Album_History_select_Configs.columnKey,
                view_Album_History_select_Configs.order,
                view_Album_History_select_Configs.page_lists_scrollindex,
            );
        //
        db.exec("DELETE FROM system_view_album_history");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_album_history'");
        const viewHistoryConfigStmt_2 = db.prepare(`
            INSERT INTO system_view_album_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
        );
        view_Album_History_Configs.forEach((router_date) => {
            viewHistoryConfigStmt_2.run(
                router_date.id,
                router_date.menu_select_active_key,
                router_date.router_name,
                String(router_date.router_select_model_media),
                String(router_date.router_select_model_album),
                String(router_date.router_select_model_artist),
                router_date.page_lists_keyword,
                router_date.stmt_string,
                router_date.page_lists_selected,
                router_date.columnKey,
                router_date.order,
                router_date.page_lists_scrollindex,
            );
        });
        /// system_view_artist_history
        db.exec("DELETE FROM system_view_artist_select_history");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_artist_select_history'");
        const viewHistoryConfigStmt_03 = db.prepare(`
            INSERT INTO system_view_artist_select_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
        );
        if(view_Artist_History_select_Configs != null)
            viewHistoryConfigStmt_03.run(
                view_Artist_History_select_Configs.id,
                view_Artist_History_select_Configs.menu_select_active_key,
                view_Artist_History_select_Configs.router_name,
                String(view_Artist_History_select_Configs.router_select_model_media),
                String(view_Artist_History_select_Configs.router_select_model_album),
                String(view_Artist_History_select_Configs.router_select_model_artist),
                view_Artist_History_select_Configs.page_lists_keyword,
                view_Artist_History_select_Configs.stmt_string,
                view_Artist_History_select_Configs.page_lists_selected,
                view_Artist_History_select_Configs.columnKey,
                view_Artist_History_select_Configs.order,
                view_Artist_History_select_Configs.page_lists_scrollindex,
            );
        //
        db.exec("DELETE FROM system_view_artist_history");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_artist_history'");
        const viewHistoryConfigStmt_3 = db.prepare(`
            INSERT INTO system_view_artist_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
        );
        view_Artist_History_Configs.forEach((router_date) => {
            viewHistoryConfigStmt_3.run(
                router_date.id,
                router_date.menu_select_active_key,
                router_date.router_name,
                String(router_date.router_select_model_media),
                String(router_date.router_select_model_album),
                String(router_date.router_select_model_artist),
                router_date.page_lists_keyword,
                router_date.stmt_string,
                router_date.page_lists_selected,
                router_date.columnKey,
                router_date.order,
                router_date.page_lists_scrollindex,
            );
        });
    }

    system_servers_config(
        db: any,
        server_Configs: Server_Configs_Props[],
    ){
        /// system_servers_config
        db.exec("DELETE FROM system_servers_config");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_servers_config'");
        const server_ConfigsStmt = db.prepare(`
            INSERT INTO system_servers_config 
            (id,server_name,url,user_name,password,last_login_at,type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        server_Configs.forEach((server_Configs_Props) => {
            server_ConfigsStmt.run(
                server_Configs_Props.id,
                server_Configs_Props.server_name,
                server_Configs_Props.url,
                server_Configs_Props.user_name,
                server_Configs_Props.password,
                server_Configs_Props.last_login_at,
                server_Configs_Props.type
            );
        });
    }
}
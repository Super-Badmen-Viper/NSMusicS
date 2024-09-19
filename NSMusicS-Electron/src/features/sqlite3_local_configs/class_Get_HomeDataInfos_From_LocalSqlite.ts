import moment from "moment/moment";
import { store_server_user_model } from '@/store/server/store_server_user_model'
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
export class Get_HomeDataInfos_From_LocalSqlite {
    public Get_Annotation_Maximum_Playback() {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const annsMap = new Map();
        const anns = db.prepare(`SELECT * FROM ${store_server_user_model.annotation} WHERE item_type = 'album' ORDER BY play_count desc LIMIT 18`).all();
        anns.forEach((ann: { item_id: any; }) => {
            annsMap.set(ann.item_id, ann); // 使用 item_id 作为键
        });
        const sql = `SELECT a.*, b.play_count 
             FROM ${store_server_user_model.album} a 
             LEFT JOIN ${store_server_user_model.annotation} b ON a.id = b.item_id AND b.item_type = 'album'
             ORDER BY b.play_count desc, a.id desc
             LIMIT 18`;
        const allData = db.prepare(sql).all();
        const result: Album[] = []
        allData.forEach((row: Album) => {
            if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
                if (row.embed_art_path.indexOf('mp3') > 0)
                    row.medium_image_url = row.embed_art_path.replace('mp3', 'jpg');
                else if (row.embed_art_path.indexOf('flac') > 0)
                    row.medium_image_url = row.embed_art_path.replace('flac', 'jpg');
                else
                    row.medium_image_url = '../../../resources/img/error_album.jpg';
            }
            const fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/);
            const fileNameWithExtension = fileNameMatch ? fileNameMatch[0] : null;
            const fileNameWithoutExtension = fileNameWithExtension ? fileNameWithExtension.replace(/\.[^.]+$/, '') : null;
            const fileNameWithoutPrefix = fileNameWithoutExtension ? fileNameWithoutExtension.replace(/.*?-\s*/, '') : null;
            if (fileNameWithoutPrefix !== null) {
                row.title = fileNameWithoutPrefix;
            }
            row.album_title = row.title + "<br>" + row.artist;
            row.updated_time = row.updated_at ? moment(row.updated_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
            row.created_time = row.created_at ? moment(row.created_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
            result.push(row);
        });
        ////// find favorite for result
        const stmt_album_Annotation_Starred_Items = db.prepare(`
            SELECT item_id FROM ${store_server_user_model.annotation}
            WHERE starred = 1 AND item_type='album'
        `);
        const annotations = stmt_album_Annotation_Starred_Items.all();
        for (let i = 0; i < result.length; i++) {
            result[i].favorite = !!annotations.some((annotation: {
                item_id: string
            }) => annotation.item_id === result[i].id);
        }
        ////// find rating for result
        const stmt_album_Annotation_Rating_Items = db.prepare(`
            SELECT item_id, rating FROM ${store_server_user_model.annotation}
            WHERE rating > 0 AND item_type='album'
        `);
        const annotations_rating = stmt_album_Annotation_Rating_Items.all();
        for (let i = 0; i < result.length; i++) {
            const albumFile = result[i];
            const matchingAnnotation = annotations_rating.find((annotation: { item_id: string, rating: number }) => annotation.item_id === albumFile.id);
            if (matchingAnnotation)
                albumFile.rating = matchingAnnotation.rating;
            else
                albumFile.rating = 0;
        }
        db.close();
        return result
    }
    public Get_AlbumFiles_Random_Search() {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');

        const rows = db.prepare(`SELECT * FROM ${store_server_user_model.album} ORDER BY RANDOM() LIMIT 18`).all();
        const result: Album[] = []
        rows.forEach((row: Album) => {
            if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
                if (row.embed_art_path.indexOf('mp3') > 0)
                    row.medium_image_url = row.embed_art_path.replace('mp3', 'jpg');
                else if (row.embed_art_path.indexOf('flac') > 0)
                    row.medium_image_url = row.embed_art_path.replace('flac', 'jpg');
                else
                    row.medium_image_url = '../../../resources/img/error_album.jpg';
            }
            const fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/);
            const fileNameWithExtension = fileNameMatch ? fileNameMatch[0] : null;
            const fileNameWithoutExtension = fileNameWithExtension ? fileNameWithExtension.replace(/\.[^.]+$/, '') : null;
            const fileNameWithoutPrefix = fileNameWithoutExtension ? fileNameWithoutExtension.replace(/.*?-\s*/, '') : null;
            if (fileNameWithoutPrefix !== null) {
                row.title = fileNameWithoutPrefix;
            }
            row.album_title = row.title + "<br>" + row.artist;
            row.updated_time = row.updated_at ? moment(row.updated_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
            row.created_time = row.created_at ? moment(row.created_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
            result.push(row);
        });
        ////// find favorite for result
        const stmt_album_Annotation_Starred_Items = db.prepare(`
            SELECT item_id FROM ${store_server_user_model.annotation}
            WHERE starred = 1 AND item_type='album'
        `);
        const annotations = stmt_album_Annotation_Starred_Items.all();
        for (let i = 0; i < result.length; i++) {
            result[i].favorite = !!annotations.some((annotation: {
                item_id: string
            }) => annotation.item_id === result[i].id);
        }
        ////// find rating for result
        const stmt_album_Annotation_Rating_Items = db.prepare(`
            SELECT item_id, rating FROM ${store_server_user_model.annotation}
            WHERE rating > 0 AND item_type='album'
        `);
        const annotations_rating = stmt_album_Annotation_Rating_Items.all();
        for (let i = 0; i < result.length; i++) {
            const albumFile = result[i];
            const matchingAnnotation = annotations_rating.find((annotation: { item_id: string, rating: number }) => annotation.item_id === albumFile.id);
            if (matchingAnnotation)
                albumFile.rating = matchingAnnotation.rating;
            else
                albumFile.rating = 0;
        }
        db.close();
        return result
    }
    public Get_Annotation_Recently_Added() {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const rows = db.prepare(`SELECT * FROM ${store_server_user_model.album} ORDER BY created_at desc LIMIT 18`).all();
        const result: Album[] = []
        rows.forEach((row: Album) => {
            if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
                if (row.embed_art_path.indexOf('mp3') > 0)
                    row.medium_image_url = row.embed_art_path.replace('mp3', 'jpg');
                else if (row.embed_art_path.indexOf('flac') > 0)
                    row.medium_image_url = row.embed_art_path.replace('flac', 'jpg');
                else
                    row.medium_image_url = '../../../resources/img/error_album.jpg';
            }
            const fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/);
            const fileNameWithExtension = fileNameMatch ? fileNameMatch[0] : null;
            const fileNameWithoutExtension = fileNameWithExtension ? fileNameWithExtension.replace(/\.[^.]+$/, '') : null;
            const fileNameWithoutPrefix = fileNameWithoutExtension ? fileNameWithoutExtension.replace(/.*?-\s*/, '') : null;
            if (fileNameWithoutPrefix !== null) {
                row.title = fileNameWithoutPrefix;
            }
            row.album_title = row.title + "<br>" + row.artist;
            row.updated_time = row.updated_at ? moment(row.updated_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
            row.created_time = row.created_at ? moment(row.created_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
            result.push(row);
        });
        ////// find favorite for result
        const stmt_album_Annotation_Starred_Items = db.prepare(`
            SELECT item_id FROM ${store_server_user_model.annotation}
            WHERE starred = 1 AND item_type='album'
        `);
        const annotations = stmt_album_Annotation_Starred_Items.all();
        for (let i = 0; i < result.length; i++) {
            result[i].favorite = !!annotations.some((annotation: {
                item_id: string
            }) => annotation.item_id === result[i].id);
        }
        ////// find rating for result
        const stmt_album_Annotation_Rating_Items = db.prepare(`
            SELECT item_id, rating FROM ${store_server_user_model.annotation}
            WHERE rating > 0 AND item_type='album'
        `);
        const annotations_rating = stmt_album_Annotation_Rating_Items.all();
        for (let i = 0; i < result.length; i++) {
            const albumFile = result[i];
            const matchingAnnotation = annotations_rating.find((annotation: { item_id: string, rating: number }) => annotation.item_id === albumFile.id);
            if (matchingAnnotation)
                albumFile.rating = matchingAnnotation.rating;
            else
                albumFile.rating = 0;
        }
        db.close();
        return result
    }
    public Get_Annotation_Recently_Played() {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const annsMap = new Map();
        const anns = db.prepare(`SELECT * FROM ${store_server_user_model.annotation} WHERE item_type = 'album' ORDER BY play_date desc LIMIT 18`).all();
        anns.forEach((ann: { item_id: any; }) => {
            annsMap.set(ann.item_id, ann); // 使用 item_id 作为键
        });
        const sql = `SELECT a.*, b.play_count 
             FROM ${store_server_user_model.album} a 
             LEFT JOIN ${store_server_user_model.annotation} b ON a.id = b.item_id AND b.item_type = 'album'
             ORDER BY b.play_date desc, a.id desc
             LIMIT 18`;
        const allData = db.prepare(sql).all();
        const result: Album[] = []
        allData.forEach((row: Album) => {
            if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
                if (row.embed_art_path.indexOf('mp3') > 0)
                    row.medium_image_url = row.embed_art_path.replace('mp3', 'jpg');
                else if (row.embed_art_path.indexOf('flac') > 0)
                    row.medium_image_url = row.embed_art_path.replace('flac', 'jpg');
                else
                    row.medium_image_url = '../../../resources/img/error_album.jpg';
            }
            const fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/);
            const fileNameWithExtension = fileNameMatch ? fileNameMatch[0] : null;
            const fileNameWithoutExtension = fileNameWithExtension ? fileNameWithExtension.replace(/\.[^.]+$/, '') : null;
            const fileNameWithoutPrefix = fileNameWithoutExtension ? fileNameWithoutExtension.replace(/.*?-\s*/, '') : null;
            if (fileNameWithoutPrefix !== null) {
                row.title = fileNameWithoutPrefix;
            }
            row.album_title = row.title + "<br>" + row.artist;
            row.updated_time = row.updated_at ? moment(row.updated_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
            row.created_time = row.created_at ? moment(row.created_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
            result.push(row);
        });
        ////// find favorite for result
        const stmt_album_Annotation_Starred_Items = db.prepare(`
            SELECT item_id FROM ${store_server_user_model.annotation}
            WHERE starred = 1 AND item_type='album'
        `);
        const annotations = stmt_album_Annotation_Starred_Items.all();
        for (let i = 0; i < result.length; i++) {
            result[i].favorite = !!annotations.some((annotation: {
                item_id: string
            }) => annotation.item_id === result[i].id);
        }
        ////// find rating for result
        const stmt_album_Annotation_Rating_Items = db.prepare(`
            SELECT item_id, rating FROM ${store_server_user_model.annotation}
            WHERE rating > 0 AND item_type='album'
        `);
        const annotations_rating = stmt_album_Annotation_Rating_Items.all();
        for (let i = 0; i < result.length; i++) {
            const albumFile = result[i];
            const matchingAnnotation = annotations_rating.find((annotation: { item_id: string, rating: number }) => annotation.item_id === albumFile.id);
            if (matchingAnnotation)
                albumFile.rating = matchingAnnotation.rating;
            else
                albumFile.rating = 0;
        }
        db.close();
        return result
    }
}
import {app, BrowserWindow, screen} from 'electron'
const path = require('path');
import fs from "fs";
import {IAudioMetadata, IPicture, parseFile, selectCover} from 'music-metadata';
import { autoUpdater } from 'electron-updater';

async function createWindow() {
    const win = await new BrowserWindow({
        width: 1220,
        height: 765,
        minWidth: 1160,
        minHeight: 765,
        frame:false,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
    })
    win.setMenu(null)
    win.setMaximizable(false)
    win.webContents.openDevTools({
        mode:'detach'
    });
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    if (process.argv[2]) {
        win.loadURL(process.argv[2])
    } else {
        win.loadFile('index.html')
    }

    const electron = require('electron')
    const ipc = electron.ipcMain
    let originalBounds: any = null;
    let isFullscreen = false;
    ipc.on('window-min', function () {
        win.minimize();
    });
    ipc.on('window-max', function () {
        if (isFullscreen) {
            win.setBounds(originalBounds);
            originalBounds = null;
            isFullscreen = false;
            win.restore();
        } else if (win.isMaximized()) {
            isFullscreen = false;
            win.restore();
        } else {
            isFullscreen = false;
            win.maximize();
        }
    });
    ipc.on('window-fullscreen', function () {
        if (isFullscreen) {
            win.setBounds(originalBounds);
            originalBounds = null;
            isFullscreen = false;
        } else {
            win.restore();
            originalBounds = win.getBounds();

            const cursorScreenPoint = screen.getCursorScreenPoint();
            const currentDisplay = screen.getDisplayNearestPoint(cursorScreenPoint);
            const { width, height, x, y } = currentDisplay.bounds;

            win.setBounds({
                x: x - 3,
                y: y - 3,
                width: width + 6,
                height: height + 6,
            });
            isFullscreen = true;
        }
    });
    ipc.on('window-close', function () {
        win.close();
    })
    ipc.on('window-gc', function () {
        win.webContents.session.flushStorageData();
        setTimeout(clear_session_clearCache, 5000);
    })
    let lastResetTime: number | null = null;
    const RESET_DEBOUNCE_TIME = 6000;
    ipc.on('window-reset-data', function () {
        const currentTime = Date.now();
        if (!lastResetTime || currentTime - lastResetTime >= RESET_DEBOUNCE_TIME) {
            lastResetTime = currentTime;
            win.webContents.loadURL('about:blank');
            if (process.argv[2]) {
                win.loadURL(process.argv[2])
            } else {
                win.loadFile('index.html')
            }
        }
    });
    ipc.on('window-reset-win', function () {
        win.close();
        createWindow();
    })
    ipc.on('window-reset-all', () => {
        // app.relaunch();
        app.exit();
    });
    ipc.handle('window-get-memory', async (event) => {
        try { return process.memoryUsage() }catch{ return 0 }
    });

    //////
    let navidrome_db = path.resolve('resources/navidrome.db');
    let nsmusics_db = path.resolve('resources/nsmusics.db');
    const cDriveDbPath_1 = 'C:\\Users\\Public\\Documents\\NSMusicS\\navidrome.db';
    const cDriveDbPath_2 = 'C:\\Users\\Public\\Documents\\NSMusicS\\nsmusics.db';
    const cDriveDbDir = 'C:\\Users\\Public\\Documents\\NSMusicS';
    const ensureDirectoryExists = (dirPath: string) => {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(dirPath)) {
                try {
                    fs.mkdirSync(dirPath, { recursive: true });
                    console.log(`目录 ${dirPath} 已创建`);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            } else {
                resolve();
            }
        });
    };
    const copyIfNotExists = (sourcePath: string, destPath: string) => {
        return new Promise((resolve, reject) => {
            ensureDirectoryExists(cDriveDbDir) // 确保目标文件夹存在
                .then(() => {
                    fs.access(destPath, fs.constants.F_OK, (err) => {
                        if (err) {
                            fs.copyFile(sourcePath, destPath, (copyErr) => {
                                if (copyErr) {
                                    reject(copyErr);
                                } else {
                                    resolve(destPath);
                                }
                            });
                        } else {
                            resolve(destPath);
                        }
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };
    ensureDirectoryExists(cDriveDbDir) // 确保目标文件夹存在
        .then(() => {
            Promise.all([
                copyIfNotExists(navidrome_db, cDriveDbPath_1).then((newPath) => navidrome_db = newPath),
                copyIfNotExists(nsmusics_db, cDriveDbPath_2).then((newPath) => nsmusics_db = newPath)
            ]).catch((err) => {
                console.error('复制文件时出错:', err);
            });
        })
        .catch((err) => {
            console.error('创建目录时出错:', err);
        });
    ipc.handle('window-get-navidrome-db', async (event) => {
        try { return navidrome_db } catch { return '' }
    });
    ipc.handle('window-get-nsmusics-db', async (event) => {
        try { return nsmusics_db } catch { return '' }
    });


    ////// mpv services for win
    const mpvAPI = require('node-mpv');
    let mpv = new mpvAPI({
        audio_only: true,
        auto_restart: true,
        binary: path.resolve("resources/mpv-x86_64-20240623/mpv.exe"),
        debug: true,
        verbose: true
    });
    await mpv.start();
    await mpv.pause();
    let isPlaying = false;
    let isResumeing = false;
    ipc.handle('mpv-load', async (event,filePath) => {
        try {
            await mpv.load(filePath);
            await mpv.play();
            isPlaying = true;
            isResumeing = false;
            return true;
        } catch (error) {
            console.error('Error loading file in mpv:', error);
            return false;
        }
    });
    ipc.handle('mpv-isRunning',  async (event) => {
        return mpv.isRunning();
    });
    ipc.handle('mpv-isPlaying',  async (event) => {
        return isPlaying;
    });
    ipc.handle('mpv-isResumeing',  async (event) => {
        return isResumeing;
    });
    ipc.handle('mpv-play',  async (event) => {
        await mpv.resume();
        isPlaying = true;
        isResumeing = false;
    });
    ipc.handle('mpv-pause',  async (event) => {
        await mpv.pause();
        isPlaying = false;
        isResumeing = true;
    });
    ipc.handle('mpv-stopped', async (event,volume) => {
        await mpv.pause();
    });
    ipc.handle('mpv-get-duration', async (event) => {
        try { return await mpv.getDuration() }catch{ return 0 }
    });
    ipc.handle('mpv-get-time-pos', async (event) => {
        try { return await mpv.getTimePosition() }catch{ return 0 }
    });
    ipc.handle('mpv-set-time-pos', async (event,timePos) => {
        await mpv.resume();
        isPlaying = true;
        isResumeing = false;
        await mpv.seek(timePos,"absolute")
    });
    ipc.handle('mpv-set-volume', async (event,volume) => {
        await mpv.volume(volume)
    });
    mpv.on('stopped', () => {
        win.webContents.send("mpv-stopped", true);
    });

    ////// music-metadata
    function getUniqueId_Media() {
        const db = require('better-sqlite3')(navidrome_db);
        db.pragma('journal_mode = WAL');
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4().replace(/-/g, '');
        while (db.prepare(`SELECT COUNT(*) FROM media_file WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4().replace(/-/g, '');
        }
        return id;
    }
    function getUniqueId_Album() {
        const db = require('better-sqlite3')(navidrome_db);
        db.pragma('journal_mode = WAL');
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4().replace(/-/g, '');
        while (db.prepare(`SELECT COUNT(*) FROM album WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4().replace(/-/g, '');
        }
        return id;
    }
    function getUniqueId_Artist() {
        const db = require('better-sqlite3')(navidrome_db);
        db.pragma('journal_mode = WAL');
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4().replace(/-/g, '');
        while (db.prepare(`SELECT COUNT(*) FROM artist WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4().replace(/-/g, '');
        }
        return id;
    }
    function getCurrentDateTime() {
        return new Date().toLocaleString(
            'zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }
        ).replace(/\//g, '-');
    }
    function walkDirectory(directory:any){
        let files:any[] = [];
        const walkSync = (dir:any) => {
            fs.readdirSync(dir).forEach((file:any) => {
                const filePath = path.join(dir, file);
                if (fs.statSync(filePath).isDirectory()) {
                    walkSync(filePath);
                } else if (filePath.endsWith('.mp3') || filePath.endsWith('.flac')) {
                    files.push(filePath);
                }
            });
        };
        walkSync(directory);
        return files;
    }
    function insertData(db:any, table:any, data_old:any) {
        if (Object.keys(data_old).length === 0) return;
        let data = { ...data_old };
        if (table === 'artist' && data.hasOwnProperty('albums'))
            delete data.albums;
        if (table === 'album' && data.hasOwnProperty('media'))
            delete data.media;
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data).map(value => {
            if (typeof value === 'object' && value !== null && 'id' in value) {
                return value.id;
            }
            return String(value);
        });
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${columns.split(', ').map(() => '?').join(', ')})`;
        const stmt = db.prepare(sql);
        try {
            const result = stmt.run(values);
            console.log(`Inserted ${result.changes} row(s)`);
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }
    function isMediaExists(db:any, path:any) {
        const sql = `SELECT COUNT(*) FROM media_file WHERE path = ?`;
        const result = db.prepare(sql).get(path);
        return result["COUNT(*)"] > 0;
    }
    function getMediaExists(db:any, path:any) {
        const sql = `SELECT id FROM media_file WHERE path = ?`;
        const id = db.prepare(sql).get(path);
        return id;
    }
    function isAlbumExists(db:any, album_name:any, album_artist:any) {
        const sql = `SELECT COUNT(*) FROM album WHERE name = ? AND artist = ?`;
        const result = db.prepare(sql).get(album_name,album_artist);
        return result["COUNT(*)"] > 0;
    }
    function getAlbumExists(db:any, album_name:any, album_artist:any) {
        const sql = `SELECT id FROM album WHERE name = ? AND artist = ?`;
        const id = db.prepare(sql).get(album_name,album_artist);
        return id;
    }
    function isArtistExists(db:any, artist_name:any) {
        const sql = `SELECT COUNT(*) FROM artist WHERE name = ?`;
        const result = db.prepare(sql).get(artist_name);
        return result["COUNT(*)"] > 0;
    }
    function getArtistExists(db:any, artist_name:any) {
        const sql = `SELECT id FROM artist WHERE name = ?`;
        const id = db.prepare(sql).get(artist_name);
        return id;
    }
    function getCommentString(common:any) {
        if (!common) {
            throw new Error("common object is undefined");
        }
        if (!common.comment) {
            common.comment = [];
        } else if (!Array.isArray(common.comment)) {
            common.comment = [common.comment];
        }
        return common.comment.join("");
    }
    function getLyricsString(common) {
        if (!common) {
            throw new Error("common object is undefined");
        }
        if (!common.lyrics) {
            common.lyrics = [];
        } else if (!Array.isArray(common.lyrics)) {
            common.lyrics = [common.lyrics];
        }
        return common.lyrics.map(lyric => lyric.text).join("");
    }
    let percentage = 0;
    async function Set_ReadLocalMusicInfo_Add_LocalSqlite(directoryPath: any[]) {
        percentage = 0;
        let directories: any[] = []
        directoryPath.forEach((_path) => {
            directories.push(
                walkDirectory(_path)
            )
        })
        percentage = 10;
        const startTime = Date.now();
        const startPercentage = 10;
        const interval_1 = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            const progress = elapsedTime / 3000;
            percentage = startPercentage + (80 - startPercentage) * progress;
            if (percentage >= 80) {
                clearInterval(interval_1);
                percentage = 80;
                const startTime2 = Date.now();
                const interval_2 = setInterval(() => {
                    const currentTime2 = Date.now();
                    const elapsedTime2 = currentTime2 - startTime2;
                    const progress2 = elapsedTime2 / 3000;
                    percentage = 80 + (95 - 80) * progress2;
                    if (percentage >= 95) {
                        clearInterval(interval_2);
                        percentage = 95;
                    }
                }, 50);
            }
        }, 50);

        let resultArray = [];
        let allCommons: any[] = [];
        for (const directory of directories) {
            for (const _path of directory) {
                try {
                    const metadata = await parseFile(_path);
                    allCommons.push({ metadata, _path });
                } catch (e) {
                    console.error(e)
                    const metadata: any = undefined
                    allCommons.push({ metadata, _path });
                }
            }
        }

        const artistMap = new Map();
        const albumMap = new Map();
        const processChunk = (chunk) => {
            for (const { metadata, _path } of chunk) {
                try {
                    if (metadata === null || metadata === undefined || metadata.common === null || metadata.common === undefined) {
                        let artistName = '';
                        let songName = '';
                        const fileName = _path.split('/').pop().split('\\').pop();
                        const fileNameWithoutExtension = fileName ? fileName.substring(0, fileName.lastIndexOf('.')) : '';
                        if (fileNameWithoutExtension.includes(' - ')) {
                            const parts = fileNameWithoutExtension.split(' - ');
                            artistName = parts[0] || "null";
                            songName = parts[1] || "null";
                        } else {
                            artistName = "null";
                            songName = fileNameWithoutExtension || "null";
                        }
                        const artistId = artistName;
                        const randomAlbumId = Math.floor(10000 + Math.random() * 90000);
                        const albumId = `${artistName}-${randomAlbumId}`;

                        if (!artistMap.has(artistId)) {
                            const artist = {
                                id: getUniqueId_Artist(),
                                name: artistName,
                                album_count: 0,
                                full_text: '',
                                order_artist_name: '',
                                sort_artist_name: '',
                                song_count: 0,
                                size: 0,
                                mbz_artist_id: '',
                                biography: '',
                                small_image_url: '',
                                medium_image_url: '',
                                large_image_url: '',
                                similar_artists: '',
                                external_url: '',
                                external_info_updated_at: '',
                            };
                            artistMap.set(artistId, artist);
                        }

                        if (!albumMap.has(albumId)) {
                            const artistObj = artistMap.get(artistId);
                            const album = {
                                id: getUniqueId_Album(),
                                name: 'null',
                                artist_id: artistObj.id,
                                embed_art_path: _path,
                                artist: artistName,
                                album_artist: 'null-' + artistName,
                                min_year: '',
                                max_year: '',
                                compilation: 0,
                                song_count: 0,
                                duration: 0,
                                genre: '',
                                created_at: getCurrentDateTime(),
                                updated_at: getCurrentDateTime(),
                                full_text: '',
                                album_artist_id: '',
                                order_album_name: '',
                                order_album_artist_name: '',
                                sort_album_name: '',
                                sort_artist_name: '',
                                sort_album_artist_name: '',
                                size: 0,
                                mbz_album_id: '',
                                mbz_album_artist_id: '',
                                mbz_album_type: '',
                                mbz_album_comment: '',
                                catalog_num: 0,
                                comment: '',
                                all_artist_ids: '',
                                image_files: '',
                                paths: '',
                                description: '',
                                small_image_url: '',
                                medium_image_url: '',
                                large_image_url: '',
                                external_url: '',
                                external_info_updated_at: ''
                            };
                            albumMap.set(albumId, album);
                            artistObj.album_count++;
                        }

                        const albumObj = albumMap.get(albumId);
                        const media = {
                            id: getUniqueId_Media(),
                            path: _path,
                            title: songName,
                            artist: artistName,
                            album: '',
                            artist_id: albumObj.artist_id,
                            album_id: albumObj.id,
                            album_artist: artistName,
                            has_cover_art: 0,
                            track_number: 0,
                            disc_number: 0,
                            year: '',
                            size: 0,
                            suffix: '',
                            duration: 0,
                            bit_rate: 0,
                            genre: '',
                            compilation: 0,
                            created_at: getCurrentDateTime(),
                            updated_at: getCurrentDateTime(),
                            full_text: '',
                            album_artist_id: '',
                            order_album_name: '',
                            order_album_artist_name: '',
                            order_artist_name: '',
                            sort_album_name: '',
                            sort_artist_name: '',
                            sort_album_artist_name: '',
                            sort_title: '',
                            disc_subtitle: '',
                            mbz_track_id: '',
                            mbz_album_id: '',
                            mbz_artist_id: '',
                            mbz_album_artist_id: '',
                            mbz_album_type: '',
                            mbz_album_comment: '',
                            catalog_num: 0,
                            comment: '',
                            lyrics: '',
                            bpm: 0,
                            channels: 0,
                            order_title: '',
                            mbz_release_track_id: '',
                            rg_album_gain: 0,
                            rg_album_peak: 0,
                            rg_track_gain: 0,
                            rg_track_peak: 0,
                        };

                        albumObj.media = albumObj.media || [];
                        albumObj.media.push(media);
                        albumObj.song_count++;
                        albumObj.duration += 0;

                        const artistObj = artistMap.get(artistId);
                        artistObj.song_count++;
                    }
                    else {
                        const artistName = metadata.common.artist || "undefined";
                        const albumName = metadata.common.album || "undefined";
                        const artistId = artistName;
                        const albumId = `${artistName}-${albumName}`;

                        if (!artistMap.has(artistId)) {
                            const artist = {
                                id: getUniqueId_Artist(),
                                name: artistName,
                                album_count: 0,
                                full_text: '',
                                order_artist_name: '',
                                sort_artist_name: metadata.common.artistsort || '',
                                song_count: 0,
                                size: 0,
                                mbz_artist_id: '',
                                biography: '',
                                small_image_url: '',
                                medium_image_url: '',
                                large_image_url: '',
                                similar_artists: '',
                                external_url: '',
                                external_info_updated_at: '',
                            };
                            artistMap.set(artistId, artist);
                        }

                        if (!albumMap.has(albumId)) {
                            const artistObj = artistMap.get(artistId);
                            const album = {
                                id: getUniqueId_Album(),
                                name: albumName,
                                artist_id: artistObj.id,
                                embed_art_path: _path,
                                artist: artistName,
                                album_artist: metadata.common.albumartist || '',
                                min_year: metadata.common.year || '',
                                max_year: metadata.common.year || '',
                                compilation: 0,
                                song_count: 0,
                                duration: 0,
                                genre: '',
                                created_at: getCurrentDateTime(),
                                updated_at: getCurrentDateTime(),
                                full_text: '',
                                album_artist_id: '',
                                order_album_name: '',
                                order_album_artist_name: '',
                                sort_album_name: metadata.common.albumsort || '',
                                sort_artist_name: metadata.common.artistsort || '',
                                sort_album_artist_name: metadata.common.albumartistsort || '',
                                size: 0,
                                mbz_album_id: '',
                                mbz_album_artist_id: '',
                                mbz_album_type: '',
                                mbz_album_comment: '',
                                catalog_num: metadata.common.catalognumber || '',
                                comment: getCommentString(metadata.common) || '',
                                all_artist_ids: '',
                                image_files: '',
                                paths: '',
                                description: metadata.common.description || '',
                                small_image_url: '',
                                medium_image_url: '',
                                large_image_url: '',
                                external_url: '',
                                external_info_updated_at: ''
                            };
                            albumMap.set(albumId, album);
                            artistObj.album_count++;
                        }

                        const albumObj = albumMap.get(albumId);
                        const media = {
                            id: getUniqueId_Media(),
                            path: _path,
                            title: metadata.common.title || '',
                            artist: artistName,
                            album: albumName,
                            artist_id: albumObj.artist_id,
                            album_id: albumObj.id,
                            album_artist: artistName,
                            has_cover_art: 0,
                            track_number: metadata.common.track || 0,
                            disc_number: metadata.common.disk || 0,
                            year: metadata.common.year || '',
                            size: 0,
                            suffix: '',
                            duration: metadata.format.duration || 0,
                            bit_rate: metadata.format.bitrate || 0,
                            genre: '',
                            compilation: 0,
                            created_at: getCurrentDateTime(),
                            updated_at: getCurrentDateTime(),
                            full_text: metadata.common.title || '',
                            album_artist_id: '',
                            order_album_name: '',
                            order_album_artist_name: '',
                            order_artist_name: '',
                            sort_album_name: metadata.common.albumsort || '',
                            sort_artist_name: metadata.common.artistsort || '',
                            sort_album_artist_name: metadata.common.albumartistsort || '',
                            sort_title: metadata.common.titlesort || '',
                            disc_subtitle: metadata.common.discsubtitle || '',
                            mbz_track_id: '',
                            mbz_album_id: '',
                            mbz_artist_id: '',
                            mbz_album_artist_id: '',
                            mbz_album_type: '',
                            mbz_album_comment: '',
                            catalog_num: metadata.common.catalognumber || '',
                            comment: getCommentString(metadata.common) || '',
                            lyrics: getLyricsString(metadata.common) || '',
                            bpm: 0,
                            channels: 0,
                            order_title: '',
                            mbz_release_track_id: '',
                            rg_album_gain: 0,
                            rg_album_peak: 0,
                            rg_track_gain: 0,
                            rg_track_peak: 0,
                        };

                        albumObj.media = albumObj.media || [];
                        albumObj.media.push(media);
                        albumObj.song_count++;
                        albumObj.duration += metadata.format.duration || 0;
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        };

        const chunkSize = 10;
        for (let i = 0; i < allCommons.length; i += chunkSize) {
            const chunk = allCommons.slice(i, i + chunkSize);
            processChunk(chunk);
            setImmediate(() => { }); // 让出事件循环
        }

        resultArray = Array.from(artistMap.values()).map(artist => {
            return {
                artist: {
                    ...artist,
                    albums: Array.from(albumMap.values())
                        .filter(album => album.artist_id === artist.id)
                        .map(album => ({
                            ...album,
                            media: album.media
                        }))
                }
            };
        });
        resultArray.forEach(music => {
            let song_count = 0;
            music.artist.albums.forEach((album: any) => {
                album.media.forEach((media: any) => {
                    song_count++;
                })
            })
            music.artist.song_count = song_count;
        })

        const db = require('better-sqlite3')(navidrome_db);
        db.pragma('journal_mode = WAL');
        resultArray.forEach(music => {
            if (!isArtistExists(db, music.artist.name)) {
                insertData(db, 'artist', music.artist);
            } else {
                music.artist.id = getArtistExists(db, music.artist.name);
                music.artist.albums.forEach((album: any) => {
                    album.artist_id = music.artist.id;
                    album.media.forEach((media: any) => {
                        media.artist_id = music.artist.id;
                    })
                })
            }
        });
        resultArray.forEach(music => {
            music.artist.albums.forEach((album: any) => {
                if (!isAlbumExists(db, album.name, album.artist)) {
                    insertData(db, 'album', album);
                    album.media.forEach((media: any) => {
                        if (!isMediaExists(db, media.path)) {
                            insertData(db, 'media_file', media);
                        } else {
                            media.id = getMediaExists(db, media.path)
                        }
                    });
                } else {
                    album.id = getAlbumExists(db, album.name, album.artist);
                    album.media.forEach((media: any) => {
                        media.album_id = album.id;
                    })
                }
            });
        });
        db.close();
    }
    ipc.handle('metadata-get-directory-filePath',  async (event,directoryPath: any[]) => {
        console.log(directoryPath)
        try {
            await Set_ReadLocalMusicInfo_Add_LocalSqlite(directoryPath)
            return true;
        }catch (e) {
            console.error(e);
            return false;
        }
    });
    ipc.handle('metadata-get-directory-filePath-duration', async (event) => {
        try { return percentage }catch{ return 0 }
    });
    ipc.handle('metadata-get-data',  async (event,filePath) => {
        return await parseFile(filePath)
    });
    ipc.handle('metadata-lyrics',  async (event,filePath) => {
        const musicMetadata = require('music-metadata');
        const metadata = await musicMetadata.parseBlob(filePath);
        if(metadata != null && metadata != undefined) {
            if (metadata.common.lyrics != null && metadata.common.lyrics.length > 0) {
                return metadata.common.lyrics
            } else {
                return null
            }
        }else
            return null
    });
    ipc.handle('metadata-picture',  async (event,filePath) => {
        const {common} = await parseFile(filePath);
        if(common.picture != null && common.picture.length > 0){
            return common.picture[0]
        } else {
            return null
        }
    });
    ipc.handle('library-select-folder', async (event) => {
        const { dialog } = require('electron');
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'],
        });
        if (result.canceled) {
            return null;
        } else {
            return result.filePaths[0];
        }
    });
}

app.whenReady().then(() => {
    createWindow(); 

    const devInnerHeight: number = 1080.0;
    const devDevicePixelRatio: number = 1.0;
    const devScaleFactor: number = 1.3;
    const scaleFactor: number = require('electron').screen.getPrimaryDisplay().scaleFactor;
    const zoomFactor: number = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor);
    require('electron').webFrame.setZoomFactor(zoomFactor);
})

const { session } = require('electron');
function clear_session_clearCache() {
    session.defaultSession.clearCache();
    require("v8").setFlagsFromString("--expose_gc");
    global.gc = require("vm").runInNewContext("gc");
}

app.on('ready', () => {
    setTimeout(clear_session_clearCache, 5000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

  
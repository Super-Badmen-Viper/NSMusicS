interface Annotation {
  ann_id: string; // 注释的唯一标识符
  user_id: string; // 用户的唯一标识符
  item_id: string; // 项目的唯一标识符 (artist_id，media_id，album_id)
  item_type: string; // 项目的类型
  play_count?: string; // 播放次数，可选属性
  play_date?: string; // 播放日期，可选属性
  rating?: number; // 评分，可选属性
  starred: boolean; // 是否标记为星标
  starred_at?: string; // 标记为星标的日期和时间，可选属性
}
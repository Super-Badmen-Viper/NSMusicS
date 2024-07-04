interface Play_List {
    label: string,
    value: string,

    id: string; // 播放列表的唯一标识符
    name: string; // 播放列表的名称
    comment: string; // 播放列表的注释
    duration: number; // 播放列表的总时长（以秒为单位）
    song_count: number; // 播放列表中包含的歌曲数量
    public: number; // 播放列表是否公开可见
    created_at: string; // 播放列表的创建日期和时间，可以为 null
    updated_at: string; // 播放列表的最后更新日期和时间，可以为 null
    path: string; // 播放列表的路径
    sync: number; // 播放列表是否与其他设备同步
    size: number; // 播放列表的大小（以字节为单位）
    rules: string | null; // 播放列表的规则，可以为 null
    evaluated_at: string; // 播放列表的评估日期和时间，可以为 null
    owner_id: string; // 播放列表的所有者的唯一标识符
  }
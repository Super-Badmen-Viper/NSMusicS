interface Play_List {
    label: string,
    value: string,

    id: string;
    name: string;
    comment: string;
    duration: number;
    song_count: number;
    public: number;
    created_at: string;
    updated_at: string;
    path: string;
    sync: number;
    size: number;
    rules: string | null;
    evaluated_at: string;
    owner_id: string;
  }
#!/bin/bash
export MongoDB_DATA_VOLUME="/Users/user/NSMusicS-GO"
export SQLITE_DATA_VOLUME="/Users/user/NSMusicS-GO"

export MUSIC_DATA_VOLUME="/Users/user/0_Music"

data_dirs=("$MongoDB_DATA_VOLUME" "$SQLITE_DATA_VOLUME" "$Music_DATA_VOLUME")
for dir in "${data_dirs[@]}"; do
if [ ! -d "$dir" ]; then
mkdir -p "$dir"
fi
done

docker-compose up -d
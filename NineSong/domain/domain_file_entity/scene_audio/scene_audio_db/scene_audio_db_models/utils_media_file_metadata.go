package scene_audio_db_models

import (
	"go.mongodb.org/mongo-driver/bson"
	"time"
)

func (m *MediaFileMetadata) ToUpdateDoc() bson.M {
	data, _ := bson.Marshal(m)
	var raw bson.M
	_ = bson.Unmarshal(data, &raw)

	delete(raw, "_id")
	delete(raw, "created_at")

	raw["medium_image_url"] = m.MediumImageURL
	raw["updated_at"] = time.Now().UTC()

	return bson.M{"$set": raw}
}

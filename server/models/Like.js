// models/Like.js
import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    entity_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    entity_type: {
        type: String,
        enum: ['post', 'comment'],
        required: true
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'dislike'],
        required: true
    },
    publish_date: {
        type: Date,
        default: Date.now
    }
});

const Like = mongoose.model('Like', likeSchema);

export default Like;

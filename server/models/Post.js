import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    publish_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    content: {
        type: String,
        required: true
    },
    // Additional fields for images can be added here
});

const Post = mongoose.model('Post', postSchema);

export default Post;
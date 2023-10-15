// models/PostCategory.js
import mongoose from 'mongoose';

const postCategorySchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const PostCategory = mongoose.model('PostCategory', postCategorySchema);

export default PostCategory;

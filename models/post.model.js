import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    picture: {
        type: String,
        required: [true, 'Picture is required']
    },
    imageId: {
        type: String,
        required: [true, 'ImageKit file ID is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;

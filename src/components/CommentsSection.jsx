import { useState, useEffect } from 'react';
import axios, {getCurrentFirstName} from '../utils/auth.jsx';
import './CommentsSection.css';
import { getCurrentUserId } from '../utils/auth.jsx';

// eslint-disable-next-line react/prop-types
function CommentsSection({ productId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        loadComments();
    }, [productId]);

    const currentUserId = getCurrentUserId();

    const loadComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/comments/product/${productId}`);
            setComments(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading comments:', err);
            setError('Error loading comments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            alert('The comment cannot be empty');
            return;
        }

        try {
            setSubmitting(true);
            const response = await axios.post(`/api/comments`, {
                productId: productId,
                commentText: newComment
            });

            setComments([response.data, ...comments]);
            setNewComment('');
            setError(null);
        } catch (err) {
            console.error('Error submitting comment:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                alert('You must be authorized to add comments');
            } else {
                alert('Error adding comment');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (commentId) => {
        if (!editText.trim()) {
            alert('The comment cannot be empty');
            return;
        }

        try {
            const response = await axios.put(`/api/comments/${commentId}`, {
                productId: productId,
                commentText: editText
            });

            setComments(comments.map(c =>
                c.id === commentId ? response.data : c
            ));
            setEditingId(null);
            setEditText('');
        } catch (err) {
            console.error('Error editing comment:', err);
            alert('Error editing comment');
        }
    };

    const handleDelete = async (commentId) => {
        if (!globalThis.confirm('Delete comment?')) {
            return;
        }

        try {
            await axios.delete(`/api/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            console.error('Error deleting comment:', err);
            alert('Error deleting comment');
        }
    };

    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditText(comment.commentText);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="comments-loading">Comments loading...</div>;
    }
    return (
        <div className="comments-section">
            <h3 className="comments-title">Comments ({comments.length})</h3>

            <form className="comment-form" onSubmit={handleSubmit}>
            <textarea
                className="comment-textarea"
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                maxLength={1000}
            />
                <div className="comment-form-footer">
                <span className="comment-counter">
                    {newComment.length}/1000
                </span>
                    <button
                        type="submit"
                        className="comment-submit-btn"
                        disabled={submitting || !newComment.trim()}
                    >
                        {submitting ? 'Sending...' : 'Sent'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="comments-error">{error}</div>
            )}

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">There are no comments yet. Be the first!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            {editingId === comment.id ? (
                                <div className="comment-edit">
                                <textarea
                                    className="comment-textarea"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    rows={3}
                                    maxLength={1000}
                                />
                                    <div className="comment-edit-actions">
                                        <button
                                            className="comment-save-btn"
                                            onClick={() => handleEdit(comment.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="comment-cancel-btn"
                                            onClick={cancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="comment-header">
                                    <span className="comment-user">
                                        {getCurrentFirstName() ? getCurrentFirstName() : `User #${comment.userId}`}
                                    </span>
                                    <span className="comment-date">
                                        {formatDate(comment.createdDate)}
                                    </span>
                                    </div>
                                    <p className="comment-text">{comment.commentText}</p>

                                    {currentUserId && parseInt(currentUserId) === comment.userId && (
                                        <div className="comment-actions">
                                            <button
                                                className="comment-edit-btn"
                                                onClick={() => startEdit(comment)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="comment-delete-btn"
                                                onClick={() => handleDelete(comment.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentsSection;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsPage.css';
import { urlConfig } from '../../config';

function DetailsPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [gift, setGift] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hardcodedComments = [
    { author: "John Doe", comment: "I would like this!" },
    { author: "Jane Smith", comment: "Just DMed you." },
    { author: "Alice Johnson", comment: "I will take it if it's still available." },
    { author: "Mike Brown", comment: "This is a good one!" },
    { author: "Sarah Wilson", comment: "My family can use one. DM me if it is still available. Thank you!" }
  ];

  useEffect(() => {
    const authenticationToken = sessionStorage.getItem('auth-token');
    if (!authenticationToken) {
      navigate('/app/login');
    }

    const fetchGiftDetails = async () => {
      try {
        const giftUrl = `${urlConfig.backendUrl}/api/gifts/${productId}`;
        const response = await fetch(giftUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGift(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsUrl = `${urlConfig.backendUrl}/api/gifts/${productId}/comments`;
        const response = await fetch(commentsUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data.comments.length ? data.comments : hardcodedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments(hardcodedComments);
      }
    };

    fetchGiftDetails();
    fetchComments();
    window.scrollTo(0, 0);
  }, [productId, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);  // assuming the timestamp is in seconds
    return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!gift) return <div>Gift not found</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
      <div className="card product-details-card">
        <div className="card-header text-white">
          <h2 className="details-title">{gift.name}</h2>
        </div>
        <div className="card-body">
          <div className="image-placeholder-large">
            {gift.image ? (
              <img src={gift.image} alt={gift.name} className="product-image-large" />
            ) : (
              <div className="no-image-available-large">No Image Available</div>
            )}
          </div>
          <p><strong>Category:</strong> {gift.category}</p>
          <p><strong>Condition:</strong> {gift.condition}</p>
          <p><strong>Date Added:</strong> {formatDate(gift.dateAdded)}</p>
          <p><strong>Age (Years):</strong> {gift.age}</p>
          <p><strong>Description:</strong> {gift.description}</p>
        </div>
      </div>
      <div className="comments-section mt-4">
        <h3 className="mb-3">Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <p className="comment-author"><strong>{comment.author || 'Unknown Author'}:</strong></p>
                <p className="comment-text">{comment.comment || 'No comment available'}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No comments available.</p>
        )}
      </div>
    </div>
  );
}

export default DetailsPage;

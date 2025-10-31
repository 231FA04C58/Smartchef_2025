import { useState, useEffect, useRef } from 'react';

const ShareRecipe = ({ recipe }) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  
  if (!recipe || !recipe._id) {
    return null; // Don't render if recipe is missing
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const recipeUrl = `${window.location.origin}/recipe/${recipe._id}`;
  const recipeTitle = recipe.title;
  const recipeDescription = recipe.description || 'Check out this amazing recipe!';

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const text = `Check out this recipe: ${recipeTitle}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(recipeUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const text = `${recipeTitle} - ${recipeUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(recipeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Native Web Share API (mobile)
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipeTitle,
          text: recipeDescription,
          url: recipeUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  return (
    <div className="share-recipe" ref={menuRef}>
      <button 
        className="share-trigger btn btn-outline" 
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        type="button"
      >
        <i className="fas fa-share-alt"></i> Share
      </button>

      <div className={`share-menu ${showMenu ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={(e) => { e.stopPropagation(); nativeShare(); setShowMenu(false); }} className="share-option" type="button">
          <i className="fas fa-share"></i> Share via...
        </button>
        <button onClick={(e) => { e.stopPropagation(); shareOnFacebook(); setShowMenu(false); }} className="share-option facebook" type="button">
          <i className="fab fa-facebook"></i> Facebook
        </button>
        <button onClick={(e) => { e.stopPropagation(); shareOnTwitter(); setShowMenu(false); }} className="share-option twitter" type="button">
          <i className="fab fa-twitter"></i> Twitter
        </button>
        <button onClick={(e) => { e.stopPropagation(); shareOnWhatsApp(); setShowMenu(false); }} className="share-option whatsapp" type="button">
          <i className="fab fa-whatsapp"></i> WhatsApp
        </button>
        <button onClick={(e) => { e.stopPropagation(); copyToClipboard(); }} className="share-option" type="button">
          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
};

export default ShareRecipe;


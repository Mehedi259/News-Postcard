import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Upload, ThumbsUp, MessageCircle, Share2, Globe } from 'lucide-react';

function App() {
  const [headline, setHeadline] = useState('বাড়ি ঘরের পরিবেশ রক্ষার্থে কি কি করা উচিত?');
  const [date, setDate] = useState('১২ এপ্রিল ২০২৬');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [likes, setLikes] = useState('12k');
  const [comments, setComments] = useState('1.2k');
  const [shares, setShares] = useState('500');
  const [footerText, setFooterText] = useState('SKY NEWS.COM');
  
  const postcardRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setThumbnail(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!postcardRef.current) return;
    
    try {
      const dataUrl = await toPng(postcardRef.current, { cacheBust: true, quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'postcard.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      alert('Failed to generate image. Try again.');
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="/logo.png" alt="Logo" className="navbar-logo" />
          <span>Postcard Generator</span>
        </div>
        <button className="btn-primary" onClick={handleDownload}>
          <Download size={20} />
          Export PNG
        </button>
      </nav>

      <main className="main-content">
        {/* Editor Panel */}
        <section className="editor-panel">
          <h2 className="editor-title">Card Settings</h2>
          
          <div className="form-group">
            <label className="form-label">Thumbnail Image</label>
            <div className="image-upload-wrapper">
              {thumbnail ? (
                <img src={thumbnail} className="image-upload-preview" alt="Thumbnail Preview" />
              ) : (
                <>
                  <Upload size={32} style={{ marginBottom: '8px' }} />
                  <span>Click or drag image here</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Headline Text</label>
            <textarea 
              className="form-textarea" 
              value={headline} 
              onChange={e => setHeadline(e.target.value)}
              placeholder="Enter main headline..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input 
              type="text" 
              className="form-input" 
              value={date} 
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="metrics-grid">
            <div className="form-group">
              <label className="form-label">Likes</label>
              <input 
                type="text" 
                className="form-input" 
                value={likes} 
                onChange={e => setLikes(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Comments</label>
              <input 
                type="text" 
                className="form-input" 
                value={comments} 
                onChange={e => setComments(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Shares</label>
              <input 
                type="text" 
                className="form-input" 
                value={shares} 
                onChange={e => setShares(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Footer Brand Text</label>
            <input 
              type="text" 
              className="form-input" 
              value={footerText} 
              onChange={e => setFooterText(e.target.value)}
            />
          </div>
        </section>

        {/* Preview Panel */}
        <section className="preview-area">
          <div className="preview-container-wrapper">
            {/* The Postcard Component */}
            <div className="postcard" ref={postcardRef}>
              <div className="glow-effect"></div>
              
              <div className="postcard-brand-bar">
                <div className="postcard-logo-container">
                  <img src="/logo.png" alt="Logo" className="postcard-logo" />
                </div>
                <div className="postcard-date">{date}</div>
              </div>

              <div className="postcard-image-container">
                {thumbnail ? (
                  <img src={thumbnail} alt="Main" className="postcard-image" />
                ) : (
                  <div style={{ color: '#666', fontSize: '1.5rem' }}>Image Preview</div>
                )}
              </div>

              <div className="postcard-content">
                <h1 className="postcard-headline">{headline}</h1>
                <div className="postcard-button-fake">বিস্তারিত কমেন্ট</div>
              </div>

              <div className="postcard-footer">
                <Globe className="postcard-footer-icon" />
                <span className="postcard-footer-text">{footerText}</span>
              </div>

              <div className="metrics-bar">
                <div className="metric-item">
                  <ThumbsUp size={18} /> {likes}
                </div>
                <div className="metric-item">
                  <MessageCircle size={18} /> {comments}
                </div>
                <div className="metric-item">
                  <Share2 size={18} /> {shares}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

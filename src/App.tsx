import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Upload, ThumbsUp, MessageCircle, Share2, Globe, ChevronDown } from 'lucide-react';

type TemplateType = 'modern' | 'news-red' | 'quote' | 'minimal';

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('news-red');
  const [headline, setHeadline] = useState('আবারও ট্রাম্পকে হ\'ত্যাচেষ্টা রাইফে\'ল, গু\'লি, ম্যাগাজিনসহ গ্রেপ্তার ১');
  const [date, setDate] = useState('৫ আগস্ট, ২০২৬');
  const [category, setCategory] = useState('আন্তর্জাতিক');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [likes, setLikes] = useState('12k');
  const [comments, setComments] = useState('1.2k');
  const [shares, setShares] = useState('500');
  const [footerText, setFooterText] = useState('www.helloomanbangla.com');
  const [bgColor, setBgColor] = useState('#ff2a2a');
  
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
      const dataUrl = await toPng(postcardRef.current, { 
        cacheBust: true, 
        quality: 1, 
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '800px',
          height: '800px',
          margin: '0'
        }
      });
      const link = document.createElement('a');
      link.download = `postcard-${selectedTemplate}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      alert('Failed to generate image. Try again.');
    }
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return (
          <div 
            className="postcard template-modern" 
            ref={postcardRef}
            style={{ background: `radial-gradient(circle at top right, ${bgColor}, #0a0a0a)` }}
          >
            <div className="glow-effect" style={{ background: bgColor }}></div>
            
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
        );

      case 'news-red':
        return (
          <div 
            className="postcard template-news-red" 
            ref={postcardRef}
            style={{ borderTopColor: bgColor, borderBottomColor: bgColor }}
          >
            <div className="top-bar">
              <div className="category" style={{ backgroundColor: bgColor }}>{category}</div>
              <div className="date">{date}</div>
            </div>

            <div className="image-wrapper" style={{ borderColor: bgColor }}>
              {thumbnail ? (
                <img src={thumbnail} alt="News" />
              ) : (
                <span style={{ fontSize: '1.5rem', color: '#888' }}>Upload Thumbnail</span>
              )}
            </div>

            <h1 className="headline">{headline}</h1>

            <div className="button-container">
              <div className="btn-fake" style={{ backgroundColor: bgColor }}>
                বিস্তারিত কমেন্টে
                <ChevronDown size={20} />
              </div>
            </div>

            <div className="footer-bar">
              <div className="footer-url">
                <Globe size={24} /> {footerText}
              </div>
              <img src="/logo.png" alt="Logo" className="footer-logo" />
            </div>
          </div>
        );

      case 'quote':
        return (
          <div 
            className="postcard template-quote" 
            ref={postcardRef}
          >
            <div className="quote-content">
              <h1 className="quote-text">"{headline}"</h1>
              <div className="quote-author">- {footerText}</div>
            </div>

            <div className="image-wrapper">
              {thumbnail ? (
                <img src={thumbnail} alt="Author" />
              ) : (
                <span style={{ fontSize: '1.5rem', color: '#666', marginTop: '4rem' }}>Upload Author Image</span>
              )}
            </div>

            <div className="logo-badge">
              <img src="/logo.png" alt="Logo" />
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div 
            className="postcard template-minimal" 
            ref={postcardRef}
          >
            <div className="image-header">
              {thumbnail ? (
                <img src={thumbnail} alt="Header" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '1.5rem' }}>
                  Upload Header Image
                </div>
              )}
            </div>
            
            <div className="content">
              <div className="category-date">
                <span>{category}</span>
                <span style={{ color: '#888' }}>{date}</span>
              </div>
              
              <h1 className="headline">{headline}</h1>
              
              <div className="footer">
                <img src="/logo.png" alt="Logo" />
                <span>{footerText}</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
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
            <label className="form-label">Template Design</label>
            <select 
              className="form-select"
              value={selectedTemplate}
              onChange={e => setSelectedTemplate(e.target.value as TemplateType)}
            >
              <option value="news-red">News Red (New!)</option>
              <option value="modern">Modern Dark</option>
              <option value="quote">Quote Card</option>
              <option value="minimal">Minimal Light</option>
            </select>
          </div>

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

          <div className="metrics-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <input 
                type="text" 
                className="form-input" 
                value={category} 
                onChange={e => setCategory(e.target.value)}
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
          </div>

          {(selectedTemplate === 'modern') && (
            <div className="metrics-grid">
              <div className="form-group">
                <label className="form-label">Likes</label>
                <input type="text" className="form-input" value={likes} onChange={e => setLikes(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Comments</label>
                <input type="text" className="form-input" value={comments} onChange={e => setComments(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Shares</label>
                <input type="text" className="form-input" value={shares} onChange={e => setShares(e.target.value)} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Theme / Background Color</label>
            <input 
              type="color" 
              className="form-input" 
              value={bgColor} 
              onChange={e => setBgColor(e.target.value)}
              style={{ height: '50px', padding: '0.25rem', cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Footer Brand Text / URL</label>
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
            <div className="preview-scale-wrapper">
              {renderTemplate()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

import React, { useState, useRef } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { 
  Download, Upload, Globe, ChevronDown, Quote, 
  RotateCcw, Copy, Check, Type, 
  Image as ImageIcon, Palette, Share2, ThumbsUp, MessageCircle
} from 'lucide-react';

type TemplateType = 'hello-nabiganj' | 'news-red' | 'modern' | 'quote' | 'elegant' | 'breaking';

// Exact Nabiganj Ribbon Folded Logo
const NabiganjLogo = ({ customLogo, size = 44 }: { customLogo?: string | null; size?: number }) => {
  if (customLogo) {
    return <img src={customLogo} alt="Logo" style={{ width: size, height: size, objectFit: 'contain' }} />;
  }
  return <img src="/reference-logo.png" alt="Logo" style={{ width: size, height: size, objectFit: 'contain' }} />;
};

// Crisp Social Media SVGs
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

function getBengaliToday(): string {
  const bengaliMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBn = (num: number) => num.toString().split('').map(d => bengaliDigits[parseInt(d)] || d).join('');
  
  const now = new Date();
  const day = toBn(now.getDate());
  const month = bengaliMonths[now.getMonth()];
  const year = toBn(now.getFullYear());
  return `${day} ${month} ${year}`;
}

export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('hello-nabiganj');
  const [activeTab, setActiveTab] = useState<'content' | 'photo' | 'brand'>('content');

  // Exact reference default values
  const [headline1, setHeadline1] = useState('নবীগঞ্জে অবৈধ ব্যবসায়ীদের বিরুদ্ধে');
  const [headline1Color, setHeadline1Color] = useState('#ffffff');
  const [headline2, setHeadline2] = useState('তৎপরতার ২৪ ঘণ্টার মধ্যে এসিল্যান্ডের বদলি');
  const [headline2Color, setHeadline2Color] = useState('#ffcb05');
  const [headlineFontSize, setHeadlineFontSize] = useState(30);
  const [date, setDate] = useState('২৯ অক্টোবর ২০২৬');

  // Brand Header
  const [brandName1, setBrandName1] = useState('HELLO');
  const [brandColor1, setBrandColor1] = useState('#e50914');
  const [brandName2, setBrandName2] = useState('NABIGANJ');
  const [brandColor2, setBrandColor2] = useState('#008744');
  const [brandTagline, setBrandTagline] = useState('নবীগঞ্জের কণ্ঠ');
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  // Photo
  const [thumbnail, setThumbnail] = useState<string | null>('/reference-person.jpg');
  const [imageZoom, setImageZoom] = useState(100);
  const [imageOffsetY, setImageOffsetY] = useState(0);
  const [imageOffsetX, setImageOffsetX] = useState(0);

  // CTA & Footer
  const [ctaText, setCtaText] = useState('বিস্তারিত ক্যাপশনে');
  const [ctaBgColor, setCtaBgColor] = useState('#ffcb05');
  const [socialHandle, setSocialHandle] = useState('hellonabiganj');

  // Colors
  const [cardBgColor, setCardBgColor] = useState('#013119');
  const [frameColor, setFrameColor] = useState('#fe0312');
  const [showWorldMap, setShowWorldMap] = useState(true);

  // Legacy template state
  const [category, setCategory] = useState('আন্তর্জাতিক');
  const [likes, setLikes] = useState('12k');
  const [comments, setComments] = useState('1.2k');
  const [shares, setShares] = useState('500');

  // UI state
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const postcardRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result as string);
        setImageZoom(100);
        setImageOffsetY(0);
        setImageOffsetX(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCustomLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleResetToReference = () => {
    setSelectedTemplate('hello-nabiganj');
    setHeadline1('নবীগঞ্জে অবৈধ ব্যবসায়ীদের বিরুদ্ধে');
    setHeadline1Color('#ffffff');
    setHeadline2('তৎপরতার ২৪ ঘণ্টার মধ্যে এসিল্যান্ডের বদলি');
    setHeadline2Color('#ffcb05');
    setHeadlineFontSize(34);
    setDate('২৯ অক্টোবর ২০২৬');
    setBrandName1('HELLO');
    setBrandColor1('#e50914');
    setBrandName2('NABIGANJ');
    setBrandColor2('#008744');
    setBrandTagline('নবীগঞ্জের কণ্ঠ');
    setCustomLogo(null);
    setThumbnail('/reference-person.jpg');
    setImageZoom(100);
    setImageOffsetY(0);
    setImageOffsetX(0);
    setCtaText('বিস্তারিত ক্যাপশনে');
    setCtaBgColor('#ffcb05');
    setSocialHandle('hellonabiganj');
    setCardBgColor('#013119');
    setFrameColor('#fe0312');
    setShowWorldMap(true);
    showToast('অরিজিনাল রেফারেন্স ডিজাইনে রিসেট করা হয়েছে!');
  };

  const handleDownload = async (pixelRatio: number = 2) => {
    if (!postcardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(postcardRef.current, {
        cacheBust: true,
        quality: 1,
        pixelRatio: pixelRatio,
        style: {
          transform: 'none',
          margin: '0',
          width: '800px',
          height: '800px'
        }
      });
      const link = document.createElement('a');
      link.download = `postcard-${socialHandle || 'news'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('পোস্টকার্ড ইমেজ সফলভাবে ডাউনলোড হয়েছে!');
    } catch (err) {
      console.error('Failed to export image', err);
      showToast('ইমেজ ডাউনলোড হতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!postcardRef.current) return;
    try {
      const blob = await toBlob(postcardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        style: {
          transform: 'none',
          margin: '0',
          width: '800px',
          height: '800px'
        }
      });
      if (blob && navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('পোস্টকার্ড ক্লিপবোর্ডে কপি করা হয়েছে! (Ctrl+V দিয়ে পেস্ট করতে পারবেন)');
      }
    } catch (err) {
      console.error('Failed to copy', err);
      showToast('ক্লিপবোর্ডে কপি করা যায়নি, PNG ডাউনলোড করুন।');
    }
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'hello-nabiganj': {
        const isCustomDate = date !== '২৯ অক্টোবর ২০২৬';
        const isCustomCta = ctaText !== 'বিস্তারিত ক্যাপশনে' && ctaText !== '';
        const isCustomHandle = socialHandle !== 'hellonabiganj';
        const isCustomBrand = (brandName1 !== 'HELLO' || brandName2 !== 'NABIGANJ' || brandTagline !== 'নবীগঞ্জের কণ্ঠ' || customLogo !== null);

        return (
          <div 
            className="postcard template-hello-nabiganj" 
            ref={postcardRef}
          >
            {/* 1. Underlying Photo Container (zoomed/panned by user) */}
            <div className="hn-photo-slot">
              {thumbnail ? (
                <img 
                  src={thumbnail} 
                  alt="News Main" 
                  className="hn-photo"
                  style={{
                    transform: `scale(${imageZoom / 100}) translate(${imageOffsetX}px, ${imageOffsetY}px)`
                  }}
                />
              ) : (
                <div className="hn-photo-empty">
                  ছবি আপলোড করুন
                </div>
              )}
            </div>

            {/* 2. Master Template Overlay (authentic borders, sides, map, frame, emblem, CTA, footer) */}
            <img 
              src="/postcard-master-template.png" 
              className="hn-master-overlay" 
              alt="Hello Nabiganj Postcard Frame" 
            />

            {/* 3. Dynamic Headline Section */}
            <div className="hn-headline-area">
              <h1 
                className="hn-headline-1" 
                style={{ color: headline1Color, fontSize: `${headlineFontSize}px` }}
              >
                {headline1}
              </h1>
              <h2 
                className="hn-headline-2" 
                style={{ color: headline2Color, fontSize: `${Math.round(headlineFontSize * 1.13)}px` }}
              >
                {headline2}
              </h2>
            </div>

            {/* 4. Overlays only when user customizes beyond default reference */}
            {customLogo && (
              <div className="hn-custom-emblem">
                <img src={customLogo} alt="Logo" />
              </div>
            )}

            {isCustomBrand && !customLogo && (
              <div className="hn-custom-brand-patch">
                <div className="hn-brand-info">
                  <div className="hn-brand-title">
                    <span style={{ color: brandColor1 }}>{brandName1}</span>
                    <span style={{ color: brandColor2 }}>{brandName2}</span>
                  </div>
                  <div className="hn-brand-tagline">{brandTagline}</div>
                </div>
              </div>
            )}

            {isCustomDate && (
              <div className="hn-custom-date-patch">
                <img src="/calendar-exact.png" alt="Calendar" />
                <span className="separator">|</span>
                <span>{date}</span>
              </div>
            )}

            {isCustomCta && (
              <div className="hn-custom-cta-pill" style={{ backgroundColor: ctaBgColor }}>
                {ctaText}
              </div>
            )}

            {isCustomHandle && (
              <div className="hn-custom-footer-pill" style={{ backgroundColor: frameColor }}>
                <div className="hn-footer-icons">
                  <FacebookIcon />
                  <InstagramIcon />
                  <YoutubeIcon />
                </div>
                <span className="hn-footer-handle">/ {socialHandle}</span>
              </div>
            )}
          </div>
        );
      }

      case 'modern':
        return (
          <div 
            className="postcard template-modern" 
            ref={postcardRef}
            style={{ background: `radial-gradient(circle at top right, ${frameColor}, #0a0a0a)` }}
          >
            <div className="glow-effect" style={{ background: frameColor }}></div>
            <div className="postcard-brand-bar">
              <div className="postcard-logo-container">
                <NabiganjLogo customLogo={customLogo} size={32} />
              </div>
              <div className="postcard-date">{date}</div>
            </div>

            <div className="postcard-image-container">
              {thumbnail ? (
                <img 
                  src={thumbnail} 
                  alt="Main" 
                  className="postcard-image"
                  style={{ transform: `scale(${imageZoom / 100}) translate(${imageOffsetX}px, ${imageOffsetY}px)` }}
                />
              ) : (
                <div style={{ color: '#666', fontSize: '1.5rem' }}>Image Preview</div>
              )}
            </div>

            <div className="postcard-content">
              <h1 className="postcard-headline">{headline1} {headline2}</h1>
              <div className="postcard-button-fake" style={{ borderColor: frameColor }}>{ctaText || 'বিস্তারিত কমেন্ট'}</div>
            </div>

            <div className="postcard-footer">
              <Globe className="postcard-footer-icon" style={{ color: frameColor }} />
              <span className="postcard-footer-text">{socialHandle}</span>
            </div>

            <div className="metrics-bar">
              <div className="metric-item">
                <ThumbsUp size={18} style={{ color: frameColor }} /> {likes}
              </div>
              <div className="metric-item">
                <MessageCircle size={18} style={{ color: frameColor }} /> {comments}
              </div>
              <div className="metric-item">
                <Share2 size={18} style={{ color: frameColor }} /> {shares}
              </div>
            </div>
          </div>
        );

      case 'news-red':
        return (
          <div 
            className="postcard template-news-red" 
            ref={postcardRef}
            style={{ background: `radial-gradient(circle at center, ${frameColor} 0%, #1a1a1a 100%)` }}
          >
            <div className="inner-card">
              <div className="top-bar">
                <div className="category" style={{ backgroundColor: frameColor }}>{category}</div>
                <div className="date">{date}</div>
              </div>

              <div className="image-wrapper" style={{ borderColor: frameColor }}>
                {thumbnail ? (
                  <img 
                    src={thumbnail} 
                    alt="News" 
                    style={{ transform: `scale(${imageZoom / 100}) translate(${imageOffsetX}px, ${imageOffsetY}px)` }}
                  />
                ) : (
                  <span style={{ fontSize: '1.5rem', color: '#888' }}>Upload Thumbnail</span>
                )}
              </div>

              <div className="headline-container">
                <h1 className="headline">{headline1} {headline2}</h1>
              </div>

              <div className="button-container">
                <div className="btn-fake" style={{ backgroundColor: frameColor }}>
                  {ctaText || 'বিস্তারিত কমেন্টে'}
                  <ChevronDown size={20} />
                </div>
              </div>

              <div className="footer-bar">
                <div className="footer-url">
                  <Globe size={24} style={{ color: frameColor }} /> {socialHandle}
                </div>
                <NabiganjLogo customLogo={customLogo} size={36} />
              </div>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className="postcard template-quote" ref={postcardRef}>
            <div className="quote-content">
              <Quote className="quote-icon" size={64} />
              <h1 className="quote-text">"{headline1} {headline2}"</h1>
              <div className="quote-author" style={{ '--primary-color': frameColor } as React.CSSProperties}>
                {socialHandle}
              </div>
            </div>

            <div className="image-wrapper">
              {thumbnail ? (
                <img 
                  src={thumbnail} 
                  alt="Author" 
                  style={{ transform: `scale(${imageZoom / 100}) translate(${imageOffsetX}px, ${imageOffsetY}px)` }}
                />
              ) : (
                <span style={{ fontSize: '1.5rem', color: '#666', marginBottom: '4rem' }}>Upload Author Image</span>
              )}
            </div>

            <div className="logo-badge">
              <NabiganjLogo customLogo={customLogo} size={40} />
            </div>
          </div>
        );

      case 'elegant':
        return (
          <div className="postcard template-elegant" ref={postcardRef}>
            <div className="image-header">
              {thumbnail ? (
                <img 
                  src={thumbnail} 
                  alt="Header" 
                  style={{ transform: `scale(${imageZoom / 100}) translate(${imageOffsetX}px, ${imageOffsetY}px)` }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '1.5rem' }}>
                  Upload Header Image
                </div>
              )}
            </div>
            
            <div className="content">
              <div className="category-date">
                <span className="cat" style={{ color: frameColor }}>{category}</span>
                <span className="dot"></span>
                <span className="dat">{date}</span>
              </div>
              
              <h1 className="headline">{headline1} {headline2}</h1>
              
              <div className="footer">
                <div className="footer-left">
                  <Globe size={24} style={{ color: frameColor }} />
                  <span>{socialHandle}</span>
                </div>
                <NabiganjLogo customLogo={customLogo} size={36} />
              </div>
            </div>
          </div>
        );

      case 'breaking':
        return (
          <div className="postcard template-breaking" ref={postcardRef}>
            <div className="image-bg">
              {thumbnail && (
                <img 
                  src={thumbnail} 
                  alt="Breaking" 
                  style={{ transform: `scale(${imageZoom / 100}) translate(${imageOffsetX}px, ${imageOffsetY}px)` }}
                />
              )}
            </div>
            
            <div className="breaking-badge-wrapper">
              <div className="breaking-badge" style={{ backgroundColor: frameColor }}>
                <span>{category || 'BREAKING NEWS'}</span>
              </div>
            </div>
            
            <div className="content-area">
              <h1 className="headline">{headline1} {headline2}</h1>
              <div className="footer-bar" style={{ borderColor: frameColor }}>
                <span className="footer-text">{socialHandle}</span>
                <NabiganjLogo customLogo={customLogo} size={30} />
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
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <NabiganjLogo customLogo={customLogo} size={36} />
          <div>
            <span style={{ fontWeight: 800 }}>News Postcard</span>
            <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '8px' }}>Hello Nabiganj & TV Template</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            className="btn-secondary" 
            onClick={handleResetToReference} 
            title="রেফারেন্স পোস্টকার্ডে রিসেট করুন"
          >
            <RotateCcw size={16} />
            রেফারেন্স রিসেট
          </button>

          <button 
            className="btn-secondary" 
            onClick={handleCopyToClipboard}
            title="ছবি কপি করুন"
          >
            <Copy size={16} />
            কপি করুন
          </button>

          <button 
            className="btn-primary" 
            onClick={() => handleDownload(2)}
            disabled={isExporting}
          >
            <Download size={18} />
            {isExporting ? 'তৈরি হচ্ছে...' : 'HD ডাউনলোড (PNG)'}
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* Editor Controls Panel */}
        <section className="editor-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h2 className="editor-title" style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>
              পোস্টকার্ড এডিটর
            </h2>
            <span className="control-badge">লাইভ প্রিভিউ</span>
          </div>

          {/* Template Selector */}
          <div className="form-group">
            <label className="form-label">টেমপ্লেট সিলেক্ট করুন</label>
            <select 
              className="form-select"
              value={selectedTemplate}
              onChange={e => setSelectedTemplate(e.target.value as TemplateType)}
            >
              <option value="hello-nabiganj">⭐ Hello Nabiganj (অফিসিয়াল নিউজ পোস্টকার্ড)</option>
              <option value="news-red">News Red (Sky Style)</option>
              <option value="modern">Modern Dark</option>
              <option value="breaking">Breaking News (ব্রেকিং)</option>
              <option value="elegant">Elegant Light</option>
              <option value="quote">Quote Card (উক্তি)</option>
            </select>
          </div>

          {/* Navigation Tabs */}
          <div className="editor-tabs">
            <button 
              className={`editor-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <Type size={16} />
              টেক্সট
            </button>
            <button 
              className={`editor-tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
              onClick={() => setActiveTab('photo')}
            >
              <ImageIcon size={16} />
              ছবি ও পজিশন
            </button>
            <button 
              className={`editor-tab-btn ${activeTab === 'brand' ? 'active' : ''}`}
              onClick={() => setActiveTab('brand')}
            >
              <Palette size={16} />
              ব্র্যান্ড ও কালার
            </button>
          </div>

          {/* TAB 1: Content & Headlines */}
          {activeTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">শিরোনাম ১ম লাইন (সাদা)</label>
                  <input 
                    type="color" 
                    value={headline1Color} 
                    onChange={e => setHeadline1Color(e.target.value)} 
                    className="color-input-native"
                    title="১ম লাইনের রং"
                  />
                </div>
                <textarea 
                  className="form-textarea" 
                  value={headline1} 
                  onChange={e => setHeadline1(e.target.value)}
                  placeholder="১ম লাইনের শিরোনাম..."
                  rows={2}
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">শিরোনাম ২য় লাইন (হলুদ)</label>
                  <input 
                    type="color" 
                    value={headline2Color} 
                    onChange={e => setHeadline2Color(e.target.value)} 
                    className="color-input-native"
                    title="২য় লাইনের রং"
                  />
                </div>
                <textarea 
                  className="form-textarea" 
                  value={headline2} 
                  onChange={e => setHeadline2(e.target.value)}
                  placeholder="২য় লাইনের হাইলাইট শিরোনাম..."
                  rows={2}
                />
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <span>ফন্ট সাইজ</span>
                  <span>{headlineFontSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="22" 
                  max="44" 
                  value={headlineFontSize} 
                  onChange={e => setHeadlineFontSize(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">তারিখ</label>
                  <button 
                    type="button" 
                    onClick={() => setDate(getBengaliToday())}
                    style={{ fontSize: '0.75rem', color: '#d60000', fontWeight: 700 }}
                  >
                    আজকের তারিখ বসান
                  </button>
                </div>
                <input 
                  type="text" 
                  className="form-input" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">বাটন টেক্সট (CTA)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={ctaText} 
                    onChange={e => setCtaText(e.target.value)}
                    placeholder="যেমন: বিস্তারিত ক্যাপশনে"
                  />
                  <input 
                    type="color" 
                    value={ctaBgColor} 
                    onChange={e => setCtaBgColor(e.target.value)} 
                    className="color-input-native"
                    title="বাটন ব্যাকগ্রাউন্ড কালার"
                  />
                </div>
              </div>

              {selectedTemplate !== 'hello-nabiganj' && (
                <>
                  <div className="form-group">
                    <label className="form-label">ক্যাটাগরি / ব্রেকিং ট্যাগ</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={category} 
                      onChange={e => setCategory(e.target.value)}
                    />
                  </div>
                  {selectedTemplate === 'modern' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      <div className="form-group">
                        <label className="form-label">লাইক</label>
                        <input type="text" className="form-input" value={likes} onChange={e => setLikes(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">কমেন্ট</label>
                        <input type="text" className="form-input" value={comments} onChange={e => setComments(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">শেয়ার</label>
                        <input type="text" className="form-input" value={shares} onChange={e => setShares(e.target.value)} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 2: Photo & Position Controls */}
          {activeTab === 'photo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">খবরের মূল ছবি আপলোড করুন</label>
                <div className="image-upload-wrapper">
                  {thumbnail ? (
                    <img src={thumbnail} className="image-upload-preview" alt="Preview" />
                  ) : (
                    <>
                      <Upload size={28} style={{ marginBottom: '6px' }} />
                      <span style={{ fontSize: '0.85rem' }}>ছবি ড্রপ করুন বা ব্রাউজ করুন</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <span>জুম (Zoom)</span>
                  <span>{imageZoom}%</span>
                </div>
                <input 
                  type="range" 
                  min="80" 
                  max="200" 
                  value={imageZoom} 
                  onChange={e => setImageZoom(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <span>উপরে-নিচে পজিশন (Y-Offset)</span>
                  <span>{imageOffsetY}px</span>
                </div>
                <input 
                  type="range" 
                  min="-150" 
                  max="150" 
                  value={imageOffsetY} 
                  onChange={e => setImageOffsetY(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <span>ডানে-বামে পজিশন (X-Offset)</span>
                  <span>{imageOffsetX}px</span>
                </div>
                <input 
                  type="range" 
                  min="-150" 
                  max="150" 
                  value={imageOffsetX} 
                  onChange={e => setImageOffsetX(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <button 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setImageZoom(100); setImageOffsetY(0); setImageOffsetX(0); }}
              >
                ছবি রিসেট (Center & Normal)
              </button>
            </div>
          )}

          {/* TAB 3: Branding & Colors */}
          {activeTab === 'brand' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">চ্যানেল / পেইজ নাম</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>অংশ ১ (লাল)</span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={brandName1} 
                        onChange={e => setBrandName1(e.target.value)}
                      />
                      <input 
                        type="color" 
                        value={brandColor1} 
                        onChange={e => setBrandColor1(e.target.value)} 
                        className="color-input-native"
                      />
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>অংশ ২ (সবুজ)</span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={brandName2} 
                        onChange={e => setBrandName2(e.target.value)}
                      />
                      <input 
                        type="color" 
                        value={brandColor2} 
                        onChange={e => setBrandColor2(e.target.value)} 
                        className="color-input-native"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ট্যাগলাইন (Tagline)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={brandTagline} 
                  onChange={e => setBrandTagline(e.target.value)}
                  placeholder="যেমন: নবীগঞ্জের কণ্ঠ"
                />
              </div>

              <div className="form-group">
                <label className="form-label">সোশ্যাল হ্যান্ডেল (Facebook/Insta/YT)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={socialHandle} 
                  onChange={e => setSocialHandle(e.target.value)}
                  placeholder="hellonabiganj"
                />
              </div>

              <div className="form-group">
                <label className="form-label">কাস্টম লোগো আপলোড (অপশনাল)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: '0.85rem' }} />
                  {customLogo && (
                    <button 
                      type="button" 
                      onClick={() => setCustomLogo(null)}
                      style={{ fontSize: '0.75rem', color: '#d60000', whiteSpace: 'nowrap' }}
                    >
                      ভেক্টর লোগো ফিরিয়ে আনুন
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">বর্ডার ফ্রেম কালার</label>
                  <div className="color-picker-box">
                    <input 
                      type="color" 
                      value={frameColor} 
                      onChange={e => setFrameColor(e.target.value)} 
                      className="color-input-native"
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{frameColor}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">নিচের ব্যাকগ্রাউন্ড কালার</label>
                  <div className="color-picker-box">
                    <input 
                      type="color" 
                      value={cardBgColor} 
                      onChange={e => setCardBgColor(e.target.value)} 
                      className="color-input-native"
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{cardBgColor}</span>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="worldMapCheck"
                  checked={showWorldMap} 
                  onChange={e => setShowWorldMap(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="worldMapCheck" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                  ওয়ার্ল্ড ম্যাপ টেক্সচার প্রদর্শন করুন
                </label>
              </div>
            </div>
          )}

          {/* Quick Resolution Export Buttons */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666' }}>এক্সপোর্ট সাইজ:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                className="btn-secondary" 
                style={{ justifyContent: 'center' }}
                onClick={() => handleDownload(1.35)}
                disabled={isExporting}
              >
                1080p (FB/Insta)
              </button>
              <button 
                className="btn-primary" 
                style={{ justifyContent: 'center' }}
                onClick={() => handleDownload(2)}
                disabled={isExporting}
              >
                1600p (Ultra HD)
              </button>
            </div>
          </div>
        </section>

        {/* Live Preview Area */}
        <section className="preview-area">
          <div className="action-bar-top">
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#374151' }}>
              পোস্টকার্ড প্রিভিউ (1:1 Square)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" onClick={handleResetToReference} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <RotateCcw size={14} /> রেফারেন্স
              </button>
              <button className="btn-secondary" onClick={handleCopyToClipboard} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <Copy size={14} /> কপি
              </button>
            </div>
          </div>

          <div className="preview-container-wrapper">
            <div className="preview-scale-wrapper">
              {renderTemplate()}
            </div>
          </div>
        </section>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-banner">
          <Check size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

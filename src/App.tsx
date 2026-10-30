import React, { useState, useRef, useEffect } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { 
  Download, Upload, Globe, ChevronDown, Quote, 
  Copy, Check, Type, Camera, Pencil, Calendar,
  ZoomIn, Sparkles,
  Share2, ThumbsUp, MessageCircle
} from 'lucide-react';

type TemplateType = 'hello-probash' | 'hello-nabiganj' | 'news-red' | 'modern' | 'quote' | 'elegant' | 'breaking';

// Brand Logo Component supporting Hello Probash and Hello Nabiganj
const BrandLogo = ({ selectedTemplate, customLogo, size = 28 }: { selectedTemplate: TemplateType; customLogo?: string | null; size?: number }) => {
  if (customLogo) {
    return <img src={customLogo} alt="Logo" style={{ width: size, height: size, objectFit: 'contain' }} />;
  }
  if (selectedTemplate === 'hello-probash') {
    return <img src="/hello-probash-logo.png" alt="Hello Probash Logo" style={{ width: size, height: size, objectFit: 'contain' }} />;
  }
  return <img src="/reference-logo.png" alt="Hello Nabiganj Logo" style={{ width: size, height: size, objectFit: 'contain' }} />;
};

const NabiganjLogo = ({ customLogo, size = 28 }: { customLogo?: string | null; size?: number }) => (
  <BrandLogo selectedTemplate="hello-nabiganj" customLogo={customLogo} size={size} />
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
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('hello-probash');

  // Exact reference default values
  const [headline1, setHeadline1] = useState('নবীগঞ্জে অবৈধ ব্যবসায়ীদের বিরুদ্ধে');
  const headline1Color = '#ffffff';
  const [headline2, setHeadline2] = useState('তৎপরতার ২৪ ঘণ্টার মধ্যে এসিল্যান্ডের বদলি');
  const headline2Color = '#ffcb05';
  const [headlineFontSize, setHeadlineFontSize] = useState(30);
  const [showFontSizePopup, setShowFontSizePopup] = useState(false);
  const [date, setDate] = useState('২৯ অক্টোবর ২০২৬');

  // Photo
  const [thumbnail, setThumbnail] = useState<string | null>('/reference-person.jpg');
  const [imageZoom, setImageZoom] = useState(100);

  // Legacy template constants
  const category = 'আন্তর্জাতিক';
  const likes = '12k';
  const comments = '1.2k';
  const shares = '500';
  const ctaText = 'বিস্তারিত কমেন্টে';

  // Compatibility defaults for other template modes
  const frameColor = '#fe0312';
  const socialHandle = 'hellonabiganj';
  const customLogo = null;
  const imageOffsetX = 0;
  const imageOffsetY = 0;

  // UI state
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs for in-place direct editing and file picker
  const postcardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headline1Ref = useRef<HTMLHeadingElement>(null);
  const headline2Ref = useRef<HTMLHeadingElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);

  // Dynamic preview scaling to perfectly fit mobile & desktop without layout overflow
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.45);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        // Leave 16px safe margin inside container
        const availableWidth = Math.max(260, containerWidth - 20);
        const scale = Math.min(1, Math.max(0.2, availableWidth / 800));
        setPreviewScale(scale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && previewContainerRef.current) {
      ro = new ResizeObserver(() => updateScale());
      ro.observe(previewContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      ro?.disconnect();
    };
  }, []);

  // Sync ref text with state smoothly without resetting cursor position
  useEffect(() => {
    if (headline1Ref.current && document.activeElement !== headline1Ref.current) {
      headline1Ref.current.innerText = headline1;
    }
  }, [headline1]);

  useEffect(() => {
    if (headline2Ref.current && document.activeElement !== headline2Ref.current) {
      headline2Ref.current.innerText = headline2;
    }
  }, [headline2]);

  useEffect(() => {
    if (dateRef.current && document.activeElement !== dateRef.current) {
      dateRef.current.innerText = date;
    }
  }, [date]);

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
      };
      reader.readAsDataURL(file);
    }
  };


  // Exclude edit hints/buttons during image download & clipboard copy
  const exportFilter = (node: HTMLElement) => {
    if (node?.classList && node.classList.contains('hide-on-export')) {
      return false;
    }
    return true;
  };

  const handleDownload = async (pixelRatio: number = 2) => {
    if (!postcardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(postcardRef.current, {
        cacheBust: true,
        quality: 1,
        pixelRatio: pixelRatio,
        filter: exportFilter,
        style: {
          transform: 'none',
          margin: '0',
          width: '800px',
          height: '800px'
        }
      });
      const link = document.createElement('a');
      link.download = `postcard-hellonabiganj-${Date.now()}.png`;
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
    setIsExporting(true);
    try {
      const blob = await toBlob(postcardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        filter: exportFilter,
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
    } finally {
      setIsExporting(false);
    }
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'hello-probash': {
        return (
          <div 
            className="postcard template-hello-probash" 
            ref={postcardRef}
          >
            {/* 1. Underlying Photo Container */}
            <div 
              className="hp-photo-slot"
              onClick={() => fileInputRef.current?.click()}
              title="ছবি পরিবর্তন করতে ক্লিক করুন"
            >
              {thumbnail ? (
                <img 
                  src={thumbnail} 
                  alt="News Main" 
                  className="hp-photo"
                  style={{
                    transform: `scale(${imageZoom / 100})`
                  }}
                />
              ) : (
                <div className="hp-photo-empty">
                  ছবি আপলোড করুন
                </div>
              )}

              {/* Floating Camera Button on Photo (visible in preview, hidden in export) */}
              <div className="hn-photo-edit-badge hide-on-export">
                <Camera size={14} />
                <span>ছবি পরিবর্তন</span>
              </div>
            </div>

            {/* 2. Master Template Overlay */}
            <img 
              src="/hello-probash-master.png" 
              className="hp-master-overlay" 
              alt="Hello Probash News Postcard Frame" 
            />

            {/* 3. Dynamic Headline Section - In-Place Editable */}
            <div className="hn-headline-area">
              {/* On-Card Floating Font Size Control Badge */}
              <button 
                type="button" 
                className="hn-size-badge hide-on-export"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFontSizePopup(prev => !prev);
                }}
                title="টেক্সটের সাইজ পরিবর্তন করতে ক্লিক করুন"
              >
                <Type size={12} color="#ffcb05" />
                <span>সাইজ {headlineFontSize}px</span>
              </button>

              {/* In-Place Font Size Popup */}
              {showFontSizePopup && (
                <div className="hn-size-popup hide-on-export" onClick={(e) => e.stopPropagation()}>
                  <div className="hn-size-popup-header">
                    <span className="hn-size-popup-title">
                      <Type size={13} color="#ffcb05" /> শিরোনাম সাইজ (Font Size)
                    </span>
                    <button 
                      type="button" 
                      className="hn-size-popup-close" 
                      onClick={() => setShowFontSizePopup(false)}
                      title="বন্ধ করুন"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="hn-size-popup-body">
                    <div className="hn-size-popup-row">
                      <button 
                        type="button"
                        className="hn-popup-step-btn" 
                        onClick={() => setHeadlineFontSize(prev => Math.max(20, prev - 2))}
                        title="সাইজ ২px কমান"
                      >
                        -
                      </button>
                      <input 
                        type="range" 
                        min="20" 
                        max="44" 
                        value={headlineFontSize} 
                        onChange={(e) => setHeadlineFontSize(Number(e.target.value))} 
                        className="hn-popup-slider" 
                      />
                      <button 
                        type="button"
                        className="hn-popup-step-btn" 
                        onClick={() => setHeadlineFontSize(prev => Math.min(44, prev + 2))}
                        title="সাইজ ২px বাড়ান"
                      >
                        +
                      </button>
                      <span className="hn-popup-badge-val">{headlineFontSize}px</span>
                    </div>

                    <div className="hn-size-presets">
                      {[24, 28, 30, 34, 38].map(sz => (
                        <button 
                          key={sz} 
                          type="button"
                          className={`hn-size-preset-btn ${headlineFontSize === sz ? 'active' : ''}`}
                          onClick={() => setHeadlineFontSize(sz)}
                        >
                          {sz}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="hn-headline-item">
                <h1 
                  ref={headline1Ref}
                  className="hn-headline-1 oncard-editable" 
                  style={{ color: headline1Color, fontSize: `${headlineFontSize}px` }}
                  contentEditable={!isExporting}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setHeadline1(e.currentTarget.innerText.trim() || headline1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                  title="ক্লিক করে ১ম লাইনের শিরোনাম লিখুন"
                >
                  {headline1}
                </h1>
                <span className="hn-pencil-hint hide-on-export">
                  <Pencil size={11} />
                </span>
              </div>

              <div className="hn-headline-item">
                <h2 
                  ref={headline2Ref}
                  className="hn-headline-2 oncard-editable" 
                  style={{ color: headline2Color, fontSize: `${Math.round(headlineFontSize * 1.13)}px` }}
                  contentEditable={!isExporting}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setHeadline2(e.currentTarget.innerText.trim() || headline2)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                  title="ক্লিক করে ২য় লাইনের শিরোনাম লিখুন"
                >
                  {headline2}
                </h2>
                <span className="hn-pencil-hint hide-on-export">
                  <Pencil size={11} />
                </span>
              </div>
            </div>
          </div>
        );
      }

      case 'hello-nabiganj': {
        return (
          <div 
            className="postcard template-hello-nabiganj" 
            ref={postcardRef}
          >
            {/* 1. Underlying Photo Container */}
            <div 
              className="hn-photo-slot"
              onClick={() => fileInputRef.current?.click()}
              title="ছবি পরিবর্তন করতে ক্লিক করুন"
            >
              {thumbnail ? (
                <img 
                  src={thumbnail} 
                  alt="News Main" 
                  className="hn-photo"
                  style={{
                    transform: `scale(${imageZoom / 100})`
                  }}
                />
              ) : (
                <div className="hn-photo-empty">
                  ছবি আপলোড করুন
                </div>
              )}

              {/* Floating Camera Button on Photo (visible in preview, hidden in export) */}
              <div className="hn-photo-edit-badge hide-on-export">
                <Camera size={14} />
                <span>ছবি পরিবর্তন</span>
              </div>
            </div>

            {/* 2. Master Template Overlay (authentic borders, sides, map, frame, emblem, footer) */}
            <img 
              src="/postcard-master-template.png" 
              className="hn-master-overlay" 
              alt="Hello Nabiganj Postcard Frame" 
            />

            {/* 3. Top Date Box - Dynamic + In-Place Editable */}
            <div className="hn-date-box">
              <img 
                src="/calendar-exact.svg" 
                alt="Calendar" 
                className="hn-calendar-icon" 
                onClick={() => setDate(getBengaliToday())}
                title="আজকের তারিখ বসান"
              />
              <span className="hn-date-separator">|</span>
              <span 
                ref={dateRef}
                className="hn-date-text oncard-editable"
                contentEditable={!isExporting}
                suppressContentEditableWarning={true}
                onBlur={(e) => setDate(e.currentTarget.innerText.trim() || date)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
                title="ক্লিক করে তারিখ পরিবর্তন করুন"
              >
                {date}
              </span>
              <button 
                type="button" 
                className="hn-date-edit-btn hide-on-export"
                onClick={(e) => {
                  e.stopPropagation();
                  setDate(getBengaliToday());
                }}
                title="আজকের তারিখ বসান"
              >
                আজ
              </button>
            </div>

            {/* 4. Dynamic Headline Section - In-Place Editable */}
            <div className="hn-headline-area">
              {/* On-Card Floating Font Size Control Badge */}
              <button 
                type="button" 
                className="hn-size-badge hide-on-export"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFontSizePopup(prev => !prev);
                }}
                title="টেক্সটের সাইজ পরিবর্তন করতে ক্লিক করুন"
              >
                <Type size={12} color="#ffcb05" />
                <span>সাইজ {headlineFontSize}px</span>
              </button>

              {/* In-Place Font Size Popup */}
              {showFontSizePopup && (
                <div className="hn-size-popup hide-on-export" onClick={(e) => e.stopPropagation()}>
                  <div className="hn-size-popup-header">
                    <span className="hn-size-popup-title">
                      <Type size={13} color="#ffcb05" /> শিরোনাম সাইজ (Font Size)
                    </span>
                    <button 
                      type="button" 
                      className="hn-size-popup-close" 
                      onClick={() => setShowFontSizePopup(false)}
                      title="বন্ধ করুন"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="hn-size-popup-body">
                    <div className="hn-size-popup-row">
                      <button 
                        type="button"
                        className="hn-popup-step-btn" 
                        onClick={() => setHeadlineFontSize(prev => Math.max(20, prev - 2))}
                        title="সাইজ ২px কমান"
                      >
                        -
                      </button>
                      <input 
                        type="range" 
                        min="20" 
                        max="44" 
                        value={headlineFontSize} 
                        onChange={(e) => setHeadlineFontSize(Number(e.target.value))} 
                        className="hn-popup-slider" 
                      />
                      <button 
                        type="button"
                        className="hn-popup-step-btn" 
                        onClick={() => setHeadlineFontSize(prev => Math.min(44, prev + 2))}
                        title="সাইজ ২px বাড়ান"
                      >
                        +
                      </button>
                      <span className="hn-popup-badge-val">{headlineFontSize}px</span>
                    </div>

                    <div className="hn-size-presets">
                      {[24, 28, 30, 34, 38].map(sz => (
                        <button 
                          key={sz} 
                          type="button"
                          className={`hn-size-preset-btn ${headlineFontSize === sz ? 'active' : ''}`}
                          onClick={() => setHeadlineFontSize(sz)}
                        >
                          {sz}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="hn-headline-item">
                <h1 
                  ref={headline1Ref}
                  className="hn-headline-1 oncard-editable" 
                  style={{ color: headline1Color, fontSize: `${headlineFontSize}px` }}
                  contentEditable={!isExporting}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setHeadline1(e.currentTarget.innerText.trim() || headline1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                  title="ক্লিক করে ১ম লাইনের শিরোনাম লিখুন"
                >
                  {headline1}
                </h1>
                <span className="hn-pencil-hint hide-on-export">
                  <Pencil size={11} />
                </span>
              </div>

              <div className="hn-headline-item">
                <h2 
                  ref={headline2Ref}
                  className="hn-headline-2 oncard-editable" 
                  style={{ color: headline2Color, fontSize: `${Math.round(headlineFontSize * 1.13)}px` }}
                  contentEditable={!isExporting}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => setHeadline2(e.currentTarget.innerText.trim() || headline2)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                  title="ক্লিক করে ২য় লাইনের শিরোনাম লিখুন"
                >
                  {headline2}
                </h2>
                <span className="hn-pencil-hint hide-on-export">
                  <Pencil size={11} />
                </span>
              </div>
            </div>
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
          <BrandLogo selectedTemplate={selectedTemplate} customLogo={customLogo} size={28} />
          <div className="navbar-brand-text">
            <span className="navbar-title">News Postcard</span>
            <span className="navbar-subtitle">
              {selectedTemplate === 'hello-probash' ? 'Hello Probash NEWS' : 'Hello Nabiganj'}
            </span>
          </div>
        </div>

        <div className="navbar-actions">
          <button 
            className="btn-secondary nav-action-btn" 
            onClick={handleCopyToClipboard}
            title="ছবি কপি করুন"
            aria-label="কপি"
          >
            <Copy size={18} />
          </button>

          <button 
            className="btn-primary nav-action-btn nav-download-btn" 
            onClick={() => handleDownload(2)}
            disabled={isExporting}
            title={isExporting ? 'ডাউনলোড প্রস্তুত হচ্ছে...' : 'HD ডাউনলোড করুন'}
            aria-label="HD ডাউনলোড"
          >
            <Download size={18} />
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* Editor Controls Panel - Unified Single Screen (No Tabs!) */}
        <section className="editor-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h2 className="editor-title" style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>
              পোস্টকার্ড এডিটর
            </h2>
            <div className="template-switcher">
              <button 
                type="button" 
                className={`template-switch-btn ${selectedTemplate === 'hello-probash' ? 'active probash' : ''}`}
                onClick={() => setSelectedTemplate('hello-probash')}
                title="হ্যালো প্রবাস নিউজ পোস্টকার্ড"
              >
                🔴 হ্যালো প্রবাস
              </button>
              <button 
                type="button" 
                className={`template-switch-btn ${selectedTemplate === 'hello-nabiganj' ? 'active nabiganj' : ''}`}
                onClick={() => setSelectedTemplate('hello-nabiganj')}
                title="হ্যালো নবীগঞ্জ পোস্টকার্ড"
              >
                🟢 হ্যালো নবীগঞ্জ
              </button>
            </div>
          </div>

          {/* Quick Notice for in-place editing */}
          <div className="direct-edit-notice">
            <Sparkles size={16} color="#d97706" style={{ flexShrink: 0 }} />
            <span>সরাসরি পোস্টকার্ডের ছবি, শিরোনাম বা তারিখে ট্যাপ করেও এডিট করতে পারবেন!</span>
          </div>

          {/* Hidden File Input for Image Upload */}
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />

          {/* SECTION 1: News Main Photo */}
          <div className="editor-section-card">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={16} color="#e50914" />
              খবরের মূল ছবি
            </label>

            <div className="photo-action-row">
              <button 
                type="button" 
                className="btn-upload-direct"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                <span>{thumbnail ? 'ছবি পরিবর্তন করুন' : 'নতুন ছবি আপলোড'}</span>
              </button>

              {thumbnail && (
                <div 
                  className="photo-mini-thumb" 
                  onClick={() => fileInputRef.current?.click()} 
                  title="ছবি পরিবর্তন করতে ক্লিক করুন"
                >
                  <img src={thumbnail} alt="Preview" />
                  <span className="thumb-edit-overlay"><Camera size={12} /></span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Headlines */}
          <div className="editor-section-card">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={16} color="#e50914" />
              খবরের শিরোনাম
            </label>

            <div className="form-group">
              <label className="form-sublabel">শিরোনাম ১ম লাইন (সাদা)</label>
              <textarea 
                className="form-textarea" 
                value={headline1} 
                onChange={e => setHeadline1(e.target.value)}
                placeholder="১ম লাইনের শিরোনাম..."
                rows={2}
              />
            </div>

            <div className="form-group" style={{ marginTop: '0.6rem' }}>
              <label className="form-sublabel">শিরোনাম ২য় লাইন (হাইলাইট হলুদ)</label>
              <textarea 
                className="form-textarea" 
                value={headline2} 
                onChange={e => setHeadline2(e.target.value)}
                placeholder="২য় লাইনের হাইলাইট শিরোনাম..."
                rows={2}
              />
            </div>
          </div>

          {/* SECTION 3: Date (Only for templates with date like hello-nabiganj) */}
          {selectedTemplate === 'hello-nabiganj' && (
            <div className="editor-section-card">
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-sublabel" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="#e50914" /> তারিখ
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setDate(getBengaliToday())}
                    className="btn-today-text"
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
            </div>
          )}

          {/* Quick Resolution Export Buttons */}
          <div className="export-actions-card">
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>
              পোস্টকার্ড ডাউনলোড করুন:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button 
                className="btn-secondary" 
                style={{ justifyContent: 'center' }}
                onClick={() => handleDownload(1.35)}
                disabled={isExporting}
              >
                <Download size={16} /> 1080p HD
              </button>
              <button 
                className="btn-primary" 
                style={{ justifyContent: 'center' }}
                onClick={() => handleDownload(2)}
                disabled={isExporting}
              >
                <Download size={16} /> 1600p Ultra HD
              </button>
            </div>
          </div>
        </section>

        {/* Live Preview Area */}
        <section className="preview-area">
          <div className="preview-container-wrapper" ref={previewContainerRef}>
            <div 
              className="preview-scaler"
              style={{
                width: `${Math.round(800 * previewScale)}px`,
                height: `${Math.round(800 * previewScale)}px`,
                position: 'relative',
                overflow: 'hidden',
                margin: '0 auto',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
              }}
            >
              <div 
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                  width: '800px',
                  height: '800px',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              >
                {renderTemplate()}
              </div>
            </div>

            {/* Quick Controls Bar (Font Size & Image Zoom) right under the postcard preview */}
            <div className="postcard-quick-bar hide-on-export">
              {/* Row 1: Text Size */}
              <div className="quick-bar-row">
                <span className="quick-bar-label">
                  <Type size={14} color="#e50914" /> টেক্সট সাইজ:
                </span>
                <div className="quick-bar-controls">
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setHeadlineFontSize(prev => Math.max(20, prev - 2))}
                    title="সাইজ ২px কমান"
                  >
                    -
                  </button>
                  <input 
                    type="range" 
                    min="20" 
                    max="44" 
                    value={headlineFontSize} 
                    onChange={e => setHeadlineFontSize(Number(e.target.value))} 
                    className="quick-slider"
                  />
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setHeadlineFontSize(prev => Math.min(44, prev + 2))}
                    title="সাইজ ২px বাড়ান"
                  >
                    +
                  </button>
                  <span 
                    className="quick-val-pill"
                    onClick={() => setShowFontSizePopup(prev => !prev)}
                    title="পপআপ খুলতে ক্লিক করুন"
                  >
                    {headlineFontSize}px
                  </span>
                </div>
              </div>

              {/* Row 2: Image Zoom */}
              <div className="quick-bar-row">
                <span className="quick-bar-label">
                  <ZoomIn size={14} color="#e50914" /> ছবির জুম:
                </span>
                <div className="quick-bar-controls">
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setImageZoom(prev => Math.max(80, prev - 10))}
                    title="জুম ১০% কমান"
                  >
                    -
                  </button>
                  <input 
                    type="range" 
                    min="80" 
                    max="200" 
                    value={imageZoom} 
                    onChange={e => setImageZoom(Number(e.target.value))} 
                    className="quick-slider"
                  />
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setImageZoom(prev => Math.min(200, prev + 10))}
                    title="জুম ১০% বাড়ান"
                  >
                    +
                  </button>
                  <span 
                    className="quick-val-pill"
                    onClick={() => setImageZoom(100)}
                    title="ক্লিক করে ১০০% রিসেট করুন"
                  >
                    {imageZoom}%
                  </span>
                </div>
              </div>
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

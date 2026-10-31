import React, { useState, useRef, useEffect } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { 
  Download, Globe, ChevronDown, Quote, 
  Copy, Check, Type, Camera, Pencil,
  ZoomIn,
  Share2, ThumbsUp, MessageCircle
} from 'lucide-react';

type TemplateType = 'hello-probash' | 'hello-desh' | 'hello-nabiganj' | 'news-red' | 'modern' | 'quote' | 'elegant' | 'breaking';

// Brand Logo Component supporting Hello Probash, Hello Desh and Hello Nabiganj
const BrandLogo = ({ selectedTemplate, customLogo, size = 28 }: { selectedTemplate: TemplateType; customLogo?: string | null; size?: number }) => {
  if (customLogo) {
    return <img src={customLogo} alt="Logo" style={{ width: size, height: size, objectFit: 'contain' }} />;
  }
  if (selectedTemplate === 'hello-probash') {
    return <img src="/hello-probash-logo.png" alt="Hello Probash Logo" style={{ height: size, objectFit: 'contain' }} />;
  }
  if (selectedTemplate === 'hello-desh') {
    return <img src="/hello-desh-logo.png" alt="Hello Desh Logo" style={{ height: size, objectFit: 'contain' }} />;
  }
  return <img src="/hello-nabiganj-logo.png" alt="Hello Nabiganj Logo" style={{ height: size, objectFit: 'contain' }} />;
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
  const [headline1FontSize, setHeadline1FontSize] = useState(30);

  const [headline2, setHeadline2] = useState('তৎপরতার ২৪ ঘণ্টার মধ্যে এসিল্যান্ডের বদলি');
  const headline2Color = '#ffcb05';
  const [headline2FontSize, setHeadline2FontSize] = useState(34);

  const [showFontSizePopup, setShowFontSizePopup] = useState(false);
  const [date, setDate] = useState(getBengaliToday);
  void setDate;

  // Photo
  const [thumbnail, setThumbnail] = useState<string | null>('/reference-person.jpg');
  const [imageZoom, setImageZoom] = useState(100);
  const [imageFitMode, setImageFitMode] = useState<'cover' | 'contain'>('contain');

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
  const [imageOffsetX, setImageOffsetX] = useState(0);
  const [imageOffsetY, setImageOffsetY] = useState(0);

  // UI state
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs for in-place direct editing and file picker
  const postcardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoSlotRef = useRef<HTMLDivElement>(null);
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

  // Gestures for 2-finger pinch zoom and swipe/drag image pan
  const gestureRef = useRef({
    isDragging: false,
    isPinching: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    startDist: 0,
    startZoom: 100,
    midX: 0,
    midY: 0,
    hasMoved: false
  });

  const imageStateRef = useRef({
    zoom: imageZoom,
    offsetX: imageOffsetX,
    offsetY: imageOffsetY,
    scale: previewScale
  });
  imageStateRef.current = {
    zoom: imageZoom,
    offsetX: imageOffsetX,
    offsetY: imageOffsetY,
    scale: previewScale
  };

  useEffect(() => {
    const el = photoSlotRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('.hn-photo-edit-badge')) return;

      if (e.touches.length === 1) {
        const t = e.touches[0];
        gestureRef.current = {
          isDragging: true,
          isPinching: false,
          startX: t.clientX,
          startY: t.clientY,
          startOffsetX: imageStateRef.current.offsetX,
          startOffsetY: imageStateRef.current.offsetY,
          startDist: 0,
          startZoom: imageStateRef.current.zoom,
          midX: 0,
          midY: 0,
          hasMoved: false
        };
      } else if (e.touches.length >= 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        gestureRef.current = {
          isDragging: false,
          isPinching: true,
          startX: 0,
          startY: 0,
          startOffsetX: imageStateRef.current.offsetX,
          startOffsetY: imageStateRef.current.offsetY,
          startDist: dist,
          startZoom: imageStateRef.current.zoom,
          midX: (t1.clientX + t2.clientX) / 2,
          midY: (t1.clientY + t2.clientY) / 2,
          hasMoved: false
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const g = gestureRef.current;
      const curScale = imageStateRef.current.scale || 1;

      if (e.touches.length >= 2 && g.isPinching) {
        if (e.cancelable) e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

        if (g.startDist > 0) {
          const factor = currentDist / g.startDist;
          const nextZoom = Math.min(250, Math.max(50, Math.round(g.startZoom * factor)));
          setImageZoom(nextZoom);
        }

        const curMidX = (t1.clientX + t2.clientX) / 2;
        const curMidY = (t1.clientY + t2.clientY) / 2;
        const dx = (curMidX - g.midX) / curScale;
        const dy = (curMidY - g.midY) / curScale;
        if (Math.hypot(dx, dy) > 3) g.hasMoved = true;
        setImageOffsetX(Math.round(g.startOffsetX + dx));
        setImageOffsetY(Math.round(g.startOffsetY + dy));
      } else if (e.touches.length === 1 && g.isDragging) {
        const t = e.touches[0];
        const dx = (t.clientX - g.startX) / curScale;
        const dy = (t.clientY - g.startY) / curScale;
        if (Math.hypot(dx, dy) > 3) {
          g.hasMoved = true;
          if (e.cancelable) e.preventDefault();
        }
        setImageOffsetX(Math.round(g.startOffsetX + dx));
        setImageOffsetY(Math.round(g.startOffsetY + dy));
      }
    };

    const onTouchEnd = () => {
      gestureRef.current.isDragging = false;
      gestureRef.current.isPinching = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.cancelable) e.preventDefault();
      const step = e.deltaY < 0 ? 5 : -5;
      setImageZoom(prev => Math.min(250, Math.max(50, prev + step)));
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('wheel', onWheel);
    };
  }, [selectedTemplate]);

  // Desktop mouse drag to pan image
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.hn-photo-edit-badge')) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startOffsetX = imageOffsetX;
    const startOffsetY = imageOffsetY;
    const curScale = previewScale || 1;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startX) / curScale;
      const dy = (moveEvent.clientY - startY) / curScale;
      setImageOffsetX(Math.round(startOffsetX + dx));
      setImageOffsetY(Math.round(startOffsetY + dy));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

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
        setImageOffsetX(0);
        setImageOffsetY(0);
        setImageFitMode('contain');
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

  const renderHeadlineArea = () => (
    <div className="hn-headline-area">
      {/* On-Card Floating Font Size Control Badge */}
      <button 
        type="button" 
        className="hn-size-badge hide-on-export"
        onClick={(e) => {
          e.stopPropagation();
          setShowFontSizePopup(prev => !prev);
        }}
        title="শিরোনামের সাইজ পরিবর্তন করতে ক্লিক করুন"
      >
        <Type size={12} color="#ffcb05" />
        <span>সাইজ: ১ম {headline1FontSize} | ২য় {headline2FontSize}</span>
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
            {/* 1st Line Controls */}
            <div className="hn-size-popup-section">
              <div className="hn-size-section-label">
                <span className="hn-size-dot dot-white"></span> শিরোনাম ১ম লাইন (সাদা)
              </div>
              <div className="hn-size-popup-row">
                <button 
                  type="button"
                  className="hn-popup-step-btn" 
                  onClick={() => setHeadline1FontSize(prev => Math.max(16, prev - 2))}
                  title="সাইজ ২ কমান"
                >
                  -
                </button>
                <input 
                  type="range" 
                  min="16" 
                  max="48" 
                  value={headline1FontSize} 
                  onChange={(e) => setHeadline1FontSize(Number(e.target.value))} 
                  className="hn-popup-slider" 
                />
                <button 
                  type="button"
                  className="hn-popup-step-btn" 
                  onClick={() => setHeadline1FontSize(prev => Math.min(48, prev + 2))}
                  title="সাইজ ২ বাড়ান"
                >
                  +
                </button>
                <span className="hn-popup-badge-val">{headline1FontSize}px</span>
              </div>
              <div className="hn-size-presets">
                {[22, 26, 30, 34, 38].map(sz => (
                  <button 
                    key={sz} 
                    type="button"
                    className={`hn-size-preset-btn ${headline1FontSize === sz ? 'active' : ''}`}
                    onClick={() => setHeadline1FontSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="hn-size-divider" />

            {/* 2nd Line Controls */}
            <div className="hn-size-popup-section">
              <div className="hn-size-section-label">
                <span className="hn-size-dot dot-yellow"></span> শিরোনাম ২য় লাইন (হলুদ)
              </div>
              <div className="hn-size-popup-row">
                <button 
                  type="button"
                  className="hn-popup-step-btn" 
                  onClick={() => setHeadline2FontSize(prev => Math.max(18, prev - 2))}
                  title="সাইজ ২ কমান"
                >
                  -
                </button>
                <input 
                  type="range" 
                  min="18" 
                  max="54" 
                  value={headline2FontSize} 
                  onChange={(e) => setHeadline2FontSize(Number(e.target.value))} 
                  className="hn-popup-slider" 
                />
                <button 
                  type="button"
                  className="hn-popup-step-btn" 
                  onClick={() => setHeadline2FontSize(prev => Math.min(54, prev + 2))}
                  title="সাইজ ২ বাড়ান"
                >
                  +
                </button>
                <span className="hn-popup-badge-val">{headline2FontSize}px</span>
              </div>
              <div className="hn-size-presets">
                {[26, 30, 34, 38, 44].map(sz => (
                  <button 
                    key={sz} 
                    type="button"
                    className={`hn-size-preset-btn ${headline2FontSize === sz ? 'active' : ''}`}
                    onClick={() => setHeadline2FontSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hn-headline-item">
        <h1 
          ref={headline1Ref}
          className="hn-headline-1 oncard-editable" 
          style={{ color: headline1Color, fontSize: `${headline1FontSize}px` }}
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
          style={{ color: headline2Color, fontSize: `${headline2FontSize}px` }}
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
  );

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
              ref={photoSlotRef}
              className="hp-photo-slot"
              onMouseDown={handleMouseDown}
              title="দুই আঙুল দিয়ে জুম এবং ড্র্যাগ করে ছবি পজিশন করুন"
            >
              {thumbnail ? (
                <>
                  {imageFitMode === 'contain' && (
                    <img 
                      src={thumbnail} 
                      alt="Backdrop" 
                      className="photo-blur-backdrop"
                      aria-hidden="true"
                    />
                  )}
                  <img 
                    src={thumbnail} 
                    alt="News Main" 
                    className="hp-photo"
                    style={{
                      objectFit: imageFitMode,
                      transform: `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${imageZoom / 100})`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                  />
                </>
              ) : (
                <div 
                  className="hp-photo-empty"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  ছবি আপলোড করুন
                </div>
              )}

              {/* Floating Camera Button on Photo (visible in preview, hidden in export) */}
              <div 
                className="hn-photo-edit-badge hide-on-export"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
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
            {renderHeadlineArea()}
          </div>
        );
      }

      case 'hello-desh': {
        return (
          <div 
            className="postcard template-hello-desh" 
            ref={postcardRef}
          >
            {/* 1. Underlying Photo Container */}
            <div 
              ref={photoSlotRef}
              className="hd-photo-slot"
              onMouseDown={handleMouseDown}
              title="দুই আঙুল দিয়ে জুম এবং ড্র্যাগ করে ছবি পজিশন করুন"
            >
              {thumbnail ? (
                <>
                  {imageFitMode === 'contain' && (
                    <img 
                      src={thumbnail} 
                      alt="Backdrop" 
                      className="photo-blur-backdrop"
                      aria-hidden="true"
                    />
                  )}
                  <img 
                    src={thumbnail} 
                    alt="News Main" 
                    className="hd-photo"
                    style={{
                      objectFit: imageFitMode,
                      transform: `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${imageZoom / 100})`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                  />
                </>
              ) : (
                <div 
                  className="hd-photo-empty"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  ছবি আপলোড করুন
                </div>
              )}

              {/* Floating Camera Button on Photo (visible in preview, hidden in export) */}
              <div 
                className="hn-photo-edit-badge hide-on-export"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Camera size={14} />
                <span>ছবি পরিবর্তন</span>
              </div>
            </div>

            {/* 2. Master Template Overlay */}
            <img 
              src="/hello-desh-master.png" 
              className="hd-master-overlay" 
              alt="Hello Desh Postcard Frame" 
            />

            {/* 3. Dynamic Headline Section - In-Place Editable */}
            {renderHeadlineArea()}
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
              ref={photoSlotRef}
              className="hn-photo-slot"
              onMouseDown={handleMouseDown}
              title="দুই আঙুল দিয়ে জুম এবং ড্র্যাগ করে ছবি পজিশন করুন"
            >
              {thumbnail ? (
                <>
                  {imageFitMode === 'contain' && (
                    <img 
                      src={thumbnail} 
                      alt="Backdrop" 
                      className="photo-blur-backdrop"
                      aria-hidden="true"
                    />
                  )}
                  <img 
                    src={thumbnail} 
                    alt="News Main" 
                    className="hn-photo"
                    style={{
                      objectFit: imageFitMode,
                      transform: `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${imageZoom / 100})`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                  />
                </>
              ) : (
                <div 
                  className="hn-photo-empty"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  ছবি আপলোড করুন
                </div>
              )}

              {/* Floating Camera Button on Photo (visible in preview, hidden in export) */}
              <div 
                className="hn-photo-edit-badge hide-on-export"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Camera size={14} />
                <span>ছবি পরিবর্তন</span>
              </div>
            </div>

            {/* 2. Master Template Overlay */}
            <img 
              src="/hello-nabiganj-master.png" 
              className="hn-master-overlay" 
              alt="Hello Nabiganj Postcard Frame" 
            />

            {/* 3. Dynamic Headline Section - In-Place Editable */}
            {renderHeadlineArea()}
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
              {selectedTemplate === 'hello-probash' ? 'Hello Probash NEWS' : selectedTemplate === 'hello-desh' ? 'Hello Desh' : 'Hello Nabiganj'}
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
                className={`template-switch-btn ${selectedTemplate === 'hello-desh' ? 'active desh' : ''}`}
                onClick={() => setSelectedTemplate('hello-desh')}
                title="হ্যালো দেশ পোস্টকার্ড"
              >
                🟢 হ্যালো দেশ
              </button>
              <button 
                type="button" 
                className={`template-switch-btn ${selectedTemplate === 'hello-nabiganj' ? 'active nabiganj' : ''}`}
                onClick={() => setSelectedTemplate('hello-nabiganj')}
                title="হ্যালো নবীগঞ্জ পোস্টকার্ড"
              >
                🔴 হ্যালো নবীগঞ্জ
              </button>
            </div>
          </div>

          {/* Hidden File Input for Image Upload */}
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />

          {/* SECTION: Headlines */}
          <div className="editor-section-card">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={16} color="#e50914" />
              খবরের শিরোনাম
            </label>

            <div className="form-group">
              <div className="form-sublabel-row">
                <label className="form-sublabel" style={{ margin: 0 }}>শিরোনাম ১ম লাইন (সাদা)</label>
                <div className="inline-size-stepper">
                  <span className="inline-size-tag">সাইজ:</span>
                  <button 
                    type="button" 
                    className="inline-step-btn" 
                    onClick={() => setHeadline1FontSize(prev => Math.max(16, prev - 2))}
                    title="১ম লাইনের সাইজ ২px কমান"
                  >
                    -
                  </button>
                  <span className="inline-size-val">{headline1FontSize}px</span>
                  <button 
                    type="button" 
                    className="inline-step-btn" 
                    onClick={() => setHeadline1FontSize(prev => Math.min(48, prev + 2))}
                    title="১ম লাইনের সাইজ ২px বাড়ান"
                  >
                    +
                  </button>
                </div>
              </div>
              <textarea 
                className="form-textarea" 
                value={headline1} 
                onChange={e => setHeadline1(e.target.value)}
                placeholder="১ম লাইনের শিরোনাম..."
                rows={2}
              />
            </div>

            <div className="form-group" style={{ marginTop: '0.6rem' }}>
              <div className="form-sublabel-row">
                <label className="form-sublabel" style={{ margin: 0 }}>শিরোনাম ২য় লাইন (হাইলাইট হলুদ)</label>
                <div className="inline-size-stepper">
                  <span className="inline-size-tag">সাইজ:</span>
                  <button 
                    type="button" 
                    className="inline-step-btn" 
                    onClick={() => setHeadline2FontSize(prev => Math.max(18, prev - 2))}
                    title="২য় লাইনের সাইজ ২px কমান"
                  >
                    -
                  </button>
                  <span className="inline-size-val">{headline2FontSize}px</span>
                  <button 
                    type="button" 
                    className="inline-step-btn" 
                    onClick={() => setHeadline2FontSize(prev => Math.min(54, prev + 2))}
                    title="২য় লাইনের সাইজ ২px বাড়ান"
                  >
                    +
                  </button>
                </div>
              </div>
              <textarea 
                className="form-textarea" 
                value={headline2} 
                onChange={e => setHeadline2(e.target.value)}
                placeholder="২য় লাইনের হাইলাইট শিরোনাম..."
                rows={2}
              />
            </div>
          </div>

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
              {/* Row 1: Headline 1 Size */}
              <div className="quick-bar-row">
                <span className="quick-bar-label">
                  <Type size={13} color="#e50914" /> ১ম লাইন:
                </span>
                <div className="quick-bar-controls">
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setHeadline1FontSize(prev => Math.max(16, prev - 2))}
                    title="১ম লাইনের সাইজ ২ কমান"
                  >
                    -
                  </button>
                  <input 
                    type="range" 
                    min="16" 
                    max="48" 
                    value={headline1FontSize} 
                    onChange={e => setHeadline1FontSize(Number(e.target.value))} 
                    className="quick-slider"
                  />
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setHeadline1FontSize(prev => Math.min(48, prev + 2))}
                    title="১ম লাইনের সাইজ ২ বাড়ান"
                  >
                    +
                  </button>
                  <span 
                    className="quick-val-pill"
                    onClick={() => setShowFontSizePopup(prev => !prev)}
                    title="ফন্ট সাইজ পপআপ"
                  >
                    {headline1FontSize}px
                  </span>
                </div>
              </div>

              {/* Row 2: Headline 2 Size */}
              <div className="quick-bar-row">
                <span className="quick-bar-label">
                  <Type size={13} color="#d97706" /> ২য় লাইন:
                </span>
                <div className="quick-bar-controls">
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setHeadline2FontSize(prev => Math.max(18, prev - 2))}
                    title="২য় লাইনের সাইজ ২ কমান"
                  >
                    -
                  </button>
                  <input 
                    type="range" 
                    min="18" 
                    max="54" 
                    value={headline2FontSize} 
                    onChange={e => setHeadline2FontSize(Number(e.target.value))} 
                    className="quick-slider"
                  />
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setHeadline2FontSize(prev => Math.min(54, prev + 2))}
                    title="২য় লাইনের সাইজ ২ বাড়ান"
                  >
                    +
                  </button>
                  <span 
                    className="quick-val-pill"
                    onClick={() => setShowFontSizePopup(prev => !prev)}
                    title="ফন্ট সাইজ পপআপ"
                  >
                    {headline2FontSize}px
                  </span>
                </div>
              </div>

              {/* Row 2: Image Zoom */}
              <div className="quick-bar-row">
                <span className="quick-bar-label">
                  <ZoomIn size={13} color="#e50914" /> জুম:
                </span>
                <div className="quick-bar-controls">
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setImageZoom(prev => Math.max(30, prev - 10))}
                    title="জুম কমান"
                  >
                    -
                  </button>
                  <input 
                    type="range" 
                    min="30" 
                    max="220" 
                    value={imageZoom} 
                    onChange={e => setImageZoom(Number(e.target.value))} 
                    className="quick-slider"
                  />
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setImageZoom(prev => Math.min(220, prev + 10))}
                    title="জুম বাড়ান"
                  >
                    +
                  </button>
                  <span 
                    className="quick-val-pill"
                    onClick={() => {
                      setImageZoom(100);
                      setImageOffsetX(0);
                      setImageOffsetY(0);
                    }}
                    title="ক্লিক করে ১০০% ও পজিশন রিসেট করুন"
                  >
                    {imageZoom}%
                  </span>
                </div>
              </div>

              {/* Row 3: Fit Mode Toggle (সম্পূর্ণ ছবি vs ফ্রেম ফিল) */}
              <div className="quick-bar-row">
                <span className="quick-bar-label">
                  ভিউ:
                </span>
                <div className="quick-fit-toggle">
                  <button 
                    type="button"
                    className={`quick-fit-btn ${imageFitMode === 'contain' ? 'active' : ''}`}
                    onClick={() => {
                      setImageFitMode('contain');
                      setImageZoom(100);
                      setImageOffsetX(0);
                      setImageOffsetY(0);
                    }}
                    title="সম্পূর্ণ ছবি দেখান (কোনো অংশ কাটবে না)"
                  >
                    🖼️ সম্পূর্ণ ছবি
                  </button>
                  <button 
                    type="button"
                    className={`quick-fit-btn ${imageFitMode === 'cover' ? 'active' : ''}`}
                    onClick={() => {
                      setImageFitMode('cover');
                      setImageZoom(100);
                      setImageOffsetX(0);
                      setImageOffsetY(0);
                    }}
                    title="ফ্রেম পূরণ করুন"
                  >
                    ✂️ ফ্রেম ফিল
                  </button>
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

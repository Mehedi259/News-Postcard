import React, { useState, useRef, useEffect } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { 
  Download, Globe, ChevronDown, Quote, 
  Copy, Check, Type, Camera, Pencil,
  ZoomIn, Calendar, MoveVertical, Move,
  Share2, ThumbsUp, MessageCircle
} from 'lucide-react';

type TemplateType = 'hello-probash' | 'hello-desh' | 'hello-nabiganj' | 'news-red' | 'modern' | 'quote' | 'elegant' | 'breaking' | 'press-studio-65' | 'press-studio-102' | 'press-studio-122' | 'press-studio-183';

// Brand Logo Component supporting Hello Probash, Hello Desh and Hello Nabiganj
const BrandLogo = ({ selectedTemplate, customLogo, size = 28 }: { selectedTemplate: TemplateType; customLogo?: string | null; size?: number }) => {
  if (customLogo) {
    return <img src={customLogo} alt="Logo" style={{ width: size, height: size, objectFit: 'contain' }} />;
  }
  if (selectedTemplate === 'hello-probash' || selectedTemplate.startsWith('press-studio')) {
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

export interface BengaliFontOption {
  id: string;
  family: string;
  name: string;
  weight?: number;
}

export const BENGALI_FONTS: BengaliFontOption[] = [
  { id: "'Noto Serif Bengali', serif", family: "'Noto Serif Bengali', serif", name: 'নোটো সেরিফ (Classic News)', weight: 700 },
  { id: "'Hind Siliguri', sans-serif", family: "'Hind Siliguri', sans-serif", name: 'হিন্দ শিলিগুড়ি বোল্ড (Hind Siliguri Bold / ExtraBold)', weight: 700 },
  { id: "'Noto Sans Bengali', sans-serif:black", family: "'Noto Sans Bengali', sans-serif", name: 'নোটো সান্স ব্ল্যাক (Noto Sans Bengali Black - 900)', weight: 900 },
  { id: "'Noto Sans Bengali', sans-serif", family: "'Noto Sans Bengali', sans-serif", name: 'নোটো সান্স বোল্ড (Noto Sans Bengali Bold - 700)', weight: 700 },
  { id: "'SolaimanLipi', sans-serif", family: "'SolaimanLipi', sans-serif", name: 'সোলায়মানলিপি বোল্ড (SolaimanLipi Bold)', weight: 700 },
  { id: "'Anek Bangla', sans-serif", family: "'Anek Bangla', sans-serif", name: 'অনেকা বাংলা এক্সট্রা বোল্ড (Anek Bangla ExtraBold)', weight: 800 },
  { id: "'Tiro Bangla', serif", family: "'Tiro Bangla', serif", name: 'তিরো বাংলা (Traditional Serif)', weight: 700 },
  { id: "'Mina', sans-serif", family: "'Mina', sans-serif", name: 'মিনা (Minimal Slim)', weight: 700 },
  { id: "'Galada', cursive", family: "'Galada', cursive", name: 'গালদা (Stylized Cursive)', weight: 400 },
];

export const getFontFamilyAndWeight = (fontId: string, defaultWeight: number = 700) => {
  const found = BENGALI_FONTS.find(f => f.id === fontId);
  if (found) {
    return { fontFamily: found.family, fontWeight: found.weight || defaultWeight };
  }
  return { fontFamily: fontId, fontWeight: defaultWeight };
};

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
  const [headline1Color, setHeadline1Color] = useState('#ffffff');
  const [headline1FontSize, setHeadline1FontSize] = useState(30);
  const [headline1FontFamily, setHeadline1FontFamily] = useState("'Noto Serif Bengali', serif");

  const [headline2, setHeadline2] = useState('তৎপরতার ২৪ ঘণ্টার মধ্যে এসিল্যান্ডের বদলি');
  const [headline2Color, setHeadline2Color] = useState('#ffcb05');
  const [headline2FontSize, setHeadline2FontSize] = useState(34);
  const [headline2FontFamily, setHeadline2FontFamily] = useState("'Anek Bangla', sans-serif");
  const [headlineGap, setHeadlineGap] = useState(6);
  const [headlineY, setHeadlineY] = useState(526);
  const [headlineX, setHeadlineX] = useState(0);

  const [showFontSizePopup, setShowFontSizePopup] = useState(false);
  const [date, setDate] = useState(getBengaliToday);
  const [showDate, setShowDate] = useState(true);
  const [dateFontSize, setDateFontSize] = useState(15);
  const [dateColor, setDateColor] = useState('#1f2937');
  const [dateFontFamily, setDateFontFamily] = useState("'Anek Bangla', sans-serif");

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

  // Mouse & Touch drag to reposition headlines freely on postcard
  const handleHeadlineMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startX = e.clientX;
    const initialY = headlineY;
    const initialX = headlineX;
    const curScale = previewScale || 1;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dy = (moveEvent.clientY - startY) / curScale;
      const dx = (moveEvent.clientX - startX) / curScale;
      setHeadlineY(Math.min(680, Math.max(440, Math.round(initialY + dy))));
      setHeadlineX(Math.min(120, Math.max(-120, Math.round(initialX + dx))));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleHeadlineTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    const startY = t.clientY;
    const startX = t.clientX;
    const initialY = headlineY;
    const initialX = headlineX;
    const curScale = previewScale || 1;

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.cancelable) moveEvent.preventDefault();
      const curT = moveEvent.touches[0];
      const dy = (curT.clientY - startY) / curScale;
      const dx = (curT.clientX - startX) / curScale;
      setHeadlineY(Math.min(680, Math.max(440, Math.round(initialY + dy))));
      setHeadlineX(Math.min(120, Math.max(-120, Math.round(initialX + dx))));
    };

    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
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
      link.download = `postcard-${selectedTemplate}-${Date.now()}.png`;
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

  const renderTopDate = () => {
    if (!showDate) return null;
    const dateFont = getFontFamilyAndWeight(dateFontFamily, 600);
    return (
      <div 
        className="hn-top-date"
        title="তারিখ পরিবর্তন করতে ক্লিক করুন"
      >
        <Calendar 
          size={Math.max(12, Math.round(dateFontSize * 0.95))} 
          className="date-icon" 
          style={{ color: dateColor }} 
        />
        <span 
          ref={dateRef}
          className="date-text oncard-editable"
          contentEditable={!isExporting}
          suppressContentEditableWarning={true}
          style={{ fontSize: `${dateFontSize}px`, color: dateColor, fontFamily: dateFont.fontFamily, fontWeight: dateFont.fontWeight }}
          onBlur={(e) => setDate(e.currentTarget.innerText.trim() || date)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        >
          {date}
        </span>
        <span className="date-pencil hide-on-export">
          <Pencil size={10} />
        </span>
      </div>
    );
  };

  const renderPressStudioDate = (position: 'top-right' | 'bottom-right') => {
    if (!showDate) return null;
    const dateFont = getFontFamilyAndWeight(dateFontFamily, 700);
    return (
      <div 
        className={position === 'bottom-right' ? 'ps65-date-box' : 'ps-top-date-box'}
        title="তারিখ পরিবর্তন করতে ক্লিক করুন"
      >
        <span 
          ref={dateRef}
          className="date-text oncard-editable"
          contentEditable={!isExporting}
          suppressContentEditableWarning={true}
          style={{ 
            fontSize: `${dateFontSize}px`, 
            color: dateColor === '#1f2937' || !dateColor ? '#ffffff' : dateColor, 
            fontFamily: dateFont.fontFamily, 
            fontWeight: dateFont.fontWeight 
          }}
          onBlur={(e) => setDate(e.currentTarget.innerText.trim() || date)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        >
          {date}
        </span>
        <span className="date-pencil hide-on-export">
          <Pencil size={10} />
        </span>
      </div>
    );
  };

  const handleSelectTemplate = (tmpl: TemplateType) => {
    setSelectedTemplate(tmpl);
    if (tmpl === 'press-studio-65') {
      setHeadlineY(536);
    } else if (tmpl === 'press-studio-102') {
      setHeadlineY(520);
    } else if (tmpl === 'press-studio-122') {
      setHeadlineY(490);
    } else if (tmpl === 'press-studio-183') {
      setHeadlineY(565);
    } else {
      setHeadlineY(526);
    }
  };

  const renderHeadlineArea = () => {
    const h1Font = getFontFamilyAndWeight(headline1FontFamily, 700);
    const h2Font = getFontFamilyAndWeight(headline2FontFamily, 800);

    return (
    <div 
      className="hn-headline-area"
      style={{
        top: `${headlineY}px`,
        transform: headlineX ? `translateX(${headlineX}px)` : undefined
      }}
    >
      {/* On-Card Controls: Move Handle and Size/Style Badge */}
      <div className="hn-headline-controls-row hide-on-export">
        <div 
          className="hn-drag-handle"
          onMouseDown={handleHeadlineMouseDown}
          onTouchStart={handleHeadlineTouchStart}
          title="মাউস দিয়ে চেপে বা আঙুল দিয়ে ড্র্যাগ করে হেডলাইনের অবস্থান সরান"
        >
          <Move size={12} color="#ffffff" />
          <span>পজিশন সরান</span>
        </div>

        <button 
          type="button" 
          className="hn-size-badge"
          onClick={(e) => {
            e.stopPropagation();
            setShowFontSizePopup(prev => !prev);
          }}
          title="শিরোনামের সাইজ, রং, ফন্ট ও গ্যাপ পরিবর্তন করতে ক্লিক করুন"
        >
          <Type size={12} color="#ffcb05" />
          <span>সাইজ: ১ম {headline1FontSize} | ২য় {headline2FontSize} | গ্যাপ {headlineGap}</span>
        </button>
      </div>

      {/* In-Place Font Size & Color Popup */}
      {showFontSizePopup && (
        <div className="hn-size-popup hide-on-export" onClick={(e) => e.stopPropagation()}>
          <div className="hn-size-popup-header">
            <span className="hn-size-popup-title">
              <Type size={13} color="#ffcb05" /> শিরোনাম সাইজ, ফন্ট ও অবস্থান
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
                <span className="hn-size-dot dot-white"></span> শিরোনাম ১ম লাইন
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
              <div className="hn-popup-color-row">
                <span className="hn-popup-color-label">রং:</span>
                {['#ffffff', '#ffcb05', '#38bdf8', '#4ade80', '#fb923c', '#f472b6'].map(c => (
                  <button 
                    key={c}
                    type="button"
                    className={`hn-color-swatch ${headline1Color.toLowerCase() === c.toLowerCase() ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setHeadline1Color(c)}
                    title={c}
                  />
                ))}
                <label className="hn-color-picker-label" title="অন্যান্য রং">
                  <input 
                    type="color" 
                    value={headline1Color} 
                    onChange={e => setHeadline1Color(e.target.value)} 
                    className="hn-native-color-picker"
                  />
                  🎨
                </label>
              </div>
              <div style={{ marginTop: '5px' }}>
                <select 
                  className="hn-popup-select"
                  value={headline1FontFamily}
                  onChange={e => setHeadline1FontFamily(e.target.value)}
                >
                  {BENGALI_FONTS.map(f => (
                    <option key={f.id} value={f.id} style={{ fontFamily: f.family, fontWeight: f.weight }}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hn-size-divider" />

            {/* 2nd Line Controls */}
            <div className="hn-size-popup-section">
              <div className="hn-size-section-label">
                <span className="hn-size-dot dot-yellow"></span> শিরোনাম ২য় লাইন
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
              <div className="hn-popup-color-row">
                <span className="hn-popup-color-label">রং:</span>
                {['#ffcb05', '#ffffff', '#38bdf8', '#a3e635', '#f87171', '#fb923c'].map(c => (
                  <button 
                    key={c}
                    type="button"
                    className={`hn-color-swatch ${headline2Color.toLowerCase() === c.toLowerCase() ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setHeadline2Color(c)}
                    title={c}
                  />
                ))}
                <label className="hn-color-picker-label" title="অন্যান্য রং">
                  <input 
                    type="color" 
                    value={headline2Color} 
                    onChange={e => setHeadline2Color(e.target.value)} 
                    className="hn-native-color-picker"
                  />
                  🎨
                </label>
              </div>
              <div style={{ marginTop: '5px' }}>
                <select 
                  className="hn-popup-select"
                  value={headline2FontFamily}
                  onChange={e => setHeadline2FontFamily(e.target.value)}
                >
                  {BENGALI_FONTS.map(f => (
                    <option key={f.id} value={f.id} style={{ fontFamily: f.family, fontWeight: f.weight }}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hn-size-divider" />

            {/* Line Gap Controls */}
            <div className="hn-size-popup-section">
              <div className="hn-size-section-label">
                <MoveVertical size={12} color="#a78bfa" /> লাইনের দূরত্ব / গ্যাপ (Line Gap)
              </div>
              <div className="hn-size-popup-row">
                <button 
                  type="button"
                  className="hn-popup-step-btn" 
                  onClick={() => setHeadlineGap(prev => Math.max(0, prev - 2))}
                  title="গ্যাপ ২ কমান"
                >
                  -
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="36" 
                  value={headlineGap} 
                  onChange={(e) => setHeadlineGap(Number(e.target.value))} 
                  className="hn-popup-slider" 
                />
                <button 
                  type="button"
                  className="hn-popup-step-btn" 
                  onClick={() => setHeadlineGap(prev => Math.min(36, prev + 2))}
                  title="গ্যাপ ২ বাড়ান"
                >
                  +
                </button>
                <span className="hn-popup-badge-val">{headlineGap}px</span>
              </div>
              <div className="hn-size-presets">
                {[0, 4, 6, 10, 16, 24].map(gp => (
                  <button 
                    key={gp} 
                    type="button"
                    className={`hn-size-preset-btn ${headlineGap === gp ? 'active' : ''}`}
                    onClick={() => setHeadlineGap(gp)}
                  >
                    {gp}px
                  </button>
                ))}
              </div>
            </div>

            <div className="hn-size-divider" />

            {/* Headline Vertical Position Y Controls */}
            <div className="hn-size-popup-section">
              <div className="hn-size-section-label">
                <Move size={12} color="#38bdf8" /> শিরোনামের উচ্চতা / অবস্থান (Position Y)
              </div>
              <div className="hn-size-popup-row">
                <button 
                  type="button"
                  className="hn-popup-step-btn" 
                  onClick={() => setHeadlineY(prev => Math.max(440, prev - 4))}
                  title="উপরে তুলুন"
                >
                  -
                </button>
                <input 
                  type="range" 
                  min="440" 
                  max="680" 
                  value={headlineY} 
                  onChange={(e) => setHeadlineY(Number(e.target.value))} 
                  className="hn-popup-slider" 
                />
                <button 
                  type="button"
                  className="hn-popup-step-btn" 
                  onClick={() => setHeadlineY(prev => Math.min(680, prev + 4))}
                  title="নিচে নামান"
                >
                  +
                </button>
                <span className="hn-popup-badge-val">{headlineY}px</span>
              </div>
              <div className="hn-size-presets">
                {[500, 526, 550, 580, 620].map(py => (
                  <button 
                    key={py} 
                    type="button"
                    className={`hn-size-preset-btn ${headlineY === py ? 'active' : ''}`}
                    onClick={() => setHeadlineY(py)}
                  >
                    {py === 526 ? 'ডিফল্ট' : `${py}px`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hn-headline-item" style={{ marginBottom: `${headlineGap}px` }}>
        <h1 
          ref={headline1Ref}
          className="hn-headline-1 oncard-editable" 
          style={{ 
            color: headline1Color, 
            fontSize: `${headline1FontSize}px`, 
            fontFamily: h1Font.fontFamily,
            fontWeight: h1Font.fontWeight,
            margin: 0 
          }}
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
          style={{ 
            color: headline2Color, 
            fontSize: `${headline2FontSize}px`,
            fontFamily: h2Font.fontFamily,
            fontWeight: h2Font.fontWeight 
          }}
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

            {/* 3. Top Date Display */}
            {renderTopDate()}

            {/* 4. Dynamic Headline Section - In-Place Editable */}
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

            {/* 3. Top Date Display */}
            {renderTopDate()}

            {/* 4. Dynamic Headline Section - In-Place Editable */}
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

            {/* 3. Top Date Display */}
            {renderTopDate()}

            {/* 4. Dynamic Headline Section - In-Place Editable */}
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

      case 'press-studio-65': {
        return (
          <div 
            className="postcard template-ps65" 
            ref={postcardRef}
          >
            {/* 1. Underlying Photo Container */}
            <div 
              ref={photoSlotRef}
              className="ps65-photo-slot"
              onMouseDown={handleMouseDown}
              title="দুই আঙুল দিয়ে জুম এবং ড্র্যাগ করে ছবি পজিশন করুন"
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
                    className="ps65-photo"
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
                  className="ps65-photo-empty"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  ছবি আপলোড করুন
                </div>
              )}

              {/* Floating Camera Button */}
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
              src="/templates/probash-studio-65-overlay.png" 
              className="ps65-master-overlay" 
              alt="Press Studio 65 Frame" 
            />

            {/* 3. Bottom Date Display */}
            {renderPressStudioDate('bottom-right')}

            {/* 4. Dynamic Headline Section */}
            {renderHeadlineArea()}
          </div>
        );
      }

      case 'press-studio-102': {
        return (
          <div 
            className="postcard template-ps102" 
            ref={postcardRef}
          >
            {/* 1. Underlying Photo Container */}
            <div 
              ref={photoSlotRef}
              className="ps102-photo-slot"
              onMouseDown={handleMouseDown}
              title="দুই আঙুল দিয়ে জুম এবং ড্র্যাগ করে ছবি পজিশন করুন"
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
                    className="ps102-photo"
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
                  className="ps102-photo-empty"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  ছবি আপলোড করুন
                </div>
              )}

              {/* Floating Camera Button */}
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
              src="/templates/probash-studio-102-overlay.png" 
              className="ps102-master-overlay" 
              alt="Press Studio 102 Frame" 
            />

            {/* 3. Top Date Display */}
            {renderPressStudioDate('top-right')}

            {/* 4. Dynamic Headline Section */}
            {renderHeadlineArea()}
          </div>
        );
      }

      case 'press-studio-122': {
        return (
          <div 
            className="postcard template-ps122" 
            ref={postcardRef}
          >
            {/* 1. Underlying Photo Container */}
            <div 
              ref={photoSlotRef}
              className="ps122-photo-slot"
              onMouseDown={handleMouseDown}
              title="দুই আঙুল দিয়ে জুম এবং ড্র্যাগ করে ছবি পজিশন করুন"
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
                    className="ps122-photo"
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
                  className="ps122-photo-empty"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  ছবি আপলোড করুন
                </div>
              )}

              {/* Floating Camera Button */}
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
              src="/templates/probash-studio-122-overlay.png" 
              className="ps122-master-overlay" 
              alt="Press Studio 122 Frame" 
            />

            {/* 3. Top Date Display */}
            {renderPressStudioDate('top-right')}

            {/* 4. Dynamic Headline Section */}
            {renderHeadlineArea()}
          </div>
        );
      }

      case 'press-studio-183': {
        return (
          <div 
            className="postcard template-ps183" 
            ref={postcardRef}
          >
            {/* 1. Underlying Photo Container */}
            <div 
              ref={photoSlotRef}
              className="ps183-photo-slot"
              onMouseDown={handleMouseDown}
              title="দুই আঙুল দিয়ে জুম এবং ড্র্যাগ করে ছবি পজিশন করুন"
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
                    className="ps183-photo"
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
                  className="ps183-photo-empty"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  ছবি আপলোড করুন
                </div>
              )}

              {/* Floating Camera Button */}
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
              src="/templates/probash-studio-183-overlay.png" 
              className="ps183-master-overlay" 
              alt="Press Studio 183 Frame" 
            />

            {/* 3. Top Date Display */}
            {renderPressStudioDate('top-right')}

            {/* 4. Dynamic Headline Section */}
            {renderHeadlineArea()}
          </div>
        );
      }

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
              {selectedTemplate === 'hello-probash' ? 'Hello Probash NEWS' : selectedTemplate === 'hello-desh' ? 'Hello Desh' : selectedTemplate === 'hello-nabiganj' ? 'Hello Nabiganj' : selectedTemplate.startsWith('press-studio') ? `Press Studio ${selectedTemplate.split('-')[2]}` : selectedTemplate}
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
          <div className="editor-header-wrap">
            <h2 className="editor-title" style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>
              পোস্টকার্ড এডিটর
            </h2>
            <div className="template-switcher-container">
              <div className="template-switcher">
                <button 
                  type="button" 
                  className={`template-switch-btn ${selectedTemplate === 'hello-probash' ? 'active probash' : ''}`}
                  onClick={() => handleSelectTemplate('hello-probash')}
                  title="হ্যালো প্রবাস নিউজ পোস্টকার্ড"
                >
                  🔴 হ্যালো প্রবাস
                </button>
                <button 
                  type="button" 
                  className={`template-switch-btn ${selectedTemplate === 'hello-desh' ? 'active desh' : ''}`}
                  onClick={() => handleSelectTemplate('hello-desh')}
                  title="হ্যালো দেশ পোস্টকার্ড"
                >
                  🟢 হ্যালো দেশ
                </button>
                <button 
                  type="button" 
                  className={`template-switch-btn ${selectedTemplate === 'hello-nabiganj' ? 'active nabiganj' : ''}`}
                  onClick={() => handleSelectTemplate('hello-nabiganj')}
                  title="হ্যালো নবীগঞ্জ পোস্টকার্ড"
                >
                  🔴 হ্যালো নবীগঞ্জ
                </button>
              </div>
              <div className="template-switcher">
                <button 
                  type="button" 
                  className={`template-switch-btn ${selectedTemplate === 'press-studio-65' ? 'active ps-red' : ''}`}
                  onClick={() => handleSelectTemplate('press-studio-65')}
                  title="প্রেস স্টুডিও ৬৫"
                >
                  🎴 PS-65
                </button>
                <button 
                  type="button" 
                  className={`template-switch-btn ${selectedTemplate === 'press-studio-102' ? 'active ps-red' : ''}`}
                  onClick={() => handleSelectTemplate('press-studio-102')}
                  title="প্রেস স্টুডিও ১০২"
                >
                  🎴 PS-102
                </button>
                <button 
                  type="button" 
                  className={`template-switch-btn ${selectedTemplate === 'press-studio-122' ? 'active ps-dark' : ''}`}
                  onClick={() => handleSelectTemplate('press-studio-122')}
                  title="প্রেস স্টুডিও ১২২"
                >
                  🎴 PS-122
                </button>
                <button 
                  type="button" 
                  className={`template-switch-btn ${selectedTemplate === 'press-studio-183' ? 'active ps-blue' : ''}`}
                  onClick={() => handleSelectTemplate('press-studio-183')}
                  title="প্রেস স্টুডিও ১৮৩"
                >
                  🎴 PS-183
                </button>
              </div>
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

          {/* SECTION: Date */}
          <div className="editor-section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showDate ? '8px' : 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <Calendar size={16} color="#e50914" />
                তারিখ (Date)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#4b5563', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={showDate} 
                  onChange={e => setShowDate(e.target.checked)}
                  style={{ accentColor: '#e50914', cursor: 'pointer' }}
                />
                তারিখ প্রদর্শন
              </label>
            </div>
            {showDate && (
              <>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    className="form-textarea" 
                    value={date} 
                    onChange={e => setDate(e.target.value)}
                    placeholder="উদা: ৩১ অক্টোবর ২০২৬"
                    style={{ flex: 1, padding: '7px 10px', height: '36px', minHeight: 'unset', resize: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setDate(getBengaliToday())}
                    title="আজকের তারিখ সেট করুন"
                    style={{ padding: '7px 10px', fontSize: '12px', whiteSpace: 'nowrap', height: '36px' }}
                  >
                    আজকের তারিখ
                  </button>
                </div>

                <div className="date-style-row">
                  <div className="date-color-controls">
                    <span className="inline-size-tag">রং:</span>
                    <div className="inline-color-picker">
                      {['#1f2937', '#dc2626', '#059669', '#1e3a8a', '#d97706', '#ffffff'].map(col => (
                        <button
                          key={col}
                          type="button"
                          className={`color-dot ${dateColor.toLowerCase() === col.toLowerCase() ? 'active' : ''}`}
                          style={{ backgroundColor: col }}
                          onClick={() => setDateColor(col)}
                          title={col}
                        />
                      ))}
                      <label className="custom-color-btn" title="তারিখের কাস্টম রং বাছুন">
                        <input 
                          type="color" 
                          value={dateColor} 
                          onChange={e => setDateColor(e.target.value)} 
                          style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
                        />
                        <span className="color-wheel-icon" style={{ backgroundColor: dateColor }} />
                      </label>
                    </div>
                  </div>

                  <div className="inline-size-stepper">
                    <span className="inline-size-tag">সাইজ:</span>
                    <button 
                      type="button" 
                      className="inline-step-btn" 
                      onClick={() => setDateFontSize(prev => Math.max(11, prev - 1))}
                      title="তারিখের সাইজ ১px কমান"
                    >
                      -
                    </button>
                    <span className="inline-size-val">{dateFontSize}px</span>
                    <button 
                      type="button" 
                      className="inline-step-btn" 
                      onClick={() => setDateFontSize(prev => Math.min(26, prev + 1))}
                      title="তারিখের সাইজ ১px বাড়ান"
                    >
                      +
                    </button>
                  </div>

                  <select 
                    className="font-family-select"
                    value={dateFontFamily}
                    onChange={e => setDateFontFamily(e.target.value)}
                    title="তারিখের ফন্ট বাছুন"
                  >
                    {BENGALI_FONTS.map(f => (
                      <option key={f.id} value={f.id} style={{ fontFamily: f.family, fontWeight: f.weight }}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* SECTION: Headlines */}
          <div className="editor-section-card">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={16} color="#e50914" />
              খবরের শিরোনাম
            </label>

            <div className="form-group">
              <div className="form-sublabel-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <label className="form-sublabel" style={{ margin: 0 }}>শিরোনাম ১ম লাইন</label>
                  <select 
                    className="font-family-select"
                    value={headline1FontFamily}
                    onChange={e => setHeadline1FontFamily(e.target.value)}
                    title="১ম লাইনের ফন্ট নির্বাচন করুন"
                  >
                    {BENGALI_FONTS.map(f => (
                      <option key={f.id} value={f.id} style={{ fontFamily: f.family, fontWeight: f.weight }}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-sublabel-actions">
                  <div className="inline-color-picker">
                    {['#ffffff', '#ffcb05', '#38bdf8', '#4ade80', '#fb923c'].map(col => (
                      <button
                        key={col}
                        type="button"
                        className={`color-dot ${headline1Color.toLowerCase() === col.toLowerCase() ? 'active' : ''}`}
                        style={{ backgroundColor: col }}
                        onClick={() => setHeadline1Color(col)}
                        title={col}
                      />
                    ))}
                    <label className="custom-color-btn" title="কাস্টম রং বাছুন">
                      <input 
                        type="color" 
                        value={headline1Color} 
                        onChange={e => setHeadline1Color(e.target.value)} 
                        style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
                      />
                      <span className="color-wheel-icon" style={{ backgroundColor: headline1Color }} />
                    </label>
                  </div>

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <label className="form-sublabel" style={{ margin: 0 }}>শিরোনাম ২য় লাইন</label>
                  <select 
                    className="font-family-select"
                    value={headline2FontFamily}
                    onChange={e => setHeadline2FontFamily(e.target.value)}
                    title="২য় লাইনের ফন্ট নির্বাচন করুন"
                  >
                    {BENGALI_FONTS.map(f => (
                      <option key={f.id} value={f.id} style={{ fontFamily: f.family, fontWeight: f.weight }}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-sublabel-actions">
                  <div className="inline-color-picker">
                    {['#ffcb05', '#ffffff', '#38bdf8', '#a3e635', '#f87171'].map(col => (
                      <button
                        key={col}
                        type="button"
                        className={`color-dot ${headline2Color.toLowerCase() === col.toLowerCase() ? 'active' : ''}`}
                        style={{ backgroundColor: col }}
                        onClick={() => setHeadline2Color(col)}
                        title={col}
                      />
                    ))}
                    <label className="custom-color-btn" title="কাস্টম রং বাছুন">
                      <input 
                        type="color" 
                        value={headline2Color} 
                        onChange={e => setHeadline2Color(e.target.value)} 
                        style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
                      />
                      <span className="color-wheel-icon" style={{ backgroundColor: headline2Color }} />
                    </label>
                  </div>

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
              </div>
              <textarea 
                className="form-textarea" 
                value={headline2} 
                onChange={e => setHeadline2(e.target.value)}
                placeholder="২য় লাইনের হাইলাইট শিরোনাম..."
                rows={2}
              />
            </div>

            {/* Headline Position & Line Gap Controls */}
            <div className="headline-gap-card-row" style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px dashed #e5e7eb', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Row: Vertical Position Y */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span className="form-sublabel" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Move size={14} color="#0284c7" /> উচ্চতা / অবস্থান (Position Y)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input 
                    type="range" 
                    min="440" 
                    max="680" 
                    value={headlineY} 
                    onChange={e => setHeadlineY(Number(e.target.value))} 
                    style={{ width: '75px', accentColor: '#0284c7', cursor: 'pointer', height: '5px' }}
                  />
                  <div className="inline-size-stepper">
                    <button 
                      type="button" 
                      className="inline-step-btn" 
                      onClick={() => setHeadlineY(prev => Math.max(440, prev - 4))}
                      title="উপরে তুলুন"
                    >
                      -
                    </button>
                    <span className="inline-size-val" style={{ minWidth: '38px' }}>{headlineY}px</span>
                    <button 
                      type="button" 
                      className="inline-step-btn" 
                      onClick={() => setHeadlineY(prev => Math.min(680, prev + 4))}
                      title="নিচে নামান"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Row: Line Gap */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span className="form-sublabel" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MoveVertical size={14} color="#8b5cf6" /> লাইনের দূরত্ব (Gap)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="36" 
                    value={headlineGap} 
                    onChange={e => setHeadlineGap(Number(e.target.value))} 
                    style={{ width: '75px', accentColor: '#8b5cf6', cursor: 'pointer', height: '5px' }}
                  />
                  <div className="inline-size-stepper">
                    <button 
                      type="button" 
                      className="inline-step-btn" 
                      onClick={() => setHeadlineGap(prev => Math.max(0, prev - 2))}
                      title="গ্যাপ ২px কমান"
                    >
                      -
                    </button>
                    <span className="inline-size-val" style={{ minWidth: '32px' }}>{headlineGap}px</span>
                    <button 
                      type="button" 
                      className="inline-step-btn" 
                      onClick={() => setHeadlineGap(prev => Math.min(36, prev + 2))}
                      title="গ্যাপ ২px বাড়ান"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>💡 কার্ডে "পজিশন সরান" বাটন ড্র্যাগ করেও সরানো যায়</span>
              </div>
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
                  <label className="quick-color-indicator" title="১ম লাইনের রং পরিবর্তন করুন">
                    <input 
                      type="color" 
                      value={headline1Color} 
                      onChange={e => setHeadline1Color(e.target.value)} 
                      style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
                    />
                    <span className="quick-color-dot" style={{ backgroundColor: headline1Color }} />
                  </label>
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
                  <label className="quick-color-indicator" title="২য় লাইনের রং পরিবর্তন করুন">
                    <input 
                      type="color" 
                      value={headline2Color} 
                      onChange={e => setHeadline2Color(e.target.value)} 
                      style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
                    />
                    <span className="quick-color-dot" style={{ backgroundColor: headline2Color }} />
                  </label>
                </div>
              </div>

              {/* Row 3: Headline Line Spacing / Gap */}
              <div className="quick-bar-row">
                <span className="quick-bar-label">
                  <MoveVertical size={13} color="#8b5cf6" /> গ্যাপ:
                </span>
                <div className="quick-bar-controls">
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setHeadlineGap(prev => Math.max(0, prev - 2))}
                    title="লাইন গ্যাপ ২ কমান"
                  >
                    -
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="36" 
                    value={headlineGap} 
                    onChange={e => setHeadlineGap(Number(e.target.value))} 
                    className="quick-slider"
                  />
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setHeadlineGap(prev => Math.min(36, prev + 2))}
                    title="লাইন গ্যাপ ২ বাড়ান"
                  >
                    +
                  </button>
                  <span 
                    className="quick-val-pill"
                    onClick={() => setShowFontSizePopup(prev => !prev)}
                    title="লাইন গ্যাপ পপআপ"
                  >
                    {headlineGap}px
                  </span>
                </div>
              </div>

              {/* Row 4: Headline Vertical Position (উচ্চতা / নিচে নামানো) */}
              <div className="quick-bar-row">
                <span className="quick-bar-label">
                  <Move size={13} color="#0284c7" /> উচ্চতা:
                </span>
                <div className="quick-bar-controls">
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setHeadlineY(prev => Math.max(440, prev - 4))}
                    title="হেডলাইন উপরে তুলুন"
                  >
                    -
                  </button>
                  <input 
                    type="range" 
                    min="440" 
                    max="680" 
                    value={headlineY} 
                    onChange={e => setHeadlineY(Number(e.target.value))} 
                    className="quick-slider"
                  />
                  <button 
                    type="button" 
                    className="quick-step-btn" 
                    onClick={() => setHeadlineY(prev => Math.min(680, prev + 4))}
                    title="হেডলাইন নিচে নামান"
                  >
                    +
                  </button>
                  <span 
                    className="quick-val-pill"
                    onClick={() => setShowFontSizePopup(prev => !prev)}
                    title="পজিশন পপআপ"
                  >
                    {headlineY}px
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

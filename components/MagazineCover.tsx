import React, { useState, useEffect } from 'react';
import { getMagazineById } from '../src/config/magazines';
import { cn } from '../lib/utils';

type ImageStatus = 'pending' | 'done' | 'error';

interface MagazineCoverProps {
    imageUrl?: string;
    caption: string;
    status: ImageStatus;
    error?: string;
    dragConstraintsRef?: React.RefObject<HTMLElement>;
    onShake?: (caption: string) => void;
    onDownload?: (caption: string) => void;
    isMobile?: boolean;
    magazineId?: string;  // NEW: 支持多杂志
    creativeStyle?: string;  // NEW: 支持创意风格
}

// 获取杂志特定的标题
const getMagazineHeadline = (decade: string, magazineId: string): { main: string; sub: string } => {
    const headlines: Record<string, { main: string; sub: string }> = {
        '1920s': { main: 'The Jazz Age', sub: 'Flapper Dreams' },
        '1930s': { main: 'Silver Screen', sub: 'Hollywood Glamour' },
        '1940s': { main: 'Victory Beauty', sub: 'Rosie the Riveter' },
        '1950s': { main: 'All-American', sub: 'Pin-Up Classic' },
        '1960s': { main: 'Swinging Sixties', sub: 'Mod Revolution' },
        '1970s': { main: 'Disco Queen', sub: 'Retro Revival' },
        '1980s': { main: 'Power Glamour', sub: 'Flashdance Era' },
        '1990s': { main: 'Gen X Cool', sub: 'Minimalist Beauty' },
        '2000s': { main: 'Y2K Icon', sub: 'Digital Age' },
        '2010s': { main: 'Influencer Style', sub: 'Instagram Era' },
        '2020s': { main: 'Quiet Luxury', sub: 'Modern Icon' },
        '2030s': { main: 'Neo-Human', sub: 'Future Classic' },
        '2040s': { main: 'Transhumanist', sub: 'Cybernetic Beauty' },
        '2050s': { main: 'Post-Singular', sub: 'Cosmic Visionary' },
        '2100s': { main: 'Galactic Icon', sub: 'Stellar Beauty' },
        'The Icon': { main: 'The Icon', sub: 'Original Portrait' },
        'The Original': { main: 'The Original', sub: 'Source Image' },
    };
    return headlines[decade] || { main: 'Fashion Forward', sub: 'Timeless Beauty' };
};

// 获取创意风格叠加效果
const getCreativeStyleOverlay = (styleId?: string): { filter?: string; gradient?: string } => {
    const styles: Record<string, { filter?: string; gradient?: string }> = {
        'vintage-retro': { filter: 'sepia(30%) contrast(90%)', gradient: 'rgba(139, 90, 43, 0.1)' },
        'cyberpunk': { filter: 'saturate(1.5) contrast(1.2)', gradient: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))' },
        'vaporwave': { filter: 'saturate(1.2) hue-rotate(20deg)', gradient: 'linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(0, 255, 255, 0.2))' },
        'neoclassical': { filter: 'sepia(20%) saturate(1.1)', gradient: 'rgba(212, 175, 55, 0.15)' },
        'film-noir': { filter: 'grayscale(100%) contrast(1.3)', gradient: 'rgba(0, 0, 0, 0.3)' },
        'glitch-art': { filter: 'contrast(1.5) saturate(1.5)', gradient: 'linear-gradient(90deg, rgba(255, 0, 0, 0.1), rgba(0, 255, 0, 0.1), rgba(0, 0, 255, 0.1))' },
    };
    return styles[styleId || ''] || {};
};

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-8 w-8 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const ErrorDisplay = () => (
    <div className="flex items-center justify-center h-full p-4 text-center">
         <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-red-500 font-sans uppercase tracking-widest">Generation Failed</span>
         </div>
    </div>
);

const Placeholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300 border-2 border-dashed border-neutral-700 m-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-playfair italic text-xl">Upload Portrait</span>
    </div>
);

const MagazineCover: React.FC<MagazineCoverProps> = ({
    imageUrl,
    caption,
    status,
    error,
    dragConstraintsRef,
    onShake,
    onDownload,
    isMobile,
    magazineId = 'bazaar',
    creativeStyle
}) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const magazine = getMagazineById(magazineId);
    const headline = getMagazineHeadline(caption, magazineId);
    const styleOverlay = getCreativeStyleOverlay(creativeStyle);

    useEffect(() => {
        if (status === 'pending') {
            setIsImageLoaded(false);
        }
    }, [imageUrl, status]);

    // 杂志特定的样式
    const magazineStyles = {
        background: magazine?.colorScheme.background || '#ffffff',
        textColor: magazine?.colorScheme.text || '#000000',
        accentColor: magazine?.colorScheme.accent || '#d4af37',
        secondaryColor: magazine?.colorScheme.secondary || '#666666',
        highlightColor: magazine?.colorScheme.highlight || '#f5f5f5',
    };

    // 获取字体类
    const getMagazineFonts = () => {
        const fontMap: Record<string, string> = {
            'bazaar': 'font-playfair',
            'vogue': 'font-didot',
            'elle': 'font-montserrat',
            'gq': 'font-bebas',
            'vanity-fair': 'font-bodoni',
            'lofficiel': 'font-space-grotesk',
            'interview': 'font-typewriter',
            'id-magazine': 'font-helvetica',
            'w-magazine': 'font-caslon',
        };
        return fontMap[magazineId] || 'font-playfair';
    };

    const cardInnerContent = (
        <div 
            className="w-full h-full relative overflow-hidden group bg-white shadow-2xl"
            style={{ background: magazineStyles.background }}
        >
            {status === 'pending' && <LoadingSpinner />}
            {status === 'error' && <ErrorDisplay />}
            {status === 'done' && imageUrl && (
                <>
                    {/* Image with style overlay */}
                    <div className="relative w-full h-full">
                        <img
                            src={imageUrl}
                            alt={caption}
                            onLoad={() => setIsImageLoaded(true)}
                            className={cn(
                                "w-full h-full object-cover transition-opacity duration-700",
                                isImageLoaded ? "opacity-100" : "opacity-0"
                            )}
                            style={{
                                filter: styleOverlay.filter,
                            }}
                        />
                        {/* Creative style gradient overlay */}
                        {styleOverlay.gradient && (
                            <div 
                                className="absolute inset-0 pointer-events-none"
                                style={{ background: styleOverlay.gradient }}
                            />
                        )}
                    </div>
                    
                    {/* Magazine Overlay */}
                    <div 
                        className="absolute inset-0 flex flex-col pointer-events-none"
                        style={{ 
                            background: magazineId === 'interview' 
                                ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%, transparent 70%, rgba(0,0,0,0.5) 100%)'
                                : 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.4) 100%)'
                        }}
                    >
                        {/* Header - Magazine specific positioning */}
                        <div className={cn(
                            "pt-6 px-4 text-center",
                            magazine?.coverLayout.headerPosition === 'center' && "flex-1 flex flex-col justify-center pt-0"
                        )}>
                            {/* Magazine Name */}
                            <h2 
                                className={cn(
                                    "text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none",
                                    getMagazineFonts(),
                                    magazineId === 'interview' || magazineId === 'lofficiel' ? 'text-white' : ''
                                )}
                                style={{ color: magazineId === 'interview' || magazineId === 'lofficiel' ? '#ffffff' : magazineStyles.textColor }}
                            >
                                {magazine?.name.split("'")[0] || "Harper's"}
                            </h2>
                            <h2 
                                className={cn(
                                    "text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none -mt-2",
                                    getMagazineFonts(),
                                    magazineId === 'interview' || magazineId === 'lofficiel' ? 'text-white' : ''
                                )}
                                style={{ color: magazineId === 'interview' || magazineId === 'lofficiel' ? '#ffffff' : magazineStyles.textColor }}
                            >
                                {magazine?.name.includes("'") ? magazine.name.split("'")[1] : magazine?.name || 'BAZAAR'}
                            </h2>
                            
                            {/* Divider */}
                            <div 
                                className="h-[2px] w-full mt-1"
                                style={{ background: magazineId === 'interview' || magazineId === 'lofficiel' ? '#ffffff' : magazineStyles.textColor }}
                            />
                            
                            {/* Subheader */}
                            <div className={cn(
                                "flex justify-between text-[10px] font-sans font-bold tracking-widest uppercase mt-1 px-1",
                                magazineId === 'interview' || magazineId === 'lofficiel' ? 'text-white/80' : ''
                            )}
                            style={{ color: magazineId === 'interview' || magazineId === 'lofficiel' ? 'rgba(255,255,255,0.8)' : magazineStyles.secondaryColor }}
                            >
                                <span>{caption}</span>
                                <span>{magazine?.tagline || 'Special Edition'}</span>
                            </div>
                        </div>

                        {/* Headlines */}
                        <div className="mt-auto pb-12 px-6 flex flex-col gap-4">
                            {/* Featured headline badge */}
                            <div 
                                className="self-start px-2 py-1"
                                style={{ background: magazineId === 'id-magazine' ? '#ffdd00' : magazineStyles.textColor }}
                            >
                                <span 
                                    className="text-xs font-bold uppercase tracking-widest"
                                    style={{ color: magazineId === 'id-magazine' ? '#000000' : magazineStyles.background }}
                                >
                                    {magazine?.coverLayout.headerPosition === 'center' ? 'Cover Story' : 'The Future of Style'}
                                </span>
                            </div>
                            
                            {/* Main headline */}
                            <div style={{ color: magazineStyles.background }}>
                                <h3 className={cn(
                                    "text-2xl font-bold leading-tight",
                                    magazineId === 'vogue' ? 'font-didot italic' : 'font-playfair italic'
                                )}>
                                    {headline.main}
                                </h3>
                                <p className={cn(
                                    "text-[10px] font-sans font-bold uppercase tracking-widest mt-1",
                                    magazineId === 'interview' ? 'text-white/70' : ''
                                )}
                                style={{ color: magazineId === 'interview' ? 'rgba(255,255,255,0.7)' : magazineStyles.highlightColor }}
                                >
                                    {headline.sub}
                                </p>
                            </div>

                            {/* Magazine accent (for some magazines) */}
                            {(magazineId === 'vanity-fair' || magazineId === 'lofficiel') && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-[2px]" style={{ background: magazineStyles.accentColor }} />
                                    <span className="text-[8px] uppercase tracking-widest" style={{ color: magazineStyles.accentColor }}>
                                        Est. {magazineId === 'vanity-fair' ? '1913' : '1921'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={cn(
                        "absolute top-4 right-4 z-20 flex flex-col gap-2 transition-opacity duration-300",
                        !isMobile && "opacity-0 group-hover:opacity-100",
                    )}>
                        {onDownload && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDownload(caption);
                                }}
                                className="p-2 bg-black/80 rounded-full text-white hover:bg-black focus:outline-none"
                                aria-label={`Download cover for ${caption}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        )}
                        {onShake && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShake(caption);
                                }}
                                className="p-2 bg-black/80 rounded-full text-white hover:bg-black focus:outline-none"
                                aria-label={`Regenerate cover for ${caption}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.186l-1.42.71a5.002 5.002 0 00-8.479-1.554H10a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.899-2.186l1.42-.71a5.002 5.002 0 008.479 1.554H10a1 1 0 110-2h6a1 1 0 011 1v6a1 1 0 01-1 1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                </>
            )}
            {status === 'done' && !imageUrl && <Placeholder />}
        </div>
    );

    if (isMobile) {
        return (
            <div 
                className="bg-white p-0 flex flex-col items-center justify-start aspect-[2/3] w-80 max-w-full rounded-none shadow-2xl relative border-[8px] border-white"
                style={{ 
                    borderColor: magazineId === 'id-magazine' ? '#ffdd00' 
                        : magazineId === 'interview' ? '#000000' 
                        : '#ffffff' 
                }}
            >
                {cardInnerContent}
            </div>
        );
    }

    return (
        <div 
            className="bg-white p-0 flex flex-col items-center justify-start aspect-[2/3] w-80 max-w-full rounded-none shadow-2xl border-[8px]"
            style={{ 
                borderColor: magazineId === 'id-magazine' ? '#ffdd00' 
                    : magazineId === 'interview' ? '#000000' 
                    : '#ffffff',
                borderWidth: magazine?.coverLayout.borderStyle === 'thick' ? '12px' : '8px',
                borderStyle: magazine?.coverLayout.borderStyle === 'ornate' ? 'double' : 'solid',
            }}
        >
            {cardInnerContent}
        </div>
    );
};

export default MagazineCover;

import React, { useState } from 'react';

interface BrandMarkProps {
  className?: string;
  imgClassName?: string;
  fallbackClassName?: string;
}

export default function BrandMark({
  className = '',
  imgClassName = '',
  fallbackClassName = '',
}: BrandMarkProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={className}>
        <span className={`font-playfair text-white text-4xl md:text-6xl ${fallbackClassName}`}>
          CoverShift
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src="/brand/covershift-logo.png"
        alt="CoverShift Logo"
        className={imgClassName}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import { useStore } from '../store/useStore';

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ targetRef }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { language } = useStore();

  const handleExport = async () => {
    if (!targetRef.current) return;
    setIsExporting(true);

    try {
      // 1. Generate QR Code
      const url = typeof window !== 'undefined' ? window.location.href : 'https://world-cup.tc9011.com';
      const qrCodeUrl = await QRCode.toDataURL(url, {
        width: 120,
        margin: 0,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      // 2. Calculate Dimensions from Original Element
      // We do this BEFORE cloning to get accurate scroll dimensions
      const element = targetRef.current;
      let maxScrollWidth = element.scrollWidth;
      
      // Traverse to find the widest content
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);
      while (walker.nextNode()) {
        const node = walker.currentNode as HTMLElement;
        if (node.scrollWidth > maxScrollWidth) {
          maxScrollWidth = node.scrollWidth;
        }
      }
      
      const finalWidth = maxScrollWidth + 60; // Add padding
      // We'll calculate height after expanding the clone

      // 3. Create Clone
      const clone = element.cloneNode(true) as HTMLElement;

      // 4. Setup Clone Container
      // We use a wrapper to ensure the clone is isolated but rendered
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '200vw'; // Move far right
      container.style.top = '0';
      container.style.zIndex = '-9999';
      container.style.width = `${finalWidth}px`; // Force container width
      container.style.height = 'auto';
      container.style.overflow = 'visible'; // Allow content to show
      
      // Determine Theme Colors
      const isDark = document.documentElement.classList.contains('dark');
      const bgColor = isDark ? '#0f172a' : '#f8fafc'; // slate-900 : slate-50
      const textColor = isDark ? '#f1f5f9' : '#1e293b';
      const borderColor = isDark ? '#334155' : '#e2e8f0';

      // Apply solid background to clone to prevent transparency issues
      clone.style.background = bgColor;
      clone.style.width = '100%';
      clone.style.height = 'auto';
      clone.style.overflow = 'visible';
      clone.style.maxHeight = 'none';
      clone.style.maxWidth = 'none';
      clone.style.borderRadius = '0'; // Remove rounded corners for the screenshot
      clone.style.border = 'none';
      clone.style.boxShadow = 'none';
      clone.style.transform = 'none';

      // 5. Process Clone Children
      const processNode = (node: HTMLElement) => {
        // Fix Sticky
        if (node.classList.contains('sticky') || getComputedStyle(node).position === 'sticky') {
            node.style.position = 'relative';
            node.style.left = 'auto';
            node.style.top = 'auto';
        }
        
        // Expand Scroll Containers
        if (node.classList.contains('overflow-x-auto') || 
            node.classList.contains('overflow-auto') ||
            node.style.overflowX === 'auto') {
            node.style.overflow = 'visible';
            node.style.width = '100%'; // Fill the parent (which is already wide)
            node.style.maxWidth = 'none';
            node.style.display = 'block';
        }
        
        // Fix ScheduleMatrix inner container
        if (node.classList.contains('min-w-[2000px]')) {
             node.style.width = '100%'; 
             node.style.minWidth = 'auto';
        }

        // Recurse
        Array.from(node.children).forEach(child => {
            if (child instanceof HTMLElement) processNode(child);
        });
      };
      processNode(clone);

      // 6. Add Footer
      const footer = document.createElement('div');
      footer.style.width = '100%';
      footer.style.height = '150px';
      footer.style.display = 'flex';
      footer.style.justifyContent = 'space-between';
      footer.style.alignItems = 'center';
      footer.style.padding = '30px 50px';
      footer.style.boxSizing = 'border-box';
      footer.style.background = bgColor;
      footer.style.borderTop = `1px solid ${borderColor}`;
      footer.style.color = textColor;
      footer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      footer.style.marginTop = '40px';

      // Left side
      const textContainer = document.createElement('div');
      const title = document.createElement('h2');
      title.innerText = '2026 FIFA World Cup Guide';
      title.style.margin = '0 0 8px 0';
      title.style.fontSize = '32px';
      title.style.fontWeight = '800';
      title.style.letterSpacing = '-0.02em';
      title.style.color = textColor;
      
      const subtitle = document.createElement('p');
      subtitle.innerText = language === 'zh' ? '扫描二维码查看实时赛程与积分榜' : 'Scan to view live schedule & standings';
      subtitle.style.margin = '0';
      subtitle.style.fontSize = '18px';
      subtitle.style.opacity = '0.7';
      subtitle.style.color = textColor;

      textContainer.appendChild(title);
      textContainer.appendChild(subtitle);

      // Right side
      const qrContainer = document.createElement('div');
      qrContainer.style.display = 'flex';
      qrContainer.style.alignItems = 'center';
      qrContainer.style.gap = '20px';
      qrContainer.style.background = '#fff';
      qrContainer.style.padding = '12px';
      qrContainer.style.borderRadius = '16px';
      qrContainer.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';

      const qrImage = document.createElement('img');
      qrImage.src = qrCodeUrl;
      qrImage.style.width = '80px';
      qrImage.style.height = '80px';
      qrImage.style.display = 'block';

      qrContainer.appendChild(qrImage);
      footer.appendChild(textContainer);
      footer.appendChild(qrContainer);
      
      clone.appendChild(footer);
      container.appendChild(clone);
      document.body.appendChild(container);

      // 7. Wait for layout and images
      await new Promise(resolve => setTimeout(resolve, 500)); // Give it 500ms to render

      // 8. Capture
      const finalHeight = clone.scrollHeight;
      
      const dataUrl = await toPng(clone, {
        width: finalWidth,
        height: finalHeight,
        backgroundColor: bgColor,
        cacheBust: true,
        style: {
            transform: 'none', // Ensure no transforms affect the capture
        }
      });

      // 9. Download
      const link = document.createElement('a');
      link.download = `world-cup-2026-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      // 10. Cleanup
      document.body.removeChild(container);

    } catch (err) {
      console.error('Failed to export image:', err);
      alert(language === 'zh' ? '导出图片失败，请重试' : 'Failed to export image, please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 disabled:opacity-50"
      title={language === 'zh' ? '导出图片' : 'Export Image'}
    >
      {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
    </button>
  );
};

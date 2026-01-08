import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportButton } from '../ExportButton';
import React, { useRef } from 'react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as htmlToImage from 'html-to-image';

// Mock html-to-image
vi.mock('html-to-image', () => ({
  toPng: vi.fn(),
}));

// Mock qrcode
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,qr-code'),
  },
}));

// Mock store
vi.mock('../store/useStore', () => ({
  useStore: () => ({
    language: 'en',
  }),
}));

const mockDrawImage = vi.fn();

describe('ExportButton', () => {
    let originalGetContext: any; // eslint-disable-line @typescript-eslint/no-explicit-any

    beforeEach(() => {
        vi.clearAllMocks();
        originalGetContext = HTMLCanvasElement.prototype.getContext;
        
        // Mock getContext
        HTMLCanvasElement.prototype.getContext = vi.fn((type) => {
            if (type === '2d') {
                return {
                    drawImage: mockDrawImage,
                    fillStyle: '',
                    fillRect: vi.fn(),
                } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
            }
            return null;
        });
    });

    afterEach(() => {
        HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      return (
        <div>
          <div ref={ref} id="target">
            <h1>Title</h1>
            <canvas width={100} height={100} data-testid="test-canvas" className="origin-canvas" />
          </div>
          <ExportButton targetRef={ref} />
        </div>
      );
    };

    it('copies canvas content to cloned element', async () => {
        render(<TestComponent />);
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(htmlToImage.toPng).toHaveBeenCalled();
        });
        
        // Check if drawImage was called
        expect(mockDrawImage).toHaveBeenCalled();
        
        // Verify arguments: drawImage(sourceCanvas, 0, 0)
        // Source canvas should be the original canvas from the DOM
        const originCanvas = screen.getByTestId('test-canvas');
        
        // We expect at least one call where the first argument is the originCanvas
        const calledWithOriginal = mockDrawImage.mock.calls.some(call => call[0] === originCanvas);
        expect(calledWithOriginal).toBe(true);
    });
});

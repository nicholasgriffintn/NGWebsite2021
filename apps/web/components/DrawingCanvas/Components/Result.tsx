import { getImageUrl } from '../utils';

import { DrawingResponse } from '../types';

export function Result({ apiResult }: { apiResult: DrawingResponse }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {apiResult?.response?.data?.drawingUrl?.key && (
        <div className="space-y-3 w-full">
          <h3 className="text-lg font-medium">Your Drawing</h3>
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
            <img
              src={getImageUrl(apiResult.response.data.drawingUrl.key)}
              alt="Your drawing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      {apiResult?.response?.data?.paintingUrl?.key && (
        <div className="space-y-3 w-full">
          <h3 className="text-lg font-medium">AI Generated Painting</h3>
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
            <img
              src={getImageUrl(apiResult.response.data.paintingUrl.key)}
              alt="AI generated painting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}

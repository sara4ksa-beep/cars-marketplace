export default function CarSkeleton() {
  return (
    <div className="card-modern overflow-hidden">
      <div className="card-image-wrapper skeleton-loader"></div>
      <div className="p-4 sm:p-5">
        <div className="h-5 skeleton-loader rounded-lg mb-2"></div>
        <div className="h-4 skeleton-loader rounded-lg mb-3 w-3/4"></div>
        <div className="h-6 skeleton-loader rounded-lg mb-4 w-1/2"></div>
        <div className="h-10 skeleton-loader rounded-xl"></div>
      </div>
    </div>
  );
}


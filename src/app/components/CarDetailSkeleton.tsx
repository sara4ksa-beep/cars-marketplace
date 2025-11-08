export default function CarDetailSkeleton() {
  return (
    <div className="min-h-screen relative">

      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 py-12 md:py-20 relative overflow-hidden min-h-[40vh]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Brand Badge Skeleton */}
            <div className="inline-block">
              <div className="h-10 w-32 bg-white/30 rounded-full skeleton-loader"></div>
            </div>
            
            {/* Title Skeleton */}
            <div className="space-y-3">
              <div className="h-12 w-3/4 mx-auto bg-white/30 rounded-lg skeleton-loader"></div>
              <div className="h-12 w-1/2 mx-auto bg-white/30 rounded-lg skeleton-loader"></div>
            </div>
            
            {/* Year Skeleton */}
            <div className="h-6 w-24 mx-auto bg-white/30 rounded-lg skeleton-loader"></div>
            
            {/* Price Badge Skeleton */}
            <div className="h-16 w-48 mx-auto bg-white/40 rounded-2xl skeleton-loader"></div>
            
            {/* Button Skeleton */}
            <div className="h-12 w-40 mx-auto bg-white/30 rounded-xl skeleton-loader"></div>
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              
              {/* Images Column Skeleton */}
              <div className="space-y-6">
                {/* Main Image Skeleton */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200 skeleton-loader"></div>
                </div>
                
                {/* Additional Images Skeleton */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="h-6 w-32 bg-gray-200 rounded-lg skeleton-loader mb-4"></div>
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg skeleton-loader"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Column Skeleton */}
              <div className="space-y-6">
                {/* Price Card Skeleton */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="space-y-4">
                    <div className="h-12 w-48 mx-auto bg-gray-200 rounded-lg skeleton-loader"></div>
                    <div className="h-6 w-32 mx-auto bg-gray-200 rounded-lg skeleton-loader"></div>
                    <div className="h-12 w-full bg-gray-200 rounded-xl skeleton-loader mt-6"></div>
                  </div>
                </div>

                {/* Specifications Card Skeleton */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="h-8 w-40 bg-gray-200 rounded-lg skeleton-loader mb-6"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded skeleton-loader"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded skeleton-loader"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description Card Skeleton */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="h-8 w-32 bg-gray-200 rounded-lg skeleton-loader mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded skeleton-loader"></div>
                    <div className="h-4 w-full bg-gray-200 rounded skeleton-loader"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded skeleton-loader"></div>
                    <div className="h-4 w-full bg-gray-200 rounded skeleton-loader"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded skeleton-loader"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


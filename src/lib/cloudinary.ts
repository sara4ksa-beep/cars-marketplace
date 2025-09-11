import { v2 as cloudinary } from 'cloudinary';

// تكوين Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// دالة لرفع صورة واحدة
export const uploadImage = async (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // تحويل الملف إلى ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // إنشاء stream للرفع
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cars', // مجلد في Cloudinary
          transformation: [
            { width: 800, height: 600, crop: 'fill' }, // تحسين الحجم
            { quality: 'auto' }, // ضغط تلقائي
            { format: 'auto' } // تنسيق تلقائي (WebP إذا كان مدعوماً)
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result?.secure_url);
            resolve(result?.secure_url || '');
          }
        }
      );
      
      // رفع البيانات
      uploadStream.end(buffer);
    } catch (error) {
      console.error('Error processing file:', error);
      reject(error);
    }
  });
};

// دالة لحذف صورة
export const deleteImage = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Cloudinary delete error:', error);
        reject(error);
      } else {
        console.log('Cloudinary delete success:', result);
        resolve();
      }
    });
  });
}; 
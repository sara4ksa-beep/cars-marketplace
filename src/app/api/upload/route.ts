import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('File received:', file?.name, file?.size, file?.type);
    
    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log('File buffer size:', buffer.length);

    // إنشاء مجلد uploads إذا لم يكن موجوداً
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    console.log('Uploads directory:', uploadsDir);
    
    // التأكد من وجود المجلد
    if (!existsSync(uploadsDir)) {
      console.log('Creating uploads directory');
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // إنشاء اسم فريد للملف
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    
    console.log('File path:', filePath);

    // حفظ الملف
    await writeFile(filePath, buffer);
    
    console.log('File uploaded successfully:', fileName);
    console.log('File saved at:', filePath);
    
    // التحقق من وجود الملف بعد الحفظ
    if (existsSync(filePath)) {
      console.log('File exists after save');
    } else {
      console.log('File does not exist after save');
    }
    
    return NextResponse.json({ 
      success: true, 
      fileName: fileName,
      url: `/uploads/${fileName}` 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
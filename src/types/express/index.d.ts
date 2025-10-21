// Đây là interface (khuôn mẫu) cho dữ liệu

interface UserPayload {
  id: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}

export {};

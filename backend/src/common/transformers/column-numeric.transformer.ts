import { ValueTransformer } from 'typeorm';

/**
 * Transformer cho cột numeric/decimal trong PostgreSQL.
 *
 * Driver `pg` trả về kiểu numeric dưới dạng CHUỖI (string) để tránh mất độ
 * chính xác. Transformer này:
 *  - khi đọc từ DB (from): ép chuỗi -> number để dùng trong code.
 *  - khi ghi xuống DB (to): giữ nguyên number, TypeORM tự đưa vào numeric(18,2).
 *
 * TUYỆT ĐỐI không dùng float ở tầng cột — cột vẫn là numeric(18,2),
 * transformer chỉ phục vụ tầng ứng dụng.
 */
export class ColumnNumericTransformer implements ValueTransformer {
  // JS -> DB
  to(value: number | null): number | null {
    return value;
  }

  // DB -> JS
  from(value: string | null): number | null {
    if (value === null || value === undefined) {
      return value as null;
    }
    return parseFloat(value);
  }
}

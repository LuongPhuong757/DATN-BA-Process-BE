# Image Processor API

NestJS API để xử lý kết quả phân tích hình ảnh và lưu vào MySQL database.

## Yêu cầu hệ thống

Trước khi chạy ứng dụng, hãy đảm bảo bạn đã cài đặt:

- Node.js (v16 trở lên)
- npm hoặc yarn
- MySQL database server

## Cài đặt

1. Clone repository và di chuyển vào thư mục dự án:
```bash
cd "Image process Be"
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Thiết lập environment variables:
```bash
# Copy file environment mẫu
cp .env.example .env

# Chỉnh sửa file .env với thông tin database thực tế
nano .env
```

## Cấu hình Environment

Tạo file `.env` dựa trên `.env.example` và cấu hình các biến sau:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=image_processor_db

# Application Configuration
PORT=4003
NODE_ENV=development

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

## Thiết lập Database

### 1. Tạo Database

Đầu tiên, tạo database MySQL:

```sql
CREATE DATABASE image_processor_db;
```

### 2. Chạy Migrations

Ứng dụng sử dụng TypeORM migrations để quản lý database schema. Thực hiện các bước sau:

#### Tạo Migration (nếu cần)
```bash
# Tạo migration mới dựa trên thay đổi entity
npm run migration:generate -- src/migrations/YourMigrationName
```

#### Chạy Migrations
```bash
# Chạy tất cả migrations đang chờ
npm run migration:run
```

#### Kiểm tra trạng thái Migration
```bash
# Hiển thị trạng thái migration
npm run migration:show
```

#### Hoàn tác Migration (nếu cần)
```bash
# Hoàn tác migration cuối cùng
npm run migration:revert
```

### 3. Thay thế: Schema Sync (Chỉ cho Development)

Để phát triển, bạn cũng có thể sử dụng schema synchronization:

```bash
# Đồng bộ database schema với entities (KHÔNG khuyến nghị cho production)
npm run schema:sync
```

## Chạy ứng dụng

### Development Mode
```bash
# Chạy với hot reload
npm run start:dev
```

### Production Mode
```bash
# Build ứng dụng
npm run build

# Chạy ở chế độ production
npm run start:prod
```

### Debug Mode
```bash
# Chạy với debugging enabled
npm run start:debug
```

## API Endpoints

Ứng dụng sẽ có sẵn tại `http://localhost:4003` (hoặc port được chỉ định trong file `.env`).

### Các Endpoint có sẵn:
- `GET /image-processing` - Lấy tất cả kết quả xử lý hình ảnh
- `POST /image-processing` - Tạo kết quả xử lý hình ảnh mới
- `GET /image-processing/:id` - Lấy kết quả xử lý hình ảnh cụ thể
- `PUT /image-processing/:id` - Cập nhật kết quả xử lý hình ảnh
- `DELETE /image-processing/:id` - Xóa kết quả xử lý hình ảnh

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

### Watch Mode
```bash
npm run test:watch
```

## Development Commands

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### TypeORM Commands
```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Create empty migration
npm run migration:create -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert

# Show migration status
npm run migration:show

# Drop schema (DANGEROUS - use with caution)
npm run schema:drop
```

## Cấu trúc dự án

```
src/
├── controllers/          # API controllers
├── dto/                 # Data Transfer Objects
├── entities/            # TypeORM entities
├── migrations/          # Database migrations
├── services/            # Business logic services
├── app.module.ts        # Main application module
└── main.ts             # Application entry point
```

## Troubleshooting

### Các vấn đề thường gặp:

1. **Database Connection Error**: 
   - Kiểm tra MySQL server đang chạy
   - Kiểm tra thông tin database trong file `.env`
   - Đảm bảo database đã tồn tại

2. **Migration Errors**:
   - Đảm bảo tất cả migrations trước đó đã được chạy
   - Kiểm tra lỗi syntax trong file migration
   - Xác minh định nghĩa entity khớp với database schema

3. **Port Already in Use**:
   - Thay đổi PORT trong file `.env`
   - Kill process đang sử dụng port: `lsof -ti:4003 | xargs kill -9`

## Support

Để được hỗ trợ và giải đáp thắc mắc, vui lòng kiểm tra tài liệu hoặc tạo issue trong repository.

## License

Dự án này được cấp phép theo MIT License.



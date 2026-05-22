# 跨境电商 Schema 管理系统 | Cross-Border E-Commerce Schema Management System

一个用于管理跨境电商平台的实体、属性、映射关系和平台规则的全栈应用。

A full-stack application for managing entities, properties, mappings, and platform rules for cross-border e-commerce platforms.

## 技术栈 | Tech Stack

- **框架 | Framework**: Next.js 15 + React 19
- **语言 | Language**: TypeScript
- **样式 | Styling**: Tailwind CSS
- **UI 组件 | UI Components**: shadcn/ui
- **图标 | Icons**: Lucide React

## 核心功能 | Core Features

### 1. 实体管理 | Entity Management
- 支持4个核心实体：产品、实例、商品、Listing
  Supports 4 core entities: Product, Instance, ProductItem, Listing
- 支持子实体层级结构（如 Amazon 实例 → Amazon SC 实例 → Amazon VC 实例）
  Supports sub-entity hierarchy (e.g., Amazon Instance → Amazon SC Instance → Amazon VC Instance)
- 每个实体包含多个属性
  Each entity contains multiple properties
- 属性支持多种类型：字符串、数字、布尔、日期、数组、对象
  Properties support multiple types: string, number, boolean, date, array, object
- 实体继承关系可视化展示
  Visual display of entity inheritance relationships

### 2. 属性管理 | Property Management
- 为每个实体定义属性
  Define properties for each entity
- 支持必填/可选属性
  Supports required/optional properties
- 属性描述和默认值
  Property descriptions and default values
- 完整的 CRUD 操作
  Full CRUD operations

### 3. 属性映射 | Property Mapping
- 定义实体间属性的映射关系
  Define property mapping relationships between entities
- 支持转换规则（如：Listing.name = Listing.platform + Instance.name + Date）
  Supports transformation rules (e.g., Listing.name = Listing.platform + Instance.name + Date)
- 示例场景展示
  Example scenario demonstrations
- 上游和下游关系可视化
  Upstream and downstream relationship visualization

### 4. 平台规则管理 | Platform Rule Management
- 管理各平台的字段要求和验证规则
  Manage field requirements and validation rules for each platform
- 支持多平台：Amazon、eBay、Wish、Shopee、Lazada、Walmart
  Supports multiple platforms: Amazon, eBay, Wish, Shopee, Lazada, Walmart
- 验证条件配置
  Validation condition configuration

### 5. 实体关系图谱 | Entity Relationship Graph
- 任选一个实体查看其上下游关系
  Select any entity to view its upstream and downstream relationships
- 上游来源：显示哪些实体的属性流向当前实体
  Upstream sources: Shows which entities' properties flow to the current entity
- 下游去向：显示当前实体的属性流向哪些实体
  Downstream destinations: Shows which entities the current entity's properties flow to
- 详细的属性映射展示
  Detailed property mapping display

## 快速开始 | Quick Start

### 开发模式 | Development Mode

```bash
npm install
npm run dev
```

访问 http://localhost:3000

Visit http://localhost:3000

### 生产构建 | Production Build

```bash
npm run build
npm start
```

### Docker 部署 | Docker Deployment

#### 使用 Docker Compose（推荐）| Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

#### 使用 Docker 构建 | Using Docker Build

```bash
docker build -t schema-management .
docker run -d -p 3000:3000 --name schema-management --restart unless-stopped schema-management
```

访问 http://localhost:3000

Visit http://localhost:3000

#### 停止容器 | Stop Container

```bash
docker-compose down
# 或者 / or
docker stop schema-management
```

#### 查看日志 | View Logs

```bash
docker-compose logs -f
# 或者 / or
docker logs -f schema-management
```

## 项目结构 | Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/          # React components
│   ├── ui/              # shadcn/ui components
│   ├── entity-management.tsx
│   ├── property-mapping.tsx
│   ├── platform-rule.tsx
│   └── entity-graph.tsx
├── lib/                 # Utility functions and data
│   ├── mock-data.ts     # Mock data
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
    └── index.ts
```

## 核心实体说明 | Core Entities Explanation

### 产品 | Product
代表开发出的商品本体，是最基础的实体。

Represents the developed product itself, the most basic entity.

### 实例 | Instance
包含售价、商品标题、商品图片、描述词等。支持平台特定的子类型。

Contains price, product title, product images, descriptions, etc. Supports platform-specific subtypes.

### 商品 | ProductItem
由实例 + 价格 + 物流方式等组成，具备上架所需的全部数据。

Composed of instance + price + shipping method, etc., with all data required for listing.

### Listing
商品刊登到系统后台后，远端（平台侧）实际保存的数据。

The actual data saved remotely (platform side) after the product is listed to the system backend.

## 设计特色 | Design Features

- **深色主题 | Dark Theme**: 现代科技感的深色界面
  Modern tech-inspired dark interface
- **毛玻璃效果 | Glassmorphism**: 半透明卡片和背景
  Semi-transparent cards and backgrounds
- **渐变色彩 | Gradient Colors**: 蓝、绿、紫、橙等主题色
  Blue, green, purple, orange, and other theme colors
- **动画效果 | Animations**: 悬浮、发光、脉冲动画
  Hover, glow, and pulse animations
- **氛围渲染 | Ambient Effects**: 装饰性轨道光晕
  Decorative orbital glows

## 后续开发建议 | Future Development Suggestions

1. **后端集成 | Backend Integration**: 添加数据库和 API 路由
   Add database and API routes
2. **用户认证 | User Authentication**: 登录和权限管理
   Login and permission management
3. **数据持久化 | Data Persistence**: 替换模拟数据
   Replace mock data
4. **表单编辑 | Form Editing**: 完善新增/编辑功能
   Complete add/edit functionality
5. **数据验证 | Data Validation**: 实现规则验证引擎
   Implement rule validation engine
6. **导出/导入 | Export/Import**: 支持 Schema 的批量导入导出
   Support batch import/export of schemas
7. **版本控制 | Version Control**: Schema 变更历史和回滚
   Schema change history and rollback
8. **API 文档 | API Documentation**: 自动生成 API 文档
   Auto-generated API documentation

## License

MIT License - see [LICENSE](LICENSE) file for details.

## 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

Issues and Pull Requests are welcome!

---

**注意 | Note**: 这是一个项目的前端原型，后续可以根据实际需求进行扩展和完善。

This is a frontend prototype of the project, which can be expanded and improved according to actual needs.

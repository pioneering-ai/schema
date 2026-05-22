# 跨境电商 Schema 管理系统

一个用于管理跨境电商平台的实体、属性、映射关系和平台规则的全栈应用。

## 技术栈

- **框架**: Next.js 15 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **图标**: Lucide React

## 核心功能

### 1. 实体管理
- 支持4个核心实体：产品、实例、商品、Listing
- 支持子实体层级结构（如 Amazon 实例 → Amazon SC 实例 → Amazon VC 实例）
- 每个实体包含多个属性
- 属性支持多种类型：字符串、数字、布尔、日期、数组、对象

### 2. 属性管理
- 为每个实体定义属性
- 支持必填/可选属性
- 属性描述和默认值

### 3. 属性映射
- 定义实体间属性的映射关系
- 支持转换规则（如：Listing.name = Listing.platform + Instance.name + Date）
- 示例场景展示

### 4. 平台规则管理
- 管理各平台的字段要求和验证规则
- 支持多平台：Amazon、eBay、Wish、Shopee、Lazada、Walmart
- 验证条件配置

## 快速开始

### 开发模式

```bash
npm install
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
npm start
```

### Docker 部署

```bash
docker build -t schema-management .
docker run -p 3000:3000 schema-management
```

## 项目结构

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 主页面
├── components/          # React 组件
│   ├── ui/              # shadcn/ui 组件
│   ├── entity-management.tsx
│   ├── property-mapping.tsx
│   └── platform-rule.tsx
├── lib/                 # 工具函数和数据
│   ├── mock-data.ts     # 模拟数据
│   └── utils.ts         # 工具函数
└── types/               # TypeScript 类型定义
    └── index.ts
```

## 核心实体说明

### 产品 (Product)
代表开发出的商品本体，是最基础的实体。

### 实例 (Instance)
包含售价、商品标题、商品图片、描述词等。支持平台特定的子类型。

### 商品 (ProductItem)
由实例 + 价格 + 物流方式等组成，具备上架所需的全部数据。

### Listing
商品刊登到系统后台后，远端（平台侧）实际保存的数据。

## 后续开发建议

1. **后端集成**: 添加数据库和 API 路由
2. **用户认证**: 登录和权限管理
3. **数据持久化**: 替换模拟数据
4. **表单编辑**: 完善新增/编辑功能
5. **数据验证**: 实现规则验证引擎
6. **导出/导入**: 支持 Schema 的批量导入导出

## License

MIT

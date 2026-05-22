import type { Entity, PropertyMapping, PlatformRule } from '@/types';

export const mockEntities: Entity[] = [
  {
    id: '1',
    type: 'product',
    name: '产品',
    properties: [
      { id: 'p1', name: 'name', type: 'string', required: true, description: '产品名称' },
      { id: 'p2', name: 'sku', type: 'string', required: true, description: '产品SKU' },
      { id: 'p3', name: 'description', type: 'string', required: false, description: '产品描述' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    type: 'instance',
    name: '实例',
    properties: [
      { id: 'p4', name: 'name', type: 'string', required: true, description: '实例名称' },
      { id: 'p5', name: 'price', type: 'number', required: true, description: '售价' },
      { id: 'p6', name: 'title', type: 'string', required: true, description: '商品标题' },
      { id: 'p7', name: 'images', type: 'array', required: false, description: '商品图片' },
      { id: 'p8', name: 'description', type: 'string', required: false, description: '描述词' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    type: 'instance',
    name: 'Amazon实例',
    parentId: '2',
    properties: [
      { id: 'p9', name: 'amazonSpecificField', type: 'string', required: false, description: 'Amazon专属字段' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    type: 'productItem',
    name: '商品',
    properties: [
      { id: 'p10', name: 'name', type: 'string', required: true, description: '商品名称' },
      { id: 'p11', name: 'price', type: 'number', required: true, description: '价格' },
      { id: 'p12', name: 'shippingMethod', type: 'string', required: true, description: '物流方式' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    type: 'listing',
    name: 'Listing',
    properties: [
      { id: 'p13', name: 'name', type: 'string', required: true, description: 'Listing名称' },
      { id: 'p14', name: 'platform', type: 'string', required: true, description: '平台' },
      { id: 'p15', name: 'status', type: 'string', required: true, description: '状态' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockPropertyMappings: PropertyMapping[] = [
  {
    id: 'm1',
    sourceEntityId: '5',
    sourcePropertyId: 'p13',
    targetEntityId: '5',
    targetPropertyId: 'p13',
    transformation: '{{platform}} + {{instance.name}} + {{date}}',
    createdAt: new Date(),
  },
];

export const mockPlatformRules: PlatformRule[] = [
  {
    id: 'r1',
    platform: 'Amazon',
    entityType: 'listing',
    propertyId: 'p13',
    rule: '标题长度不能超过200字符',
    validation: { maxLength: 200 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

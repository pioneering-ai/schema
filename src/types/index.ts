export type EntityType = 'product' | 'instance' | 'productItem' | 'listing';

export interface Property {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  description?: string;
  defaultValue?: any;
}

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  parentId?: string;
  properties: Property[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyMapping {
  id: string;
  sourceEntityId: string;
  sourcePropertyId: string;
  targetEntityId: string;
  targetPropertyId: string;
  transformation?: string;
  createdAt: Date;
}

export interface PlatformRule {
  id: string;
  platform: string;
  entityType: EntityType;
  propertyId: string;
  rule: string;
  validation: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product extends Entity {
  type: 'product';
}

export interface Instance extends Entity {
  type: 'instance';
  platform?: string;
}

export interface ProductItem extends Entity {
  type: 'productItem';
}

export interface Listing extends Entity {
  type: 'listing';
  platform: string;
}

'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Database, Layers, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { mockEntities } from '@/lib/mock-data';
import type { Entity, Property } from '@/types';

const entityTypeColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  product: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500 to-cyan-500' },
  instance: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', gradient: 'from-green-500 to-emerald-500' },
  productItem: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', gradient: 'from-orange-500 to-amber-500' },
  listing: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-500 to-pink-500' },
};

interface EntityFormData {
  name: string;
  type: Entity['type'];
  parentId?: string;
}

interface PropertyFormData {
  name: string;
  type: Property['type'];
  required: boolean;
  description: string;
}

export function EntityManagement() {
  const [entities, setEntities] = useState<Entity[]>(mockEntities);
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(new Set(['1', '2', '4', '5']));
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [entityToDelete, setEntityToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<EntityFormData>({
    name: '',
    type: 'product',
  });
  const [propertyFormData, setPropertyFormData] = useState<PropertyFormData>({
    name: '',
    type: 'string',
    required: false,
    description: '',
  });

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedEntities);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntities(newExpanded);
  };

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      product: '产品',
      instance: '实例',
      productItem: '商品',
      listing: 'Listing',
    };
    return labels[type] || type;
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      string: '字符串',
      number: '数字',
      boolean: '布尔',
      date: '日期',
      array: '数组',
      object: '对象',
    };
    return labels[type] || type;
  };

  const getChildEntities = (parentId: string) => {
    return entities.filter((e) => e.parentId === parentId);
  };

  const filteredEntities = entities.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEntity = (parentId?: string) => {
    setFormData({
      name: '',
      type: 'product',
      parentId,
    });
    setDialogOpen(true);
  };

  const handleEditEntity = (entity: Entity) => {
    setCurrentEntity(entity);
    setFormData({
      name: entity.name,
      type: entity.type,
      parentId: entity.parentId,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteEntity = (entityId: string) => {
    setEntityToDelete(entityId);
    setDeleteDialogOpen(true);
  };

  const handleAddProperty = (entity: Entity) => {
    setCurrentEntity(entity);
    setPropertyFormData({
      name: '',
      type: 'string',
      required: false,
      description: '',
    });
    setPropertyDialogOpen(true);
  };

  const confirmDeleteEntity = () => {
    if (entityToDelete) {
      setEntities(entities.filter(e => e.id !== entityToDelete && e.parentId !== entityToDelete));
      setDeleteDialogOpen(false);
      setEntityToDelete(null);
    }
  };

  const submitEntity = () => {
    if (!formData.name.trim()) return;
    
    const newEntity: Entity = {
      id: Date.now().toString(),
      type: formData.type,
      name: formData.name,
      parentId: formData.parentId,
      properties: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setEntities([...entities, newEntity]);
    setDialogOpen(false);
    setFormData({ name: '', type: 'product' });
  };

  const submitEditEntity = () => {
    if (!currentEntity || !formData.name.trim()) return;
    
    setEntities(entities.map(e => 
      e.id === currentEntity.id 
        ? { ...e, name: formData.name, type: formData.type, updatedAt: new Date() }
        : e
    ));
    setEditDialogOpen(false);
    setCurrentEntity(null);
  };

  const submitProperty = () => {
    if (!currentEntity || !propertyFormData.name.trim()) return;
    
    const newProperty: Property = {
      id: Date.now().toString(),
      name: propertyFormData.name,
      type: propertyFormData.type,
      required: propertyFormData.required,
      description: propertyFormData.description,
    };
    
    setEntities(entities.map(e => 
      e.id === currentEntity.id 
        ? { ...e, properties: [...e.properties, newProperty], updatedAt: new Date() }
        : e
    ));
    setPropertyDialogOpen(false);
    setCurrentEntity(null);
  };

  const renderEntity = (entity: Entity, level: number = 0) => {
    const childEntities = getChildEntities(entity.id);
    const hasChildren = childEntities.length > 0;
    const isExpanded = expandedEntities.has(entity.id);
    const colors = entityTypeColors[entity.type] || entityTypeColors.product;

    return (
      <div key={entity.id} className="mb-4">
        <div className={`glass-card rounded-xl p-4 border ${colors.border} relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300`}>
          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colors.gradient}`} />
          
          <div className="flex items-center justify-between" style={{ paddingLeft: `${level * 24}px` }}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
                {hasChildren ? <Layers className="w-5 h-5 text-white" /> : <Database className="w-5 h-5 text-white" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-white">{entity.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {getEntityTypeLabel(entity.type)}
                  </span>
                  {entity.parentId && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-slate-500/20 text-slate-400">
                      子实体
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">
                  {entity.properties.length} 个属性 {hasChildren && `· ${childEntities.length} 个子实体`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasChildren && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10"
                  onClick={() => toggleExpand(entity.id)}
                >
                  {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-slate-400 hover:text-green-400 hover:bg-green-500/10"
                onClick={() => handleAddEntity(entity.id)}
                title="添加子实体"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                onClick={() => handleAddProperty(entity)}
                title="添加属性"
              >
                <Layers className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10"
                onClick={() => handleEditEntity(entity)}
              >
                <Edit className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => handleDeleteEntity(entity.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 ml-8">
            {entity.properties.length > 0 && (
              <div className="glass-card rounded-xl p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    属性列表
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={() => handleAddProperty(entity)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    添加属性
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entity.properties.map((prop) => (
                    <div key={prop.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-sm font-mono text-blue-400">{prop.name}</code>
                        <span className={`px-2 py-0.5 rounded text-xs ${prop.required ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          {prop.required ? '必填' : '可选'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-slate-500">类型:</span>
                        <span className="text-xs text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                          {getPropertyTypeLabel(prop.type)}
                        </span>
                      </div>
                      {prop.description && (
                        <p className="text-xs text-slate-500">{prop.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              {childEntities.length > 0 && (
                <div className="flex items-center gap-2 mb-4 ml-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-slate-500 px-2">子实体</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
              )}
              {childEntities.map((child) => renderEntity(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const rootEntities = filteredEntities.filter((e) => !e.parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">实体管理</h2>
          <p className="text-slate-400">管理产品、实例、商品、Listing等核心实体</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          onClick={() => handleAddEntity()}
        >
          <Plus className="w-4 h-4 mr-2" />
          新增实体
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <Input 
          placeholder="搜索实体..." 
          className="glass-card border-0 h-12 pl-12 text-white placeholder-slate-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {rootEntities.map((entity) => renderEntity(entity))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增实体</DialogTitle>
            <DialogDescription>
              {formData.parentId ? '创建一个新的子实体' : '创建一个新的顶级实体'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">实体名称</Label>
              <Input
                id="name"
                placeholder="输入实体名称"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">实体类型</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="product">产品</option>
                <option value="instance">实例</option>
                <option value="productItem">商品</option>
                <option value="listing">Listing</option>
              </Select>
            </div>
            {formData.parentId && (
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <p className="text-sm text-blue-300">
                  此实体将作为子实体创建
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              onClick={submitEntity}
            >
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑实体</DialogTitle>
            <DialogDescription>修改实体的名称和类型</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">实体名称</Label>
              <Input
                id="edit-name"
                placeholder="输入实体名称"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">实体类型</Label>
              <Select
                id="edit-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="product">产品</option>
                <option value="instance">实例</option>
                <option value="productItem">商品</option>
                <option value="listing">Listing</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>取消</Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              onClick={submitEditEntity}
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={propertyDialogOpen} onOpenChange={setPropertyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加属性</DialogTitle>
            <DialogDescription>为 {currentEntity?.name} 添加新属性</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="prop-name">属性名称</Label>
              <Input
                id="prop-name"
                placeholder="输入属性名称"
                value={propertyFormData.name}
                onChange={(e) => setPropertyFormData({ ...propertyFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prop-type">属性类型</Label>
              <Select
                id="prop-type"
                value={propertyFormData.type}
                onChange={(e) => setPropertyFormData({ ...propertyFormData, type: e.target.value as any })}
              >
                <option value="string">字符串</option>
                <option value="number">数字</option>
                <option value="boolean">布尔</option>
                <option value="date">日期</option>
                <option value="array">数组</option>
                <option value="object">对象</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prop-description">描述（可选）</Label>
              <Input
                id="prop-description"
                placeholder="属性描述"
                value={propertyFormData.description}
                onChange={(e) => setPropertyFormData({ ...propertyFormData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="prop-required"
                checked={propertyFormData.required}
                onChange={(e) => setPropertyFormData({ ...propertyFormData, required: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/5"
              />
              <Label htmlFor="prop-required" className="cursor-pointer">必填属性</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPropertyDialogOpen(false)}>取消</Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              onClick={submitProperty}
            >
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              确认删除
            </DialogTitle>
            <DialogDescription>
              此操作将删除该实体及其所有子实体，此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white border-0"
              onClick={confirmDeleteEntity}
            >
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

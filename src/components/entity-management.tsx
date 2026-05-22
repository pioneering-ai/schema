'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Database, Layers, Search, X, ArrowLeft } from 'lucide-react';
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
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(new Set(['1', '2']));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
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
      if (selectedEntity?.id === entityToDelete || selectedEntity?.parentId === entityToDelete) {
        setSelectedEntity(null);
      }
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
    
    const updatedEntities = entities.map(e => 
      e.id === currentEntity.id 
        ? { ...e, name: formData.name, type: formData.type, updatedAt: new Date() }
        : e
    );
    setEntities(updatedEntities);
    
    if (selectedEntity?.id === currentEntity.id) {
      setSelectedEntity(updatedEntities.find(e => e.id === currentEntity.id) || null);
    }
    
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
    
    const updatedEntities = entities.map(e => 
      e.id === currentEntity.id 
        ? { ...e, properties: [...e.properties, newProperty], updatedAt: new Date() }
        : e
    );
    
    setEntities(updatedEntities);
    
    if (selectedEntity?.id === currentEntity.id) {
      setSelectedEntity(updatedEntities.find(e => e.id === currentEntity.id) || null);
    }
    
    setPropertyDialogOpen(false);
    setCurrentEntity(null);
  };

  const renderEntityTreeItem = (entity: Entity, level: number = 0) => {
    const childEntities = getChildEntities(entity.id);
    const hasChildren = childEntities.length > 0;
    const isExpanded = expandedEntities.has(entity.id);
    const isSelected = selectedEntity?.id === entity.id;
    const colors = entityTypeColors[entity.type] || entityTypeColors.product;

    return (
      <div key={entity.id} className="mb-1">
        <div 
          className={`glass-card rounded-lg p-3 border ${isSelected ? `${colors.border} ring-2 ring-white/20` : 'border-transparent'} relative overflow-hidden group hover:scale-[1.01] transition-all duration-200 cursor-pointer`}
          onClick={() => setSelectedEntity(entity)}
        >
          {isSelected && <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colors.gradient}`} />}
          
          <div className="flex items-center gap-3" style={{ paddingLeft: `${level * 16}px` }}>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
              {hasChildren ? <Layers className="w-4 h-4 text-white" /> : <Database className="w-4 h-4 text-white" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-white truncate">{entity.name}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text} flex-shrink-0`}>
                  {getEntityTypeLabel(entity.type)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {entity.properties.length} 个属性
              </p>
            </div>

            {hasChildren && (
              <button 
                className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(entity.id);
                }}
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1">
            {childEntities.map((child) => renderEntityTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderPropertyDetail = (prop: Property) => {
    return (
      <div key={prop.id} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <code className="text-lg font-mono text-white">{prop.name}</code>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${prop.required ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
                {prop.required ? '必填' : '可选'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">类型:</span>
              <span className="text-sm text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                {getPropertyTypeLabel(prop.type)}
              </span>
            </div>
          </div>
        </div>
        {prop.description && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-slate-400 leading-relaxed">{prop.description}</p>
          </div>
        )}
      </div>
    );
  };

  const rootEntities = filteredEntities.filter((e) => !e.parentId);

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      <div className="w-[400px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-1">实体管理</h2>
            <p className="text-sm text-slate-400">选择实体查看详情</p>
          </div>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            onClick={() => handleAddEntity()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="搜索实体..." 
            className="glass-card border-0 h-10 pl-10 text-white placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-2">
          {rootEntities.map((entity) => renderEntityTreeItem(entity))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedEntity ? (
          <>
            <div className="glass-card rounded-2xl p-6 mb-4 border border-white/10 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${entityTypeColors[selectedEntity.type]?.gradient || 'from-blue-500 to-cyan-500'}`} />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${entityTypeColors[selectedEntity.type]?.gradient || 'from-blue-500 to-cyan-500'} flex items-center justify-center flex-shrink-0`}>
                    {getChildEntities(selectedEntity.id).length > 0 ? (
                      <Layers className="w-7 h-7 text-white" />
                    ) : (
                      <Database className="w-7 h-7 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{selectedEntity.name}</h2>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${entityTypeColors[selectedEntity.type]?.bg || 'bg-blue-500/10'} ${entityTypeColors[selectedEntity.type]?.text || 'text-blue-400'}`}>
                        {getEntityTypeLabel(selectedEntity.type)}
                      </span>
                      {selectedEntity.parentId && (
                        <span className="px-3 py-1.5 rounded-full text-sm bg-slate-500/20 text-slate-400">
                          子实体
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <span>{selectedEntity.properties.length} 个属性</span>
                      <span>{getChildEntities(selectedEntity.id).length} 个子实体</span>
                      <span>创建于 {selectedEntity.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-slate-400 hover:text-green-400 hover:bg-green-500/10"
                    onClick={() => handleAddEntity(selectedEntity.id)}
                    title="添加子实体"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                    onClick={() => handleAddProperty(selectedEntity)}
                    title="添加属性"
                  >
                    <Layers className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10"
                    onClick={() => handleEditEntity(selectedEntity)}
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDeleteEntity(selectedEntity.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  属性列表
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => handleAddProperty(selectedEntity)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加属性
                </Button>
              </div>

              {selectedEntity.properties.length > 0 ? (
                <div className="space-y-4">
                  {selectedEntity.properties.map((prop) => renderPropertyDetail(prop))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-12 border border-white/10 text-center">
                  <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-400 mb-2">暂无属性</h4>
                  <p className="text-sm text-slate-500 mb-4">点击上方按钮为该实体添加属性</p>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                    onClick={() => handleAddProperty(selectedEntity)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加第一个属性
                  </Button>
                </div>
              )}

              {getChildEntities(selectedEntity.id).length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-sm text-slate-500 px-3">子实体</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getChildEntities(selectedEntity.id).map((child) => {
                      const colors = entityTypeColors[child.type] || entityTypeColors.product;
                      return (
                        <div 
                          key={child.id}
                          className="glass-card rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                          onClick={() => setSelectedEntity(child)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
                              <Database className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-white truncate">{child.name}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text} flex-shrink-0`}>
                                  {getEntityTypeLabel(child.type)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {child.properties.length} 个属性
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Database className="w-12 h-12 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">选择一个实体</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                在左侧列表中点击任意实体，查看其详细信息和属性列表
              </p>
            </div>
          </div>
        )}
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

'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Link as LinkIcon, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { mockPropertyMappings, mockEntities } from '@/lib/mock-data';
import type { PropertyMapping } from '@/types';

interface MappingFormData {
  sourceEntityId: string;
  sourcePropertyId: string;
  targetEntityId: string;
  targetPropertyId: string;
  transformation: string;
}

export function PropertyMappingManagement() {
  const [mappings, setMappings] = useState<PropertyMapping[]>(mockPropertyMappings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentMapping, setCurrentMapping] = useState<PropertyMapping | null>(null);
  const [mappingToDelete, setMappingToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<MappingFormData>({
    sourceEntityId: '',
    sourcePropertyId: '',
    targetEntityId: '',
    targetPropertyId: '',
    transformation: '',
  });

  const getEntityName = (id: string) => {
    const entity = mockEntities.find((e) => e.id === id);
    return entity?.name || id;
  };

  const getPropertyName = (entityId: string, propertyId: string) => {
    const entity = mockEntities.find((e) => e.id === entityId);
    const property = entity?.properties.find((p) => p.id === propertyId);
    return property?.name || propertyId;
  };

  const getEntityProperties = (entityId: string) => {
    const entity = mockEntities.find((e) => e.id === entityId);
    return entity?.properties || [];
  };

  const handleAddMapping = () => {
    setFormData({
      sourceEntityId: mockEntities[0]?.id || '',
      sourcePropertyId: '',
      targetEntityId: mockEntities[0]?.id || '',
      targetPropertyId: '',
      transformation: '',
    });
    setCurrentMapping(null);
    setDialogOpen(true);
  };

  const handleEditMapping = (mapping: PropertyMapping) => {
    setCurrentMapping(mapping);
    setFormData({
      sourceEntityId: mapping.sourceEntityId,
      sourcePropertyId: mapping.sourcePropertyId,
      targetEntityId: mapping.targetEntityId,
      targetPropertyId: mapping.targetPropertyId,
      transformation: mapping.transformation || '',
    });
    setDialogOpen(true);
  };

  const handleDeleteMapping = (mappingId: string) => {
    setMappingToDelete(mappingId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMapping = () => {
    if (mappingToDelete) {
      setMappings(mappings.filter(m => m.id !== mappingToDelete));
      setDeleteDialogOpen(false);
      setMappingToDelete(null);
    }
  };

  const submitMapping = () => {
    if (!formData.sourceEntityId || !formData.sourcePropertyId || 
        !formData.targetEntityId || !formData.targetPropertyId) {
      return;
    }
    
    if (currentMapping) {
      setMappings(mappings.map(m => 
        m.id === currentMapping.id 
          ? { ...m, ...formData }
          : m
      ));
    } else {
      const newMapping: PropertyMapping = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      };
      setMappings([...mappings, newMapping]);
    }
    
    setDialogOpen(false);
    setCurrentMapping(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">属性映射</h2>
          <p className="text-slate-400">管理实体间属性的映射关系和转换规则</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
          onClick={handleAddMapping}
        >
          <Plus className="w-4 h-4 mr-2" />
          新增映射
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-green-400" />
              映射关系列表
            </h3>
            <span className="text-slate-400 text-sm">{mappings.length} 条映射</span>
          </div>
          <div className="space-y-4">
            {mappings.map((mapping) => (
              <div key={mapping.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">源 → 目标</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                      onClick={() => handleEditMapping(mapping)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDeleteMapping(mapping.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                    <p className="text-xs text-blue-400 mb-1">源实体</p>
                    <p className="text-white font-medium">{getEntityName(mapping.sourceEntityId)}</p>
                    <code className="text-xs text-blue-300 font-mono">
                      {getPropertyName(mapping.sourceEntityId, mapping.sourcePropertyId)}
                    </code>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                    <p className="text-xs text-purple-400 mb-1">目标实体</p>
                    <p className="text-white font-medium">{getEntityName(mapping.targetEntityId)}</p>
                    <code className="text-xs text-purple-300 font-mono">
                      {getPropertyName(mapping.targetEntityId, mapping.targetPropertyId)}
                    </code>
                  </div>
                </div>

                {mapping.transformation && (
                  <div className="mt-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">转换规则</span>
                    </div>
                    <code className="text-sm text-green-300 font-mono bg-black/30 px-3 py-1.5 rounded block">
                      {mapping.transformation}
                    </code>
                  </div>
                )}
              </div>
            ))}
            
            {mappings.length === 0 && (
              <div className="text-center py-12">
                <LinkIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">暂无映射关系</p>
                <Button 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                  onClick={handleAddMapping}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加第一条映射
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              映射示例
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-5 border border-blue-500/20">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Listing 名称生成
                </h4>
                <div className="bg-black/30 rounded-lg p-3 mb-3">
                  <code className="text-sm text-blue-300 font-mono">
                    Listing.name = Listing.platform + Instance.name + Date
                  </code>
                </div>
                <p className="text-sm text-slate-400">
                  示例：<span className="text-blue-400">Amazon</span> + <span className="text-green-400">无线蓝牙耳机</span> + <span className="text-purple-400">2024-05-22</span> → <span className="text-white font-medium">Amazon无线蓝牙耳机20240522</span>
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl p-5 border border-orange-500/20">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  价格计算
                </h4>
                <div className="bg-black/30 rounded-lg p-3 mb-3">
                  <code className="text-sm text-orange-300 font-mono">
                    ProductItem.price = Instance.price * 1.2 + shippingCost
                  </code>
                </div>
                <p className="text-sm text-slate-400">
                  包含<span className="text-orange-400">20%</span>的利润率和物流费用
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/20">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  直接映射
                </h4>
                <div className="bg-black/30 rounded-lg p-3 mb-3">
                  <code className="text-sm text-purple-300 font-mono">
                    Product.sku → Instance.sku
                  </code>
                </div>
                <p className="text-sm text-slate-400">
                  原样复制属性值，无需转换
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentMapping ? '编辑映射' : '新增映射'}</DialogTitle>
            <DialogDescription>
              {currentMapping ? '修改属性映射关系' : '创建新的属性映射关系'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source-entity">源实体</Label>
                <Select
                  id="source-entity"
                  value={formData.sourceEntityId}
                  onChange={(e) => setFormData({ ...formData, sourceEntityId: e.target.value, sourcePropertyId: '' })}
                >
                  {mockEntities.map((entity) => (
                    <option key={entity.id} value={entity.id}>{entity.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-property">源属性</Label>
                <Select
                  id="source-property"
                  value={formData.sourcePropertyId}
                  onChange={(e) => setFormData({ ...formData, sourcePropertyId: e.target.value })}
                >
                  <option value="">选择属性</option>
                  {getEntityProperties(formData.sourceEntityId).map((prop) => (
                    <option key={prop.id} value={prop.id}>{prop.name}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-entity">目标实体</Label>
                <Select
                  id="target-entity"
                  value={formData.targetEntityId}
                  onChange={(e) => setFormData({ ...formData, targetEntityId: e.target.value, targetPropertyId: '' })}
                >
                  {mockEntities.map((entity) => (
                    <option key={entity.id} value={entity.id}>{entity.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-property">目标属性</Label>
                <Select
                  id="target-property"
                  value={formData.targetPropertyId}
                  onChange={(e) => setFormData({ ...formData, targetPropertyId: e.target.value })}
                >
                  <option value="">选择属性</option>
                  {getEntityProperties(formData.targetEntityId).map((prop) => (
                    <option key={prop.id} value={prop.id}>{prop.name}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transformation">转换规则（可选）</Label>
              <Input
                id="transformation"
                placeholder="{{platform}} + {{instance.name}} + {{date}}"
                value={formData.transformation}
                onChange={(e) => setFormData({ ...formData, transformation: e.target.value })}
              />
              <p className="text-xs text-slate-500">
                留空表示直接映射
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
              onClick={submitMapping}
            >
              {currentMapping ? '保存' : '创建'}
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
              此操作将删除该映射关系，此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white border-0"
              onClick={confirmDeleteMapping}
            >
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

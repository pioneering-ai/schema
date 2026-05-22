'use client';

import { useState, useMemo } from 'react';
import { ArrowRight, ArrowLeft, GitBranch, Search, Layers, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { mockEntities, mockPropertyMappings } from '@/lib/mock-data';
import type { Entity, PropertyMapping } from '@/types';

interface GraphNode {
  id: string;
  name: string;
  type: Entity['type'];
  properties: { id: string; name: string; type: Property['type']; required: boolean; description?: string }[];
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  sourceProperty: string;
  targetProperty: string;
  transformation?: string;
}

const entityTypeColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  product: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', gradient: 'from-blue-500 to-cyan-500' },
  instance: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', gradient: 'from-green-500 to-emerald-500' },
  productItem: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', gradient: 'from-orange-500 to-amber-500' },
  listing: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', gradient: 'from-purple-500 to-pink-500' },
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

export function EntityGraph() {
  const [selectedEntityId, setSelectedEntityId] = useState<string>(() => {
    const instanceEntity = mockEntities.find(e => e.type === 'instance' && !e.parentId);
    return instanceEntity?.id || mockEntities[0]?.id || '';
  });
  const [expandedUpstream, setExpandedUpstream] = useState<Set<string>>(new Set());
  const [expandedDownstream, setExpandedDownstream] = useState<Set<string>>(new Set());

  const { nodes, edges, upstreamEntities, downstreamEntities } = useMemo(() => {
    const graphNodes: GraphNode[] = mockEntities.map(e => ({
      id: e.id,
      name: e.name,
      type: e.type,
      properties: e.properties.map(p => ({ 
        id: p.id, 
        name: p.name, 
        type: p.type, 
        required: p.required, 
        description: p.description 
      })),
    }));

    const graphEdges: GraphEdge[] = mockPropertyMappings.map(m => ({
      id: m.id,
      source: m.sourceEntityId,
      target: m.targetEntityId,
      sourceProperty: m.sourcePropertyId,
      targetProperty: m.targetPropertyId,
      transformation: m.transformation,
    }));

    const getUpstream = (entityId: string): GraphNode[] => {
      const upstream: GraphNode[] = [];
      const visited = new Set<string>();
      
      const traverse = (id: string) => {
        if (visited.has(id)) return;
        visited.add(id);
        
        const incomingEdges = graphEdges.filter(e => e.target === id);
        incomingEdges.forEach(edge => {
          const sourceNode = graphNodes.find(n => n.id === edge.source);
          if (sourceNode && !upstream.find(n => n.id === sourceNode.id)) {
            upstream.push(sourceNode);
            traverse(sourceNode.id);
          }
        });
      };
      
      traverse(entityId);
      return upstream;
    };

    const getDownstream = (entityId: string): GraphNode[] => {
      const downstream: GraphNode[] = [];
      const visited = new Set<string>();
      
      const traverse = (id: string) => {
        if (visited.has(id)) return;
        visited.add(id);
        
        const outgoingEdges = graphEdges.filter(e => e.source === id);
        outgoingEdges.forEach(edge => {
          const targetNode = graphNodes.find(n => n.id === edge.target);
          if (targetNode && !downstream.find(n => n.id === targetNode.id)) {
            downstream.push(targetNode);
            traverse(targetNode.id);
          }
        });
      };
      
      traverse(entityId);
      return downstream;
    };

    return {
      nodes: graphNodes,
      edges: graphEdges,
      upstreamEntities: getUpstream(selectedEntityId),
      downstreamEntities: getDownstream(selectedEntityId),
    };
  }, [selectedEntityId]);

  const selectedEntity = nodes.find(n => n.id === selectedEntityId);
  const selectedColors = selectedEntity ? entityTypeColors[selectedEntity.type] : entityTypeColors.product;

  const toggleUpstream = (id: string) => {
    const newExpanded = new Set(expandedUpstream);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedUpstream(newExpanded);
  };

  const toggleDownstream = (id: string) => {
    const newExpanded = new Set(expandedDownstream);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedDownstream(newExpanded);
  };

  const getIncomingEdges = (entityId: string) => {
    return edges.filter(e => e.target === entityId);
  };

  const getOutgoingEdges = (entityId: string) => {
    return edges.filter(e => e.source === entityId);
  };

  const getPropertyName = (entityId: string, propertyId: string) => {
    const entity = nodes.find(n => n.id === entityId);
    return entity?.properties.find(p => p.id === propertyId)?.name || propertyId;
  };

  const renderEntityCard = (entity: GraphNode, isSelected: boolean = false) => {
    const colors = entityTypeColors[entity.type] || entityTypeColors.product;
    const incomingEdges = getIncomingEdges(entity.id);
    const outgoingEdges = getOutgoingEdges(entity.id);

    const getPropertyRelations = (propertyId: string) => {
      const incoming = incomingEdges.filter(e => e.targetProperty === propertyId);
      const outgoing = outgoingEdges.filter(e => e.sourceProperty === propertyId);
      return { incoming, outgoing };
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

    if (isSelected) {
      return (
        <div
          key={entity.id}
          className="glass-card rounded-xl p-6 border border-white/20 relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${colors.gradient}`} />
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{entity.name}</h3>
                  <span className={`text-sm px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                    {getEntityTypeLabel(entity.type)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              属性列表 ({entity.properties.length})
            </h4>
            <div className="space-y-3">
              {entity.properties.map((prop) => {
                const relations = getPropertyRelations(prop.id);
                const hasIncoming = relations.incoming.length > 0;
                const hasOutgoing = relations.outgoing.length > 0;
                
                return (
                  <div 
                    key={prop.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      hasIncoming && hasOutgoing 
                        ? 'bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/30' 
                        : hasIncoming 
                          ? 'bg-blue-500/10 border-blue-500/30' 
                          : hasOutgoing 
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-lg font-mono text-white">{prop.name}</code>
                          <span className={`text-xs px-2 py-0.5 rounded ${prop.required ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
                            {prop.required ? '必填' : '可选'}
                          </span>
                          <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                            {getPropertyTypeLabel(prop.type)}
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            {hasIncoming && (
                              <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                                <ArrowLeft className="w-3 h-3" />
                                上游
                              </span>
                            )}
                            {hasOutgoing && (
                              <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                                下游
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>
                        {prop.description && (
                          <p className="text-sm text-slate-400 leading-relaxed">{prop.description}</p>
                        )}
                      </div>
                    </div>
                    
                    {(hasIncoming || hasOutgoing) && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        {hasIncoming && (
                          <div>
                            <p className="text-xs text-blue-400 mb-1 flex items-center gap-1">
                              <ArrowLeft className="w-3 h-3" />
                              来自上游
                            </p>
                            <div className="space-y-1">
                              {relations.incoming.map(edge => {
                                const sourceEntity = nodes.find(n => n.id === edge.source);
                                return (
                                  <div key={edge.id} className="text-xs bg-blue-500/10 rounded px-2 py-1 border border-blue-500/20">
                                    <span className="text-blue-300">{sourceEntity?.name}</span>
                                    <span className="text-slate-500 mx-1">·</span>
                                    <code className="text-blue-400">{getPropertyName(edge.source, edge.sourceProperty)}</code>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {hasOutgoing && (
                          <div>
                            <p className="text-xs text-green-400 mb-1 flex items-center gap-1">
                              流向
                              <ArrowRight className="w-3 h-3" />
                            </p>
                            <div className="space-y-1">
                              {relations.outgoing.map(edge => {
                                const targetEntity = nodes.find(n => n.id === edge.target);
                                return (
                                  <div key={edge.id} className="text-xs bg-green-500/10 rounded px-2 py-1 border border-green-500/20">
                                    <span className="text-green-300">{targetEntity?.name}</span>
                                    <span className="text-slate-500 mx-1">·</span>
                                    <code className="text-green-400">{getPropertyName(edge.target, edge.targetProperty)}</code>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{entity.properties.length} 个属性</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                上游: {incomingEdges.length}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                下游: {outgoingEdges.length}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={entity.id}
        className={`glass-card rounded-xl p-5 border ${colors.border} relative overflow-hidden transition-all duration-300 hover:scale-[1.02]`}
      >
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colors.gradient}`} />
        
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{entity.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                  {getEntityTypeLabel(entity.type)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {incomingEdges.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2 text-xs text-blue-400">
                <ArrowLeft className="w-3 h-3" />
                <span>上游来源 ({incomingEdges.length})</span>
              </div>
              <div className="space-y-1">
                {incomingEdges.slice(0, 3).map(edge => {
                  const sourceEntity = nodes.find(n => n.id === edge.source);
                  return (
                    <div key={edge.id} className="text-xs bg-blue-500/10 rounded px-2 py-1 border border-blue-500/20">
                      <span className="text-blue-300">{sourceEntity?.name}</span>
                      <span className="text-slate-500 mx-1">→</span>
                      <code className="text-blue-400">{getPropertyName(edge.source, edge.sourceProperty)}</code>
                    </div>
                  );
                })}
                {incomingEdges.length > 3 && (
                  <div className="text-xs text-slate-500">还有 {incomingEdges.length - 3} 条...</div>
                )}
              </div>
            </div>
          )}

          {outgoingEdges.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2 text-xs text-green-400">
                <span>下游去向 ({outgoingEdges.length})</span>
                <ArrowRight className="w-3 h-3" />
              </div>
              <div className="space-y-1">
                {outgoingEdges.slice(0, 3).map(edge => {
                  const targetEntity = nodes.find(n => n.id === edge.target);
                  return (
                    <div key={edge.id} className="text-xs bg-green-500/10 rounded px-2 py-1 border border-green-500/20">
                      <code className="text-green-400">{getPropertyName(edge.source, edge.sourceProperty)}</code>
                      <span className="text-slate-500 mx-1">→</span>
                      <span className="text-green-300">{targetEntity?.name}</span>
                    </div>
                  );
                })}
                {outgoingEdges.length > 3 && (
                  <div className="text-xs text-slate-500">还有 {outgoingEdges.length - 3} 条...</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-500">{entity.properties.length} 个属性</span>
          {incomingEdges.length + outgoingEdges.length > 0 && (
            <span className="text-xs text-slate-500">{incomingEdges.length + outgoingEdges.length} 条关系</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">实体关系图谱</h2>
          <p className="text-slate-400">查看实体的上游来源和下游去向关系</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <Label htmlFor="entity-select" className="mb-2 block">选择实体</Label>
            <Select
              id="entity-select"
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
            >
              {nodes.map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </Select>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>上游</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>下游</span>
            </div>
          </div>
        </div>
      </div>

      {selectedEntity && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-white">
                <ArrowLeft className="w-5 h-5 text-blue-400" />
                <span>上游实体</span>
                {upstreamEntities.length > 0 && (
                  <span className="text-sm text-slate-500 font-normal">({upstreamEntities.length})</span>
                )}
              </div>
              
              {upstreamEntities.length === 0 ? (
                <div className="glass-card rounded-xl p-8 text-center border border-dashed border-white/10">
                  <GitBranch className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">没有上游实体</p>
                  <p className="text-xs text-slate-600 mt-1">此实体是数据起点</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upstreamEntities.map(entity => (
                    <div key={entity.id} onClick={() => setSelectedEntityId(entity.id)} className="cursor-pointer">
                      {renderEntityCard(entity)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-white justify-center">
                <GitBranch className="w-5 h-5 text-purple-400" />
                <span>当前实体</span>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-xl blur opacity-30"></div>
                <div className="relative">
                  {renderEntityCard(selectedEntity, true)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-white">
                <span>下游实体</span>
                <ArrowRight className="w-5 h-5 text-green-400" />
                {downstreamEntities.length > 0 && (
                  <span className="text-sm text-slate-500 font-normal">({downstreamEntities.length})</span>
                )}
              </div>
              
              {downstreamEntities.length === 0 ? (
                <div className="glass-card rounded-xl p-8 text-center border border-dashed border-white/10">
                  <GitBranch className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">没有下游实体</p>
                  <p className="text-xs text-slate-600 mt-1">此实体是数据终点</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {downstreamEntities.map(entity => (
                    <div key={entity.id} onClick={() => setSelectedEntityId(entity.id)} className="cursor-pointer">
                      {renderEntityCard(entity)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-purple-400" />
              详细关系映射
            </h3>
            
            <div className="space-y-4">
              {getIncomingEdges(selectedEntity.id).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    上游映射关系（来源）
                  </h4>
                  <div className="space-y-2">
                    {getIncomingEdges(selectedEntity.id).map(edge => {
                      const sourceEntity = nodes.find(n => n.id === edge.source);
                      return (
                        <div key={edge.id} className="flex items-center gap-4 bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white">{sourceEntity?.name}</span>
                              <span className="text-slate-500">→</span>
                              <span className="text-sm font-medium text-white">{selectedEntity.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <code className="text-blue-300 bg-black/30 px-2 py-0.5 rounded">
                                {getPropertyName(edge.source, edge.sourceProperty)}
                              </code>
                              <ArrowRight className="w-4 h-4 text-slate-500" />
                              <code className="text-purple-300 bg-black/30 px-2 py-0.5 rounded">
                                {getPropertyName(edge.target, edge.targetProperty)}
                              </code>
                            </div>
                            {edge.transformation && (
                              <div className="mt-2 text-xs text-green-400 bg-green-500/10 rounded px-2 py-1">
                                <span className="text-slate-500">转换:</span> {edge.transformation}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {getOutgoingEdges(selectedEntity.id).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                    下游映射关系（去向）
                    <ArrowRight className="w-4 h-4" />
                  </h4>
                  <div className="space-y-2">
                    {getOutgoingEdges(selectedEntity.id).map(edge => {
                      const targetEntity = nodes.find(n => n.id === edge.target);
                      return (
                        <div key={edge.id} className="flex items-center gap-4 bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white">{selectedEntity.name}</span>
                              <span className="text-slate-500">→</span>
                              <span className="text-sm font-medium text-white">{targetEntity?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <code className="text-purple-300 bg-black/30 px-2 py-0.5 rounded">
                                {getPropertyName(edge.source, edge.sourceProperty)}
                              </code>
                              <ArrowRight className="w-4 h-4 text-slate-500" />
                              <code className="text-green-300 bg-black/30 px-2 py-0.5 rounded">
                                {getPropertyName(edge.target, edge.targetProperty)}
                              </code>
                            </div>
                            {edge.transformation && (
                              <div className="mt-2 text-xs text-green-400 bg-green-500/10 rounded px-2 py-1">
                                <span className="text-slate-500">转换:</span> {edge.transformation}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {getIncomingEdges(selectedEntity.id).length === 0 && getOutgoingEdges(selectedEntity.id).length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <GitBranch className="w-10 h-10 mx-auto mb-3" />
                  此实体没有任何关系映射
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

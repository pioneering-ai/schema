'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockPlatformRules, mockEntities } from '@/lib/mock-data';
import type { PlatformRule } from '@/types';

const platformColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  Amazon: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', gradient: 'from-orange-500 to-amber-500' },
  eBay: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500 to-cyan-500' },
  Wish: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', gradient: 'from-pink-500 to-rose-500' },
  Shopee: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', gradient: 'from-orange-500 to-red-500' },
  Lazada: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-500 to-violet-500' },
  Walmart: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500 to-indigo-500' },
};

const platforms = ['Amazon', 'eBay', 'Wish', 'Shopee', 'Lazada', 'Walmart'];

export function PlatformRuleManagement() {
  const [rules, setRules] = useState<PlatformRule[]>(mockPlatformRules);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Amazon');

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      product: '产品',
      instance: '实例',
      productItem: '商品',
      listing: 'Listing',
    };
    return labels[type] || type;
  };

  const getPropertyName = (entityType: string, propertyId: string) => {
    const entity = mockEntities.find((e) => e.type === entityType);
    const property = entity?.properties.find((p) => p.id === propertyId);
    return property?.name || propertyId;
  };

  const platformRules = rules.filter(r => r.platform === selectedPlatform);
  const colors = platformColors[selectedPlatform] || platformColors.Amazon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">平台规则</h2>
          <p className="text-slate-400">管理各平台的字段要求和验证规则</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          新增规则
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {platforms.map((platform) => {
          const pColors = platformColors[platform] || platformColors.Amazon;
          const ruleCount = rules.filter(r => r.platform === platform).length;
          const isSelected = selectedPlatform === platform;
          
          return (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`glass-card rounded-xl p-4 text-left transition-all duration-300 relative overflow-hidden group ${
                isSelected 
                  ? `border-2 border-transparent bg-gradient-to-r ${pColors.gradient} p-[2px]` 
                  : 'border border-white/10 hover:border-white/20'
              }`}
            >
              {isSelected && (
                <div className={`absolute inset-0 bg-gradient-to-r ${pColors.gradient} opacity-20`} />
              )}
              <div className="relative z-10">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${pColors.gradient} flex items-center justify-center mb-2`}>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">{platform}</h3>
                <p className="text-xs text-slate-400">{ruleCount} 条规则</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                  <Settings className="w-4 h-4 text-white" />
                </div>
                {selectedPlatform} 规则列表
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                {platformRules.length} 条规则
              </span>
            </div>

            {platformRules.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">暂无规则</p>
                <Button className="bg-white/10 hover:bg-white/20 text-white border-0">
                  <Plus className="w-4 h-4 mr-2" />
                  添加第一条规则
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {platformRules.map((rule) => (
                  <div 
                    key={rule.id} 
                    className={`bg-white/5 rounded-xl p-5 border ${colors.border} hover:border-white/20 transition-all duration-300 group relative overflow-hidden`}
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colors.gradient}`} />
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <code className="text-sm font-mono text-white bg-black/30 px-3 py-1 rounded">
                            {getPropertyName(rule.entityType, rule.propertyId)}
                          </code>
                          <span className="text-xs text-slate-400">
                            {getEntityTypeLabel(rule.entityType)}
                          </span>
                        </div>
                        
                        <h4 className="text-white font-medium mb-2">{rule.rule}</h4>
                        
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <code className="text-xs text-slate-400 font-mono bg-black/30 px-2 py-1 rounded">
                            {JSON.stringify(rule.validation)}
                          </code>
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">平台概览</h3>
            <div className="space-y-4">
              {platforms.map((platform) => {
                const pColors = platformColors[platform] || platformColors.Amazon;
                const ruleCount = rules.filter(r => r.platform === platform).length;
                const entityCount = new Set(rules.filter(r => r.platform === platform).map(r => r.entityType)).size;
                
                return (
                  <div 
                    key={platform} 
                    className={`p-4 rounded-xl ${pColors.bg} border ${pColors.border} ${selectedPlatform === platform ? 'ring-2 ring-white/20' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${pColors.gradient} flex items-center justify-center`}>
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-white">{platform}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">规则数量</p>
                        <p className="text-white font-semibold">{ruleCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">涉及实体</p>
                        <p className="text-white font-semibold">{entityCount}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-slate-500 text-xs mb-1">最后更新</p>
                      <p className="text-slate-400 text-sm">2024-05-22</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

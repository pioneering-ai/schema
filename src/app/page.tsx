'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  List,
  Link as LinkIcon,
  Settings,
  Plus,
  ChevronRight,
  Sparkles,
  Zap,
  Database,
  Layers,
  GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EntityManagement } from '@/components/entity-management';
import { PropertyMappingManagement } from '@/components/property-mapping';
import { PlatformRuleManagement } from '@/components/platform-rule';
import { EntityGraph } from '@/components/entity-graph';

type ViewType = 'dashboard' | 'entities' | 'mappings' | 'rules' | 'graph';

const stats = [
  { 
    title: '实体数量', 
    value: '5', 
    description: '产品、实例、商品、Listing',
    icon: Database,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    title: '属性数量', 
    value: '15', 
    description: '已定义的属性',
    icon: Layers,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    title: '映射关系', 
    value: '1', 
    description: '属性映射规则',
    icon: LinkIcon,
    color: 'from-green-500 to-emerald-500'
  },
  { 
    title: '平台规则', 
    value: '1', 
    description: '各平台字段规则',
    icon: Settings,
    color: 'from-orange-500 to-amber-500'
  },
];

const features = [
  {
    icon: Package,
    title: '产品',
    description: '开发出的商品本体',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    icon: Boxes,
    title: '实例',
    description: '售价、标题、图片、描述等',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  {
    icon: Zap,
    title: '商品',
    description: '实例 + 价格 + 物流方式',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20'
  },
  {
    icon: Sparkles,
    title: 'Listing',
    description: '平台侧实际数据',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  }
];

const navItems = [
  { id: 'dashboard' as ViewType, label: '仪表盘', icon: LayoutDashboard },
  { id: 'entities' as ViewType, label: '实体管理', icon: Boxes },
  { id: 'mappings' as ViewType, label: '属性映射', icon: LinkIcon },
  { id: 'rules' as ViewType, label: '平台规则', icon: Settings },
  { id: 'graph' as ViewType, label: '关系图谱', icon: GitBranch },
];

export default function Home() {
  const [view, setView] = useState<ViewType>('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      <div className="orbit orbit-1"></div>
      <div className="orbit orbit-2"></div>
      
      <div className="flex h-screen relative z-10">
        <aside className="w-72 glass border-r border-white/10 flex flex-col">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center glow-primary pulse-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Schema
                </h1>
                <p className="text-xs text-slate-400">管理系统</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 text-white glow-primary-hover'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent" />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-blue-400' : ''}`} />
                  <span className="font-medium relative z-10">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-400 relative z-10" />}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/10">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Pro 功能</p>
                  <p className="text-xs text-slate-400">更多高级特性</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0">
                升级
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {view === 'dashboard' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-4xl font-bold gradient-text mb-2">欢迎回来 👋</h2>
                    <p className="text-slate-400">管理您的跨境电商 Schema 数据</p>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-white/10 hover:bg-white/20 text-white border-0">
                      导出
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                      <Plus className="w-4 h-4 mr-2" />
                      新建
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const getViewForStat = () => {
                      if (stat.title.includes('实体')) return 'entities';
                      if (stat.title.includes('映射')) return 'mappings';
                      if (stat.title.includes('规则')) return 'rules';
                      return 'entities';
                    };
                    return (
                      <div 
                        key={index} 
                        onClick={() => setView(getViewForStat())}
                        className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                      >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
                        <div className="relative z-10">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 float-animation`} style={{ animationDelay: `${index * 0.2}s` }}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
                          <p className="text-3xl font-bold text-white">{stat.value}</p>
                          <p className="text-xs text-slate-500 mt-2">{stat.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-400" />
                      核心实体
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <div 
                            key={index} 
                            onClick={() => setView('entities')}
                            className={`p-4 rounded-xl ${feature.bg} border ${feature.border} hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}
                          >
                            <Icon className={`w-8 h-8 ${feature.color} mb-3`} />
                            <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                            <p className="text-xs text-slate-400">{feature.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-400" />
                      系统功能
                    </h3>
                    <div className="space-y-4">
                      {[
                        { icon: Boxes, title: '实体管理', desc: '定义和维护实体结构', view: 'entities' as ViewType },
                        { icon: List, title: '属性管理', desc: '管理每个实体的属性', view: 'entities' as ViewType },
                        { icon: LinkIcon, title: '属性映射', desc: '实体间属性的映射关系', view: 'mappings' as ViewType },
                        { icon: Settings, title: '规则管理', desc: '各平台的字段规则', view: 'rules' as ViewType },
                        { icon: GitBranch, title: '关系图谱', desc: '查看实体上下游关系', view: 'graph' as ViewType },
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div 
                            key={index} 
                            onClick={() => setView(item.view)}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{item.title}</p>
                              <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 ml-auto" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'entities' && <EntityManagement />}
            {view === 'mappings' && <PropertyMappingManagement />}
            {view === 'rules' && <PlatformRuleManagement />}
            {view === 'graph' && <EntityGraph />}
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useState } from 'react'
import { Layout, Menu, Avatar, Space, Badge, Tag } from 'antd'
import { PieChartOutlined, ThunderboltOutlined, SettingOutlined, BellOutlined, RiseOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

const { Header, Sider, Content } = Layout

const NAV_ITEMS = [
  { key: '/', icon: <PieChartOutlined />, label: '单股看板' },
  { key: '/tasks', icon: <ThunderboltOutlined />, label: '任务中心' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统配置' }
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh', background: '#060d1a' }}>
      {/* ── Sidebar ── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        style={{
          background: 'linear-gradient(180deg,#0a1628 0%,#060d1a 100%)',
          borderRight: '1px solid rgba(56,189,248,0.08)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          overflow: 'auto',
          zIndex: 100
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            gap: 10,
            borderBottom: '1px solid rgba(56,189,248,0.08)'
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg,#38bdf8,#818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#fff',
              fontSize: 14,
              flexShrink: 0
            }}
          >
            <RiseOutlined />
          </div>
          {!collapsed && <span style={{ color: '#f0f9ff', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>Trading Agent</span>}
        </div>

        {/* Nav */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[router.pathname]}
          onClick={({ key }) => router.push(key)}
          style={{ background: 'transparent', border: 'none', marginTop: 8 }}
          items={NAV_ITEMS.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            style: { borderRadius: 8, margin: '4px 8px', width: 'calc(100% - 16px)' }
          }))}
        />

        {/* Bottom status */}
        {!collapsed && (
          <div
            style={{
              position: 'absolute',
              bottom: 56,
              left: 0,
              right: 0,
              padding: '12px 16px',
              borderTop: '1px solid rgba(56,189,248,0.08)'
            }}
          >
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>AI 引擎</div>
            <Tag color="cyan" style={{ fontSize: 11 }}>
              DeepSeek
            </Tag>
          </div>
        )}
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'margin 0.2s', background: 'transparent' }}>
        {/* ── Top bar ── */}
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 99,
            padding: '0 24px',
            height: 64,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: 13 }}>
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </div>
          <Space size={16}>
            <Badge count={2} size="small">
              <BellOutlined style={{ color: '#94a3b8', fontSize: 18, cursor: 'pointer' }} />
            </Badge>
            <Avatar
              size={34}
              style={{
                background: 'linear-gradient(135deg,#38bdf8,#818cf8)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13
              }}
            >
              AI
            </Avatar>
          </Space>
        </Header>

        {/* ── Main content ── */}
        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>{children}</Content>
      </Layout>
    </Layout>
  )
}

import React, { useState } from 'react'
import { Layout, Menu, Avatar, Space, Badge, Tag, Tooltip } from 'antd'
import { PieChartOutlined, ThunderboltOutlined, SettingOutlined, BellOutlined, RiseOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useTheme } from '../lib/ThemeContext'

const { Header, Sider, Content } = Layout

const NAV_ITEMS = [
  { key: '/', icon: <PieChartOutlined />, label: '单股看板' },
  { key: '/tasks', icon: <ThunderboltOutlined />, label: '任务中心' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统配置' }
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-base)', transition: 'background 0.3s' }}>
      {/* ── Sidebar ── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        style={{
          background: 'var(--bg-sider)',
          borderRight: '1px solid var(--sider-border)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          overflow: 'auto',
          zIndex: 100,
          transition: 'background 0.3s'
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
          {!collapsed && <span style={{ color: 'var(--text-logo)', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>Stock Analysis</span>}
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
              borderTop: '1px solid var(--sider-border)'
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>AI 引擎</div>
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
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </div>
          <Space size={16}>
            {/* 明暗切换按钮 */}
            <Tooltip title={isDark ? '切换亮色模式' : '切换暗色模式'}>
              <div
                onClick={toggleTheme}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  background: isDark ? 'rgba(56,189,248,0.15)' : 'linear-gradient(135deg,#38bdf8,#818cf8)',
                  border: `1px solid ${isDark ? 'rgba(56,189,248,0.35)' : 'transparent'}`,
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(56,189,248,0.4)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 3px',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: isDark ? '#38bdf8' : '#ffffff',
                    transform: isDark ? 'translateX(0)' : 'translateX(18px)',
                    transition: 'transform 0.3s ease, background 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    color: isDark ? '#fff' : '#38bdf8',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    flexShrink: 0
                  }}
                >
                  {isDark ? <MoonOutlined /> : <SunOutlined />}
                </div>
              </div>
            </Tooltip>
            <Badge count={2} size="small">
              <BellOutlined style={{ color: 'var(--text-secondary)', fontSize: 18, cursor: 'pointer' }} />
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

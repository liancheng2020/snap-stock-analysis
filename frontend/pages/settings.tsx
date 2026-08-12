import Head from 'next/head'
import { Alert, Descriptions, Tag, Typography } from 'antd'

import MainLayout from '../components/MainLayout'

export default function SettingsPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api'

  return (
    <MainLayout>
      <Head><title>系统状态 · Snap Stock Analysis</title></Head>
      <div className="glow-card" style={{ padding: 24, maxWidth: 820 }}>
        <Typography.Title level={3} style={{ color: 'var(--text-primary)' }}>系统状态</Typography.Title>
        <Alert
          type="info"
          showIcon
          message="当前使用可复现的演示分析引擎"
          description="项目不会把模拟结果包装成真实行情。接入行情、财务和 LLM 数据源后，可替换后端 analysis 模块。"
          style={{ marginBottom: 20 }}
        />
        <Descriptions bordered column={1}>
          <Descriptions.Item label="后端 API">{apiBase}</Descriptions.Item>
          <Descriptions.Item label="分析角色">市场、基本面、新闻、情绪</Descriptions.Item>
          <Descriptions.Item label="任务存储"><Tag color="blue">内存模式</Tag></Descriptions.Item>
          <Descriptions.Item label="免责声明">所有结果仅用于技术演示，不构成投资建议</Descriptions.Item>
        </Descriptions>
      </div>
    </MainLayout>
  )
}

import Head from 'next/head'
import { Alert, Button, Empty, Progress, Space, Table, Tag, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import MainLayout from '../components/MainLayout'
import { getTasks, type AnalysisTask, type TaskState } from '../lib/api'

const stateLabel: Record<TaskState, string> = {
  PENDING: '等待中',
  PROGRESS: '分析中',
  SUCCESS: '已完成',
  FAILURE: '失败'
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<AnalysisTask[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setTasks((await getTasks()).data)
    } catch {
      setError('任务列表加载失败，请确认后端服务已启动。')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <MainLayout>
      <Head><title>任务中心 · Snap Stock Analysis</title></Head>
      <div className="glow-card" style={{ padding: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>任务中心</Typography.Title>
            <Typography.Text type="secondary">查看最近的分析任务及结果状态</Typography.Text>
          </div>
          <Button icon={<ReloadOutlined />} loading={loading} onClick={load}>刷新</Button>
        </Space>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Table
          rowKey="task_id"
          loading={loading}
          dataSource={tasks}
          pagination={false}
          locale={{ emptyText: <Empty description="暂无分析任务" /> }}
          columns={[
            { title: '股票', render: (_, item) => <strong>{item.result?.symbol || item.symbol}</strong> },
            { title: '市场', dataIndex: 'market', width: 90 },
            { title: '深度', dataIndex: 'depth', render: (value) => `Level ${value}` },
            {
              title: '状态',
              render: (_, item) => <Tag color={item.state === 'SUCCESS' ? 'green' : item.state === 'FAILURE' ? 'red' : 'blue'}>{stateLabel[item.state]}</Tag>
            },
            {
              title: '进度',
              render: (_, item) => <Progress size="small" percent={item.state === 'SUCCESS' ? 100 : Math.round(((item.progress?.step || 0) / (item.progress?.total || 4)) * 100)} />
            },
            { title: '评分', render: (_, item) => item.result ? `${item.result.score}/100` : '-' }
          ]}
        />
      </div>
    </MainLayout>
  )
}

import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Input, Button, Card, Select, Slider, Tag, Steps, Progress, Row, Col, Statistic, Divider, Alert, Space, Badge } from 'antd'
import {
  SearchOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  FallOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  TeamOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import MainLayout from '../components/MainLayout'
import { startAnalysis, getTask, type AnalysisTask, type Market } from '../lib/api'
import { useTheme } from '../lib/ThemeContext'

const AGENTS = [
  { key: 'market', icon: <GlobalOutlined />, label: '市场分析师', desc: '宏观环境与行业动态' },
  { key: 'fundamental', icon: <BarChartOutlined />, label: '基本面分析师', desc: '财务健康度与核心竞争力' },
  { key: 'news', icon: <FileTextOutlined />, label: '新闻分析师', desc: '近期公告与重大事件' },
  { key: 'social', icon: <TeamOutlined />, label: '社媒分析师', desc: '散户情绪与舆论导向' }
]

export default function Home() {
  const [symbol, setSymbol] = useState('')
  const [depth, setDepth] = useState(3)
  const [market, setMarket] = useState<Market>('A')
  const [taskId, setTaskId] = useState<string | null>(null)
  const [status, setStatus] = useState<AnalysisTask | null>(null)
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [error, setError] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (!taskId) return
    const iv = setInterval(async () => {
      try {
        const r = await getTask(taskId)
        setStatus(r.data)
        const step = r.data?.progress?.step ?? 0
        setActiveStep(step)
        if (r.data.state === 'SUCCESS' || r.data.state === 'FAILURE') clearInterval(iv)
      } catch (e) {
        console.error(e)
      }
    }, 1000)
    return () => clearInterval(iv)
  }, [taskId])

  const handleStart = async () => {
    if (!symbol.trim()) return
    setError(null)
    setStatus(null)
    setActiveStep(0)
    setLoading(true)
    try {
      const r = await startAnalysis(symbol.trim(), market, depth)
      setTaskId(r.data.task_id)
    } catch (e: any) {
      setError(e?.response?.data?.detail || '后端连接失败，请检查服务是否启动')
    } finally {
      setLoading(false)
    }
  }

  const isRunning = status && (status.state === 'PENDING' || status.state === 'PROGRESS')
  const isDone = status && status.state === 'SUCCESS'
  const isFailed = status && status.state === 'FAILURE'
  const score = status?.result?.score ?? 0
  const scoreColor = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171'

  return (
    <MainLayout>
      <Head>
        <title>单股看板 · Stock Analysis</title>
      </Head>

      <Row gutter={[20, 20]}>
        {/* ── 左列：输入配置 ── */}
        <Col xs={24} lg={8}>
          <div className="glow-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>单股分析配置</div>

            {/* 股票输入 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>股票代码 / 名称</div>
              <Space.Compact style={{ width: '100%' }}>
                <Select
                  value={market}
                  onChange={(value) => setMarket(value as Market)}
                  style={{ width: 80 }}
                  options={[
                    { value: 'A', label: 'A股' },
                    { value: 'HK', label: '港股' },
                    { value: 'US', label: '美股' }
                  ]}
                />
                <Input
                  placeholder="000001 / 平安银行"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  onPressEnter={handleStart}
                  prefix={<SearchOutlined style={{ color: isDark ? '#475569' : '#64748b' }} />}
                  style={{
                    background: isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.95)',
                    borderColor: isDark ? 'rgba(56,189,248,0.2)' : 'rgba(56,189,248,0.35)',
                    color: isDark ? '#e2e8f0' : '#1e293b'
                  }}
                />
              </Space.Compact>
            </div>

            {/* 深度设置 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                分析深度 Level {depth}
                <Tag color={depth <= 2 ? 'blue' : depth <= 4 ? 'purple' : 'magenta'} style={{ marginLeft: 8, fontSize: 11 }}>
                  {depth <= 2 ? '快速' : depth <= 4 ? '深度' : '全面'}
                </Tag>
              </div>
              <Slider
                min={1}
                max={5}
                value={depth}
                onChange={setDepth}
                marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }}
                trackStyle={{ background: 'linear-gradient(90deg,#38bdf8,#818cf8)' }}
                handleStyle={{ borderColor: '#38bdf8', background: '#38bdf8' }}
              />
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                {depth <= 2 ? '基础数据概览，约 2-5 分钟' : depth <= 4 ? '多智能体协作分析，约 8-12 分钟' : '技术面+基本面全维度，约 12-16 分钟'}
              </div>
            </div>

            {/* 分析师团队 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>分析师团队</div>
              <Row gutter={[8, 8]}>
                {AGENTS.map((a) => (
                  <Col span={12} key={a.key}>
                    <div
                      style={{
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: 'rgba(56,189,248,0.06)',
                        border: '1px solid rgba(56,189,248,0.12)'
                      }}
                    >
                      <div style={{ color: '#38bdf8', fontSize: 13, marginBottom: 2 }}>
                        {a.icon} {a.label}
                      </div>
                      <div style={{ fontSize: 10, color: '#475569' }}>{a.desc}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
              />
            )}

            <Button
              type="primary"
              block
              size="large"
              icon={<ThunderboltOutlined />}
              loading={loading || isRunning}
              onClick={handleStart}
              style={{
                background: 'linear-gradient(135deg,#38bdf8,#818cf8)',
                border: 'none',
                borderRadius: 10,
                height: 44,
                fontWeight: 600,
                fontSize: 15
              }}
            >
              {isRunning ? '分析中...' : '开始分析'}
            </Button>
          </div>
        </Col>

        {/* ── 右列：结果区域 ── */}
        <Col xs={24} lg={16}>
          {/* 空状态 */}
          {!taskId && (
            <div
              className="glow-card"
              style={{
                padding: 60,
                textAlign: 'center',
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>📈</div>
              <div style={{ fontSize: 18, color: '#334155', fontWeight: 600 }}>选择股票，启动智能分析</div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 8 }}>支持 A股 / 港股 / 美股，多智能体协作深度解析</div>
            </div>
          )}

          {/* 进行中 */}
          {taskId && !isDone && (
            <div className="glow-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <LoadingOutlined style={{ color: '#38bdf8', fontSize: 20, marginRight: 10 }} spin />
                <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
                  <span className="pulse-dot" />
                  分析中 · {symbol.toUpperCase()}
                </span>
              </div>
              <Progress
                percent={Math.round((activeStep / AGENTS.length) * 100)}
                strokeColor={{ '0%': '#38bdf8', '100%': '#818cf8' }}
                trailColor="rgba(56,189,248,0.08)"
                showInfo={false}
                style={{ marginBottom: 20 }}
              />
              <Steps
                current={activeStep - 1}
                direction="vertical"
                size="small"
                style={{ color: '#94a3b8' }}
                items={AGENTS.map((a, i) => ({
                  title: <span style={{ color: i < activeStep ? '#38bdf8' : '#475569' }}>{a.label}</span>,
                  description: <span style={{ color: '#334155', fontSize: 11 }}>{a.desc}</span>,
                  icon:
                    i < activeStep ? (
                      <CheckCircleOutlined style={{ color: '#34d399' }} />
                    ) : i === activeStep ? (
                      <LoadingOutlined style={{ color: '#38bdf8' }} spin />
                    ) : undefined
                }))}
              />
              {isFailed && (
                <Alert
                  type="error"
                  showIcon
                  message="分析失败"
                  description={status.error || '请稍后重试'}
                  style={{ marginTop: 16 }}
                />
              )}
            </div>
          )}

          {/* 完成结果 */}
          {isDone && status?.result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* 评分卡 */}
              <Row gutter={16}>
                <Col span={8}>
                  <div className="glow-card" style={{ padding: 20, textAlign: 'center' }}>
                    <Statistic
                      title={<span style={{ color: '#64748b', fontSize: 12 }}>综合评分</span>}
                      value={score}
                      suffix="/100"
                      valueStyle={{ color: scoreColor, fontSize: 36, fontWeight: 700 }}
                    />
                    <Tag color={score >= 70 ? 'green' : score >= 40 ? 'orange' : 'red'} style={{ marginTop: 8 }}>
                      {score >= 70 ? (
                        <>
                          <RiseOutlined /> 建议关注
                        </>
                      ) : score >= 40 ? (
                        '中性观望'
                      ) : (
                        <>
                          <FallOutlined /> 谨慎
                        </>
                      )}
                    </Tag>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="glow-card" style={{ padding: 20, textAlign: 'center' }}>
                    <Statistic
                      title={<span style={{ color: '#64748b', fontSize: 12 }}>股票代码</span>}
                      value={status.result.symbol?.toUpperCase()}
                      valueStyle={{ color: '#38bdf8', fontSize: 28, fontWeight: 700 }}
                    />
                    <Tag color="blue" style={{ marginTop: 8 }}>
                      {market}股
                    </Tag>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="glow-card" style={{ padding: 20, textAlign: 'center' }}>
                    <Statistic
                      title={<span style={{ color: '#64748b', fontSize: 12 }}>分析深度</span>}
                      value={`Level ${depth}`}
                      valueStyle={{ color: '#818cf8', fontSize: 28, fontWeight: 700 }}
                    />
                    <Tag color="purple" style={{ marginTop: 8 }}>
                      {depth <= 2 ? '快速' : depth <= 4 ? '深度' : '全面'}
                    </Tag>
                  </div>
                </Col>
              </Row>

              {/* 分析摘要 */}
              <div className="glow-card" style={{ padding: 24 }}>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12, letterSpacing: 1 }}>📋 AI 分析摘要</div>
                <Divider style={{ borderColor: 'rgba(56,189,248,0.1)', margin: '0 0 16px' }} />
                <div
                  style={{
                    color: '#cbd5e1',
                    fontSize: 14,
                    lineHeight: 1.8,
                    background: 'rgba(56,189,248,0.04)',
                    borderRadius: 10,
                    padding: '16px 20px',
                    border: '1px solid rgba(56,189,248,0.08)'
                  }}
                >
                  {status.result.summary || '暂无分析摘要'}
                </div>
                <Alert
                  type="warning"
                  showIcon
                  message={status.result.disclaimer}
                  style={{ marginTop: 16 }}
                />
              </div>

              <Row gutter={[16, 16]}>
                {status.result.agents.map((agent) => (
                  <Col xs={24} md={12} key={agent.key}>
                    <div className="glow-card" style={{ padding: 20, height: '100%' }}>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <strong>{agent.name}</strong>
                        <Tag color={agent.score >= 68 ? 'green' : agent.score >= 52 ? 'blue' : 'orange'}>{agent.score}/100</Tag>
                      </Space>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{agent.conclusion}</p>
                      <Space wrap>{agent.signals.map((signal) => <Tag key={signal}>{signal}</Tag>)}</Space>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </MainLayout>
  )
}

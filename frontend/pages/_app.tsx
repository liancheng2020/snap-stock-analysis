import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#38bdf8',
          colorBgContainer: 'rgba(10,22,40,0.85)',
          colorBgElevated: '#0e1e3c',
          borderRadius: 10,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        }
      }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  )
}

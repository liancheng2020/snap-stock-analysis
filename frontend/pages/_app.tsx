import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { ThemeProvider, useTheme } from '../lib/ThemeContext'

function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { theme: appTheme } = useTheme()
  const isDark = appTheme === 'dark'

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#38bdf8',
          colorBgContainer: isDark ? 'rgba(10,22,40,0.85)' : 'rgba(255,255,255,0.9)',
          colorBgElevated: isDark ? '#0e1e3c' : '#ffffff',
          colorText: isDark ? '#e2e8f0' : '#1e293b',
          borderRadius: 10,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        }
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AntdConfigProvider>
        <Component {...pageProps} />
      </AntdConfigProvider>
    </ThemeProvider>
  )
}

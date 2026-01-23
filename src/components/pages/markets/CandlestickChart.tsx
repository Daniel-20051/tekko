import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import type { IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts'

interface CandlestickChartProps {
  data: Array<{
    time: number | string
    open: number
    high: number
    low: number
    close: number
  }>
  height?: number
  isPositive?: boolean
}

const CandlestickChart = ({ data, height = 250, isPositive = true }: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(156, 163, 175, 0.1)' },
        horzLines: { color: 'rgba(156, 163, 175, 0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })

    chartRef.current = chart

    // Add candlestick series
    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    })

    seriesRef.current = candlestickSeries

    // Format and set data
    const formattedData: CandlestickData[] = data.map((item) => ({
      time: (typeof item.time === 'string' ? new Date(item.time).getTime() / 1000 : item.time) as Time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }))

    candlestickSeries.setData(formattedData)

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chart) {
        chart.remove()
      }
    }
  }, [data, height, isPositive])

  // Update data when it changes
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      const formattedData: CandlestickData[] = data.map((item) => ({
        time: (typeof item.time === 'string' ? new Date(item.time).getTime() / 1000 : item.time) as Time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }))
      seriesRef.current.setData(formattedData)
    }
  }, [data])

  return <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }} />
}

export default CandlestickChart

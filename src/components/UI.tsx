import { useMemo, useState, type PropsWithChildren } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`card ${className}`.trim()}>{children}</section>;
}

export function CardTitle({ children, meta }: PropsWithChildren<{ meta?: string }>) {
  return (
    <div className="card-header">
      <h2 className="card-title">{children}</h2>
      {meta ? <span className="card-meta">{meta}</span> : null}
    </div>
  );
}

export function InfoMessage({ text }: { text: string }) {
  return <div className="info-message">{text}</div>;
}

export function StatCard({ name, value, delta, trend }: { name: string; value: string; delta: string; trend: 'up' | 'down' }) {
  return (
    <Card className="stat-card">
      <div className="muted small">{name}</div>
      <div className="metric">{value}</div>
      <div className={`delta ${trend}`}>{delta}</div>
    </Card>
  );
}

export function SegmentedControl({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="segmented-control">
      {items.map((item) => (
        <button key={item} className={`segment ${item === value ? 'active' : ''}`} onClick={() => onChange(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}

export function AreaLineChart({
  data,
  lines,
  formatValue,
}: {
  data: Array<Record<string, number | string>>;
  lines: { key: string; label: string; colorClass: string }[];
  formatValue?: (key: string, value: number) => string;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const width = 760;
  const height = 260;
  const padding = 24;
  const max = Math.max(...data.flatMap((item) => lines.map((line) => Number(item[line.key]))), 1);
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  const linePaths = useMemo(
    () =>
      lines.map((line) => {
        const points = data.map((item, index) => {
          const x = padding + index * stepX;
          const y = height - padding - (Number(item[line.key]) / max) * (height - padding * 2);
          return { x, y, value: Number(item[line.key]) };
        });

        const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
        const area = `${path} L ${points[points.length - 1]?.x ?? padding} ${height - padding} L ${points[0]?.x ?? padding} ${height - padding} Z`;
        return { ...line, points, path, area };
      }),
    [data, height, lines, max, padding, stepX],
  );

  const activeIndex = hoverIndex ?? data.length - 1;
  const activeItem = data[activeIndex];
  const activeX = padding + activeIndex * stepX;

  return (
    <div className="chart-card">
      <div className="chart-toolbar">
        {lines.map((line) => (
          <span key={line.key} className="legend-pill">
            <span className={`legend-color ${line.colorClass}`} />
            {line.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart" onMouseLeave={() => setHoverIndex(null)}>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line key={ratio} x1={padding} y1={height - padding - ratio * (height - padding * 2)} x2={width - padding} y2={height - padding - ratio * (height - padding * 2)} className="chart-grid-line" />
        ))}
        {linePaths.map((line, index) => (
          <g key={line.key}>
            {index === 0 ? <path d={line.area} className={`chart-area ${line.colorClass}`} /> : null}
            <path d={line.path} className={`chart-line ${line.colorClass}`} />
            {line.points.map((point, pointIndex) => (
              <circle key={`${line.key}-${pointIndex}`} cx={point.x} cy={point.y} r={hoverIndex === pointIndex ? 5 : 3.5} className={`chart-point ${line.colorClass}`} onMouseEnter={() => setHoverIndex(pointIndex)} />
            ))}
          </g>
        ))}
        <line x1={activeX} y1={padding} x2={activeX} y2={height - padding} className="hover-line" />
      </svg>
      <div className="chart-hover-panel">
        <div>
          <div className="muted small">Период</div>
          <strong>{String(activeItem.label)}</strong>
        </div>
        <div className="hover-values">
          {lines.map((line) => (
            <div key={line.key}>
              <div className="muted small">{line.label}</div>
              <strong>{formatValue ? formatValue(line.key, Number(activeItem[line.key])) : activeItem[line.key]}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="line-labels">
        {data.map((item) => (
          <span key={String(item.label)}>{String(item.label)}</span>
        ))}
      </div>
    </div>
  );
}

export function GroupedBarChart({
  data,
  bars,
}: {
  data: Array<Record<string, number | string>>;
  bars: { key: string; label: string; colorClass: string }[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.flatMap((item) => bars.map((bar) => Number(item[bar.key]))), 1);
  return (
    <div className="grouped-bars">
      <div className="chart-toolbar">
        {bars.map((bar) => (
          <span key={bar.key} className="legend-pill">
            <span className={`legend-color ${bar.colorClass}`} />
            {bar.label}
          </span>
        ))}
      </div>
      <div className="bars-grid">
        {data.map((item, index) => (
          <div key={String(item.label)} className={`bar-group ${active === index ? 'active' : ''}`} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)}>
            <div className="bars-column">
              {bars.map((bar) => (
                <div key={bar.key} className="bar-shell">
                  <div className={`bar-vertical ${bar.colorClass}`} style={{ height: `${(Number(item[bar.key]) / max) * 100}%` }} />
                </div>
              ))}
            </div>
            <div className="bar-group-label">{String(item.label)}</div>
            <div className="bar-group-values">
              {bars.map((bar) => (
                <span key={bar.key}>{bar.label}: {item[bar.key]}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({ data }: { data: { label: string; value: number }[] }) {
  const [activeLabel, setActiveLabel] = useState(data[0]?.label ?? '');
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const colors = ['chart-segment-1', 'chart-segment-2', 'chart-segment-3', 'chart-segment-4', 'chart-segment-5'];
  let offset = 0;
  const activeItem = data.find((item) => item.label === activeLabel) ?? data[0];

  return (
    <div className="donut-layout">
      <svg viewBox="0 0 180 180" className="donut-chart" role="img" aria-label="Структура источников данных">
        <circle cx="90" cy="90" r={radius} className="donut-base" />
        {data.map((item, index) => {
          const dash = (item.value / total) * circumference;
          const currentOffset = offset;
          offset += dash;
          const isActive = item.label === activeLabel;
          return (
            <circle
              key={item.label}
              cx="90"
              cy="90"
              r={isActive ? radius + 2 : radius}
              className={`${colors[index % colors.length]} donut-segment ${isActive ? 'active' : ''}`}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-currentOffset}
              onMouseEnter={() => setActiveLabel(item.label)}
            />
          );
        })}
        <text x="90" y="82" textAnchor="middle" className="donut-center-big">
          {activeItem?.value}%
        </text>
        <text x="90" y="102" textAnchor="middle" className="donut-center-small">
          {activeItem?.label}
        </text>
      </svg>
      <div className="legend-list">
        {data.map((item, index) => (
          <button key={item.label} className={`legend-item-button ${item.label === activeLabel ? 'active' : ''}`} onMouseEnter={() => setActiveLabel(item.label)}>
            <span className={`legend-dot ${colors[index % colors.length]}`} />
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Heatmap({ rows, columns }: { rows: { name: string; values: number[] }[]; columns: string[] }) {
  const max = Math.max(...rows.flatMap((row) => row.values), 1);
  return (
    <div className="heatmap">
      <div className="heatmap-header">
        <span />
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row.name} className="heatmap-row">
          <span className="heatmap-label">{row.name}</span>
          {row.values.map((value, index) => (
            <div key={`${row.name}-${index}`} className="heat-cell" style={{ opacity: 0.25 + (value / max) * 0.75 }} title={`${row.name} · ${columns[index]}: ${value}`}>
              {value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

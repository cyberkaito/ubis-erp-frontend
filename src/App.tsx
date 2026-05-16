import { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout, type NavItem } from './components/Layout';
import { AreaLineChart, Card, CardTitle, DonutChart, GroupedBarChart, Heatmap, InfoMessage, SegmentedControl, StatCard } from './components/UI';
import {
  dashboards,
  documents,
  heatmap,
  jobs,
  kpiLibrary,
  periods,
  reports,
  roles,
  segmentSales,
  sourceShare,
  sources,
  topMetrics,
  users,
  revenueTrend,
  type Role,
} from './data/mock';

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Обзор' },
  { to: '/reports', label: 'Отчеты' },
  { to: '/sources', label: 'Источники' },
  { to: '/kpi', label: 'KPI' },
  { to: '/builder', label: 'Конструктор' },
  { to: '/admin', label: 'Администрирование' },
  { to: '/docs', label: 'Документы' },
];

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  'Руководитель': ['/', '/reports', '/sources', '/kpi', '/builder', '/docs'],
  'BI-аналитик': ['/', '/reports', '/sources', '/kpi', '/builder', '/docs'],
  'Администратор': ['/', '/reports', '/sources', '/kpi', '/builder', '/admin', '/docs'],
  'ERP-пользователь': ['/', '/reports', '/kpi', '/builder', '/docs'],
};

function App() {
  const [role, setRole] = useState<Role>('Руководитель');
  const [message, setMessage] = useState('');

  const allowedRoutes = ROLE_PERMISSIONS[role];
  const navItems = useMemo(() => NAV_ITEMS.filter((item) => allowedRoutes.includes(item.to)), [allowedRoutes]);

  const notifyServerAction = (action: string) => {
    setMessage(`Функция «${action}» требует серверной логики и недоступна в статическом frontend.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            role={role}
            onRoleChange={setRole}
            navItems={navItems}
            roleSelector={
              <select value={role} className="input" onChange={(e) => setRole(e.target.value as Role)}>
                {roles.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            }
          />
        }
      >
        <Route index element={<DashboardPage role={role} allowedRoutes={allowedRoutes} notify={notifyServerAction} message={message} />} />
        <Route path="reports" element={<ProtectedRoute role={role} path="/reports"><ReportsPage notify={notifyServerAction} /></ProtectedRoute>} />
        <Route path="sources" element={<ProtectedRoute role={role} path="/sources"><SourcesPage notify={notifyServerAction} /></ProtectedRoute>} />
        <Route path="kpi" element={<ProtectedRoute role={role} path="/kpi"><KpiPage notify={notifyServerAction} /></ProtectedRoute>} />
        <Route path="builder" element={<ProtectedRoute role={role} path="/builder"><BuilderPage notify={notifyServerAction} /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute role={role} path="/admin"><AdminPage notify={notifyServerAction} /></ProtectedRoute>} />
        <Route path="docs" element={<ProtectedRoute role={role} path="/docs"><DocsPage notify={notifyServerAction} /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

function ProtectedRoute({ role, path, children }: { role: Role; path: string; children: JSX.Element }) {
  if (!ROLE_PERMISSIONS[role].includes(path)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function DashboardPage({ role, allowedRoutes, notify, message }: { role: Role; allowedRoutes: string[]; notify: (action: string) => void; message: string }) {
  const [period, setPeriod] = useState(periods[1]);
  return (
    <div className="page-grid">
      {message ? <InfoMessage text={message} /> : null}
      <div className="toolbar-row">
        <SegmentedControl items={periods} value={period} onChange={setPeriod} />
        <div className="chip-wrap">
          <span className="chip">Роль: {role}</span>
          <span className="chip">Доступно разделов: {allowedRoutes.length}</span>
        </div>
      </div>
      <div className="stats-grid">
        {topMetrics.map((item) => <StatCard key={item.name} {...item} />)}
      </div>
      <div className="two-columns two-columns-2-1">
        <Card>
          <CardTitle meta={period}>Выручка, план и маржа</CardTitle>
          <AreaLineChart
            data={revenueTrend}
            lines={[
              { key: 'revenue', label: 'Факт', colorClass: 'series-primary' },
              { key: 'plan', label: 'План', colorClass: 'series-secondary' },
              { key: 'margin', label: 'Маржа %', colorClass: 'series-accent' },
            ]}
            formatValue={(key, value) => (key === 'margin' ? `${value}%` : `₽ ${value} млн`)}
          />
        </Card>
        <Card>
          <CardTitle>Структура источников</CardTitle>
          <DonutChart data={sourceShare} />
        </Card>
      </div>
      <div className="two-columns">
        <Card>
          <CardTitle>Региональный план / факт</CardTitle>
          <GroupedBarChart
            data={segmentSales}
            bars={[
              { key: 'actual', label: 'Факт', colorClass: 'series-primary' },
              { key: 'target', label: 'План', colorClass: 'series-secondary' },
            ]}
          />
        </Card>
        <Card>
          <CardTitle>Публикации</CardTitle>
          <table className="table">
            <thead>
              <tr><th>Дашборд</th><th>Владелец</th><th>Статус</th><th>Просмотры</th></tr>
            </thead>
            <tbody>
              {dashboards.map((item) => (
                <tr key={item.id}><td>{item.name}</td><td>{item.owner}</td><td>{item.status}</td><td>{item.viewers}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="button-row">
            <button className="secondary-button" onClick={() => notify('Публикация дашборда')}>Опубликовать</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ReportsPage({ notify }: { notify: (action: string) => void }) {
  const [selectedOwner, setSelectedOwner] = useState('Все владельцы');
  const owners = ['Все владельцы', ...Array.from(new Set(reports.map((item) => item.owner)))];
  const filtered = selectedOwner === 'Все владельцы' ? reports : reports.filter((item) => item.owner === selectedOwner);

  return (
    <div className="page-grid">
      <div className="toolbar-row">
        <SegmentedControl items={owners} value={selectedOwner} onChange={setSelectedOwner} />
        <div className="button-row">
          <button className="primary-button" onClick={() => notify('Экспорт отчета')}>Экспортировать</button>
          <button className="secondary-button" onClick={() => notify('Настройка расписания')}>Изменить расписание</button>
        </div>
      </div>
      <Card>
        <CardTitle>Каталог отчетов</CardTitle>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Отчет</th><th>Формат</th><th>Расписание</th><th>Владелец</th></tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}><td>{item.id}</td><td>{item.name}</td><td>{item.format}</td><td>{item.schedule}</td><td>{item.owner}</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="two-columns">
        <Card>
          <CardTitle>Матрица активности подразделений</CardTitle>
          <Heatmap rows={heatmap} columns={['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']} />
        </Card>
        <Card>
          <CardTitle>Текущие KPI каталога</CardTitle>
          <table className="table compact-table">
            <thead><tr><th>Показатель</th><th>Статус</th><th>Факт</th><th>Цель</th></tr></thead>
            <tbody>
              {kpiLibrary.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.status}</td><td>{item.actual}</td><td>{item.target}</td></tr>)}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function SourcesPage({ notify }: { notify: (action: string) => void }) {
  return (
    <div className="page-grid two-columns">
      <Card>
        <CardTitle>Источники и актуальность</CardTitle>
        <table className="table">
          <thead><tr><th>Источник</th><th>Тип</th><th>Статус</th><th>Свежесть</th><th>Объем</th></tr></thead>
          <tbody>
            {sources.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.type}</td><td>{item.status}</td><td>{item.freshness}</td><td>{item.rows}</td></tr>)}
          </tbody>
        </table>
      </Card>
      <Card>
        <CardTitle>Мониторинг ETL / ELT</CardTitle>
        <table className="table compact-table">
          <thead><tr><th>Процесс</th><th>Статус</th><th>Старт</th><th>Длит.</th><th>Строки</th></tr></thead>
          <tbody>
            {jobs.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.status}</td><td>{item.startedAt}</td><td>{item.duration}</td><td>{item.rows}</td></tr>)}
          </tbody>
        </table>
        <div className="button-row">
          <button className="primary-button" onClick={() => notify('Ручной запуск ETL')}>Запустить ETL</button>
          <button className="secondary-button" onClick={() => notify('Повтор проблемной загрузки')}>Повторить</button>
        </div>
      </Card>
    </div>
  );
}

function KpiPage({ notify }: { notify: (action: string) => void }) {
  return (
    <div className="page-grid">
      <div className="two-columns">
        <Card>
          <CardTitle>Каталог KPI</CardTitle>
          <table className="table">
            <thead><tr><th>Показатель</th><th>Владелец</th><th>Статус</th><th>Факт</th><th>Цель</th></tr></thead>
            <tbody>
              {kpiLibrary.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.owner}</td><td>{item.status}</td><td>{item.actual}</td><td>{item.target}</td></tr>)}
            </tbody>
          </table>
          <div className="button-row">
            <button className="primary-button" onClick={() => notify('Создание KPI')}>Создать KPI</button>
            <button className="secondary-button" onClick={() => notify('Перерасчет KPI')}>Пересчитать KPI</button>
          </div>
        </Card>
        <Card>
          <CardTitle>Профиль целевых значений</CardTitle>
          <AreaLineChart
            data={revenueTrend}
            lines={[
              { key: 'margin', label: 'Маржа %', colorClass: 'series-accent' },
              { key: 'plan', label: 'Целевой тренд', colorClass: 'series-secondary' },
            ]}
            formatValue={(key, value) => (key === 'margin' ? `${value}%` : `₽ ${value} млн`)}
          />
        </Card>
      </div>
    </div>
  );
}

function BuilderPage({ notify }: { notify: (action: string) => void }) {
  const datasets = {
    'Продажи и план': {
      type: 'xy',
      data: revenueTrend,
      dimension: 'label',
      metrics: [
        { key: 'revenue', label: 'Факт', format: (v: number) => `₽ ${v} млн` },
        { key: 'plan', label: 'План', format: (v: number) => `₽ ${v} млн` },
        { key: 'margin', label: 'Маржа %', format: (v: number) => `${v}%` },
      ],
    },
    'Региональные продажи': {
      type: 'xy',
      data: segmentSales,
      dimension: 'label',
      metrics: [
        { key: 'actual', label: 'Факт', format: (v: number) => `${v}` },
        { key: 'target', label: 'План', format: (v: number) => `${v}` },
      ],
    },
    'Структура источников': {
      type: 'share',
      data: sourceShare,
      dimension: 'label',
      metrics: [{ key: 'value', label: 'Доля', format: (v: number) => `${v}%` }],
    },
    'KPI каталог': {
      type: 'table',
      data: kpiLibrary,
      dimension: 'name',
      metrics: [],
    },
  } as const;

  type DatasetName = keyof typeof datasets;
  const datasetNames = Object.keys(datasets) as DatasetName[];
  const [datasetName, setDatasetName] = useState<DatasetName>('Продажи и план');
  const [chartType, setChartType] = useState<'Линейный' | 'Столбчатый' | 'Кольцевой' | 'Таблица'>('Линейный');
  const dataset = datasets[datasetName];
  const metricOptions = dataset.metrics.map((m) => m.key);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(metricOptions.slice(0, Math.min(metricOptions.length, 2)));

  const safeSelectedMetrics = selectedMetrics.filter((key) => (metricOptions as readonly string[]).includes(key));
  const setDatasetWithDefaults = (next: DatasetName) => {
    setDatasetName(next);
    const nextMetricOptions = datasets[next].metrics.map((m) => m.key);
    setSelectedMetrics(nextMetricOptions.slice(0, Math.min(nextMetricOptions.length, 2)));
    if (datasets[next].type === 'share') setChartType('Кольцевой');
    else if (datasets[next].type === 'table') setChartType('Таблица');
    else setChartType('Линейный');
  };

  const chartLines = safeSelectedMetrics.map((key, index) => ({
    key,
    label: dataset.metrics.find((m) => m.key === key)?.label ?? key,
    colorClass: ['series-primary', 'series-secondary', 'series-accent'][index % 3],
  }));

  const chartBars = chartLines;

  return (
    <div className="page-grid">
      <div className="two-columns two-columns-2-1">
        <Card>
          <CardTitle>Конструктор визуализаций</CardTitle>
          <div className="builder-grid">
            <label>
              <span className="muted small">Источник</span>
              <select className="input" value={datasetName} onChange={(e) => setDatasetWithDefaults(e.target.value as DatasetName)}>
                {datasetNames.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span className="muted small">Тип визуализации</span>
              <select className="input" value={chartType} onChange={(e) => setChartType(e.target.value as typeof chartType)}>
                {['Линейный', 'Столбчатый', 'Кольцевой', 'Таблица'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            {dataset.metrics.length ? (
              <div>
                <span className="muted small">Показатели</span>
                <div className="metric-pills">
                  {dataset.metrics.map((metric) => {
                    const active = safeSelectedMetrics.includes(metric.key);
                    return (
                      <button
                        key={metric.key}
                        className={`chip-button ${active ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedMetrics((current) => {
                            if (current.includes(metric.key)) return current.filter((item) => item !== metric.key);
                            return [...current, metric.key].slice(0, 3);
                          });
                        }}
                      >
                        {metric.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
            <div className="button-row">
              <button className="primary-button" onClick={() => notify('Сохранение пользовательской визуализации')}>Сохранить</button>
              <button className="secondary-button" onClick={() => notify('Публикация пользовательской визуализации')}>Опубликовать</button>
            </div>
          </div>
        </Card>
        <Card>
          <CardTitle>Параметры</CardTitle>
          <div className="panel small-gap">
            <div className="muted small">Текущий источник</div>
            <strong>{datasetName}</strong>
            <div className="muted small">Выбранные показатели</div>
            <strong>{safeSelectedMetrics.length ? safeSelectedMetrics.join(', ') : '—'}</strong>
            <div className="muted small">Доступные действия</div>
            <div className="chip-wrap">
              <span className="chip">Фильтрация</span>
              <span className="chip">Сравнение</span>
              <span className="chip">Drill-down</span>
            </div>
          </div>
        </Card>
      </div>
      <Card>
        <CardTitle>Предпросмотр</CardTitle>
        {chartType === 'Линейный' && dataset.type === 'xy' ? (
          <AreaLineChart data={dataset.data as Array<Record<string, string | number>>} lines={chartLines} />
        ) : null}
        {chartType === 'Столбчатый' && dataset.type === 'xy' ? (
          <GroupedBarChart data={dataset.data as Array<Record<string, string | number>>} bars={chartBars} />
        ) : null}
        {chartType === 'Кольцевой' && dataset.type === 'share' ? (
          <DonutChart data={dataset.data as { label: string; value: number }[]} />
        ) : null}
        {chartType === 'Таблица' || dataset.type === 'table' ? (
          <table className="table">
            <thead><tr><th>Показатель</th><th>Владелец</th><th>Статус</th><th>Факт</th><th>Цель</th></tr></thead>
            <tbody>
              {kpiLibrary.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.owner}</td><td>{item.status}</td><td>{item.actual}</td><td>{item.target}</td></tr>)}
            </tbody>
          </table>
        ) : null}
      </Card>
    </div>
  );
}

function AdminPage({ notify }: { notify: (action: string) => void }) {
  return (
    <div className="page-grid">
      <Card>
        <CardTitle>Пользователи и доступ</CardTitle>
        <table className="table">
          <thead><tr><th>Пользователь</th><th>Роль</th><th>Доступ</th><th>Статус</th></tr></thead>
          <tbody>
            {users.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.role}</td><td>{item.access}</td><td>{item.status}</td></tr>)}
          </tbody>
        </table>
        <div className="button-row">
          <button className="primary-button" onClick={() => notify('Изменение ролей пользователей')}>Назначить роль</button>
          <button className="secondary-button" onClick={() => notify('Синхронизация с каталогом')}>Синхронизировать</button>
        </div>
      </Card>
    </div>
  );
}

function DocsPage({ notify }: { notify: (action: string) => void }) {
  return (
    <div className="page-grid two-columns">
      <Card>
        <CardTitle>Документы</CardTitle>
        <table className="table compact-table">
          <thead><tr><th>Документ</th><th>Категория</th><th>Обновлен</th></tr></thead>
          <tbody>
            {documents.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.category}</td><td>{item.updatedAt}</td></tr>)}
          </tbody>
        </table>
      </Card>
      <Card>
        <CardTitle>Публикация</CardTitle>
        <p className="muted">Документы доступны для просмотра в интерфейсе. Публикация и версионирование требуют backend.</p>
        <div className="button-row">
          <button className="primary-button" onClick={() => notify('Публикация документа')}>Опубликовать</button>
          <button className="secondary-button" onClick={() => notify('Синхронизация с хранилищем документов')}>Синхронизировать</button>
        </div>
      </Card>
    </div>
  );
}

export default App;

export type Role = 'Руководитель' | 'BI-аналитик' | 'Администратор' | 'ERP-пользователь';

export const roles: Role[] = ['Руководитель', 'BI-аналитик', 'Администратор', 'ERP-пользователь'];

export const topMetrics = [
  { name: 'Выручка', value: '₽ 428,4 млн', delta: '+8,2%', trend: 'up' as const },
  { name: 'Маржинальность', value: '21,8%', delta: '+1,4 п.п.', trend: 'up' as const },
  { name: 'Запасы > 90 дней', value: '6,3%', delta: '-0,8 п.п.', trend: 'up' as const },
  { name: 'SLA загрузок', value: '99,2%', delta: '+0,5%', trend: 'up' as const },
];

export const dashboards = [
  { id: 1, name: 'Executive overview', owner: 'BI Office', status: 'Активен', viewers: 42 },
  { id: 2, name: 'Продажи и маржа', owner: 'Коммерческий блок', status: 'Активен', viewers: 31 },
  { id: 3, name: 'Запасы и оборачиваемость', owner: 'Supply Chain', status: 'Требует обновления', viewers: 18 },
  { id: 4, name: 'Мониторинг интеграций', owner: 'IT Operations', status: 'Активен', viewers: 12 },
];

export const reports = [
  { id: 'R-01', name: 'Daily Sales Executive', format: 'PDF / XLSX', schedule: 'Ежедневно · 08:00', owner: 'BI Office' },
  { id: 'R-02', name: 'Inventory Aging', format: 'XLSX', schedule: 'Каждый час', owner: 'Supply Chain' },
  { id: 'R-03', name: 'KPI Branch Performance', format: 'PDF', schedule: 'Пн · 07:30', owner: 'Finance' },
  { id: 'R-04', name: 'ETL Health Check', format: 'HTML', schedule: 'Каждые 15 мин', owner: 'IT Operations' },
];

export const sources = [
  { name: 'ERP Продажи', type: 'Oracle ERP', status: 'Онлайн', freshness: '2 мин назад', rows: '12,4 млн' },
  { name: 'ERP Закупки', type: 'SAP', status: 'Онлайн', freshness: '5 мин назад', rows: '8,1 млн' },
  { name: 'ERP Склад', type: '1С', status: 'Предупреждение', freshness: '24 мин назад', rows: '4,7 млн' },
  { name: 'Финансовый контур', type: 'PostgreSQL', status: 'Онлайн', freshness: '3 мин назад', rows: '3,2 млн' },
  { name: 'Прайс-импорт', type: 'CSV/XLSX', status: 'Ожидает', freshness: '1 ч назад', rows: '186 тыс.' },
];

export const jobs = [
  { id: 'ETL-001', name: 'Загрузка продаж', status: 'Успешно', startedAt: '10:00', duration: '3 мин', rows: '420 тыс.' },
  { id: 'ETL-002', name: 'Загрузка остатков', status: 'Ошибка', startedAt: '09:55', duration: '7 мин', rows: '—' },
  { id: 'ETL-003', name: 'Пересчет KPI', status: 'Выполняется', startedAt: '10:12', duration: '2 мин', rows: '1,2 млн' },
  { id: 'ETL-004', name: 'Витрина P&L', status: 'Успешно', startedAt: '09:20', duration: '6 мин', rows: '83 тыс.' },
];

export const users = [
  { name: 'Анна Смирнова', role: 'Руководитель', access: 'Executive, Sales, KPI', status: 'Активен' },
  { name: 'Олег Иванов', role: 'BI-аналитик', access: 'Reports, KPI, Data marts', status: 'Активен' },
  { name: 'Ирина Петрова', role: 'Администратор', access: 'Sources, ETL, RBAC', status: 'Активен' },
  { name: 'Сергей Волков', role: 'ERP-пользователь', access: 'Sales dashboard', status: 'Приглашен' },
];

export const documents = [
  { name: 'Руководство пользователя', category: 'User Guide', updatedAt: '12.05.2026' },
  { name: 'Руководство администратора', category: 'Admin Guide', updatedAt: '10.05.2026' },
  { name: 'Каталог KPI', category: 'Methodology', updatedAt: '09.05.2026' },
  { name: 'Регламент обновления данных', category: 'Operations', updatedAt: '08.05.2026' },
];

export const revenueTrend = [
  { label: 'Янв', revenue: 56, margin: 18.4, plan: 52 },
  { label: 'Фев', revenue: 61, margin: 18.8, plan: 58 },
  { label: 'Мар', revenue: 66, margin: 19.2, plan: 62 },
  { label: 'Апр', revenue: 72, margin: 20.4, plan: 69 },
  { label: 'Май', revenue: 75, margin: 21.1, plan: 71 },
  { label: 'Июн', revenue: 81, margin: 21.8, plan: 76 },
];

export const segmentSales = [
  { label: 'North', actual: 84, target: 78 },
  { label: 'Central', actual: 92, target: 88 },
  { label: 'South', actual: 71, target: 68 },
  { label: 'Online', actual: 108, target: 95 },
  { label: 'B2B', actual: 64, target: 60 },
];

export const sourceShare = [
  { label: 'Продажи', value: 32 },
  { label: 'Закупки', value: 21 },
  { label: 'Склад', value: 18 },
  { label: 'Финансы', value: 17 },
  { label: 'Файловый импорт', value: 12 },
];

export const kpiLibrary = [
  { name: 'Выручка по подразделениям', owner: 'Finance', status: 'В проде', actual: '₽ 428,4 млн', target: '₽ 410,0 млн' },
  { name: 'Маржинальность', owner: 'Commerce', status: 'В проде', actual: '21,8%', target: '20,0%' },
  { name: 'Оборачиваемость запасов', owner: 'Supply Chain', status: 'Тест', actual: '34 дня', target: '30 дней' },
  { name: 'Успешность ETL', owner: 'IT Operations', status: 'В проде', actual: '99,2%', target: '98,5%' },
];

export const heatmap = [
  { name: 'North', values: [82, 84, 79, 88, 91, 93] },
  { name: 'Central', values: [76, 78, 81, 83, 87, 90] },
  { name: 'South', values: [69, 72, 71, 74, 77, 79] },
  { name: 'Online', values: [91, 95, 98, 103, 108, 111] },
];

export const periods = ['Текущий месяц', 'Квартал', 'Полугодие'];

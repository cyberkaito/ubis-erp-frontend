import { NavLink, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Role } from '../data/mock';

export interface NavItem {
  to: string;
  label: string;
}

interface LayoutProps {
  role: Role;
  onRoleChange: (value: Role) => void;
  roleSelector: ReactNode;
  navItems: NavItem[];
}

export function Layout({ role, onRoleChange, roleSelector, navItems }: LayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="logo">УБИС-ERP</div>
          <p className="muted">Unified BI workspace</p>
        </div>
        <nav className="nav-list">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="panel small-gap">
          <div className="panel-title">Роль</div>
          {roleSelector}
          <div className="badge neutral">{role}</div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>УБИС-ERP</h1>
            <p className="muted">Единое окно аналитики, источников, KPI и публикаций.</p>
          </div>
          <button className="secondary-button" onClick={() => onRoleChange(role)}>
            Обновить
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

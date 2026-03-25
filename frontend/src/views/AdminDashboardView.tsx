import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const AMBER = '#E8A510', TEAL = '#1D9E75', PURPLE = '#7F77DD', CORAL = '#D85A30', BLUE = '#378ADD', GRAY = '#888780';

const MOCK_STATS = {
    metrics: {
        total_users: 1284,
        total_scripts: 3871,
        total_keyframes: 9204,
        api_spend: 847
    },
    recent_users: [
        { name: 'Amara O.', initials: 'AO', segment: 'Filmmaker', plan: 'Premium', status: 'Active', registered: '2023-10-12T10:30:00Z', last_active: '2 mins ago' },
        { name: 'Lucas M.', initials: 'LM', segment: 'Creator', plan: 'Free', status: 'Inactive', registered: '2023-09-28T14:20:00Z', last_active: '12 days ago' },
        { name: 'Priya S.', initials: 'PS', segment: 'Agency', plan: 'Pro', status: 'Active', registered: '2023-11-05T09:15:00Z', last_active: '1 hr ago' },
        { name: 'Daniel K.', initials: 'DK', segment: 'Filmmaker', plan: 'Premium', status: 'Active', registered: '2023-10-22T16:45:00Z', last_active: '5 mins ago' },
        { name: 'Sofia R.', initials: 'SR', segment: 'Creator', plan: 'Free', status: 'Active', registered: '2023-11-12T11:05:00Z', last_active: '45 mins ago' },
        { name: 'James W.', initials: 'JW', segment: 'Agency', plan: 'Pro', status: 'Active', registered: '2023-11-15T13:30:00Z', last_active: '3 hrs ago' },
    ],
    charts: {
        labels: Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        }),
        registration_data: {
            filmmakers: [8, 12, 15, 10, 18, 22, 14, 19, 25, 21, 16, 12, 10, 14, 18, 22, 28, 24, 20, 18, 15, 12, 10, 14, 16, 18, 20, 22, 24, 26],
            creators: [5, 8, 10, 7, 12, 15, 10, 14, 18, 15, 12, 9, 8, 10, 12, 15, 20, 18, 15, 14, 12, 10, 8, 11, 13, 15, 17, 19, 21, 22],
            agencies: [3, 4, 5, 3, 6, 8, 5, 7, 10, 8, 6, 5, 4, 6, 8, 10, 12, 10, 8, 7, 6, 5, 4, 6, 7, 9, 11, 13, 14, 15]
        },
        segments: [41, 35, 24],
        scripts: [60, 80, 100, 90, 120, 150, 130, 110, 140, 160, 180, 170, 150, 140, 160, 180, 200, 190, 180, 170, 160, 150, 140, 160, 180, 200, 220, 210, 200, 190],
        tokens: [120, 240, 360, 300, 480, 600, 500, 400, 550, 650, 750, 700, 600, 550, 650, 750, 850, 800, 750, 700, 650, 600, 550, 650, 750, 850, 950, 900, 850, 800]
    }
};

const AdminDashboardView: React.FC = () => {
    const [stats, setStats] = useState<any>(MOCK_STATS);
    const [activeSection, setActiveSection] = useState('overview');
    const [days, setDays] = useState(30);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.warn('Backend not available, using mock data.');
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div style={{ padding: '24px', color: 'var(--av-cream-300)' }}>Loading Dashboard...</div>;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index' as const, intersect: false },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: GRAY, font: { size: 10 } } },
            y: { grid: { color: '#88878020' }, ticks: { color: GRAY, font: { size: 10 } } },
        },
    };

    const regData = {
        labels: stats.charts.labels,
        datasets: [
            { label: 'Filmmakers', data: stats.charts.registration_data.filmmakers, backgroundColor: TEAL, borderRadius: 3, stack: 's' },
            { label: 'Creators', data: stats.charts.registration_data.creators, backgroundColor: PURPLE, borderRadius: 3, stack: 's' },
            { label: 'Agencies', data: stats.charts.registration_data.agencies, backgroundColor: AMBER, borderRadius: 3, stack: 's' },
        ],
    };

    const segData = {
        labels: ['Filmmaker', 'Creator', 'Agency'],
        datasets: [{
            data: stats.charts.segments,
            backgroundColor: [TEAL, PURPLE, AMBER],
            borderWidth: 0,
            hoverOffset: 4,
        }],
    };

    const scriptsData = {
        labels: stats.charts.labels,
        datasets: [{
            label: 'Scripts',
            data: stats.charts.scripts,
            borderColor: AMBER,
            backgroundColor: AMBER + '20',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
        }],
    };

    const tokensData = {
        labels: stats.charts.labels,
        datasets: [{
            label: 'Tokens',
            data: stats.charts.tokens,
            borderColor: BLUE,
            backgroundColor: BLUE + '20',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
        }],
    };

    const revData = {
        labels: ['Free', 'Pro', 'Team'],
        datasets: [{
            data: [0, 4900, 2800],
            backgroundColor: [GRAY + '60', TEAL, PURPLE],
            borderRadius: 4,
        }],
    };

    return (
        <div className="shell" style={{ display: 'flex', minHeight: '100vh', background: 'var(--av-bg-base)', color: 'var(--av-cream-100)' }}>
            {/* Sidebar */}
            <div className="sidebar" style={{ width: '200px', flexShrink: 0, background: 'rgba(26, 24, 20, 0.4)', borderRight: '0.5px solid var(--av-neutral-800)', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
                <div className="logo" style={{ padding: '0 16px 20px', borderBottom: '0.5px solid var(--av-neutral-800)', marginBottom: '16px' }}>
                    <div className="logo-mark" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="logo-iris" style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#E8A510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 14 14" fill="none" style={{ width: '14px', height: '14px' }}>
                                <ellipse cx="7" cy="7" rx="2" ry="5" stroke="#0a0907" strokeWidth="1" transform="rotate(0 7 7)" />
                                <ellipse cx="7" cy="7" rx="2" ry="5" stroke="#0a0907" strokeWidth="1" transform="rotate(60 7 7)" />
                                <ellipse cx="7" cy="7" rx="2" ry="5" stroke="#0a0907" strokeWidth="1" transform="rotate(120 7 7)" />
                                <circle cx="7" cy="7" r="1.5" fill="#0a0907" />
                            </svg>
                        </div>
                        <div>
                            <div className="logo-text" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--av-cream-100)' }}>AnythingVisual</div>
                            <div className="logo-sub" style={{ fontSize: '10px', color: 'var(--av-cream-500)', marginTop: '2px', letterSpacing: '0.04em' }}>ADMIN CONSOLE</div>
                        </div>
                    </div>
                </div>

                <nav className="nav-section" style={{ padding: '0 8px', marginBottom: '8px' }}>
                    <div className="nav-label" style={{ fontSize: '10px', color: 'var(--av-cream-600)', letterSpacing: '0.06em', padding: '0 8px', marginBottom: '4px' }}>Overview</div>
                    <div className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 8px', borderRadius: '4px', fontSize: '13px', color: activeSection === 'overview' ? 'var(--av-cream-100)' : 'var(--av-cream-400)', cursor: 'pointer', background: activeSection === 'overview' ? 'rgba(232, 165, 16, 0.1)' : 'transparent' }}>Dashboard</div>
                    <div className={`nav-item ${activeSection === 'users' ? 'active' : ''}`} onClick={() => setActiveSection('users')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 8px', borderRadius: '4px', fontSize: '13px', color: activeSection === 'users' ? 'var(--av-cream-100)' : 'var(--av-cream-400)', cursor: 'pointer', background: activeSection === 'users' ? 'rgba(232, 165, 16, 0.1)' : 'transparent' }}>Users</div>
                </nav>

                <nav className="nav-section" style={{ padding: '0 8px', marginBottom: '8px' }}>
                    <div className="nav-label" style={{ fontSize: '10px', color: 'var(--av-cream-600)', letterSpacing: '0.06em', padding: '0 8px', marginBottom: '4px' }}>Platform</div>
                    <div className={`nav-item ${activeSection === 'content' ? 'active' : ''}`} onClick={() => setActiveSection('content')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 8px', borderRadius: '4px', fontSize: '13px', color: activeSection === 'content' ? 'var(--av-cream-100)' : 'var(--av-cream-400)', cursor: 'pointer', background: activeSection === 'content' ? 'rgba(232, 165, 16, 0.1)' : 'transparent' }}>Content</div>
                    <div className={`nav-item ${activeSection === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveSection('pipeline')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 8px', borderRadius: '4px', fontSize: '13px', color: activeSection === 'pipeline' ? 'var(--av-cream-100)' : 'var(--av-cream-400)', cursor: 'pointer', background: activeSection === 'pipeline' ? 'rgba(232, 165, 16, 0.1)' : 'transparent' }}>Pipeline</div>
                </nav>

                <nav className="nav-section" style={{ padding: '0 8px', marginBottom: '8px' }}>
                    <div className="nav-label" style={{ fontSize: '10px', color: 'var(--av-cream-600)', letterSpacing: '0.06em', padding: '0 8px', marginBottom: '4px' }}>Intelligence</div>
                    <div className={`nav-item ${activeSection === 'ai' ? 'active' : ''}`} onClick={() => setActiveSection('ai')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 8px', borderRadius: '4px', fontSize: '13px', color: activeSection === 'ai' ? 'var(--av-cream-100)' : 'var(--av-cream-400)', cursor: 'pointer', background: activeSection === 'ai' ? 'rgba(232, 165, 16, 0.1)' : 'transparent' }}>AI Consumption</div>
                    <div className={`nav-item ${activeSection === 'revenue' ? 'active' : ''}`} onClick={() => setActiveSection('revenue')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 8px', borderRadius: '4px', fontSize: '13px', color: activeSection === 'revenue' ? 'var(--av-cream-100)' : 'var(--av-cream-400)', cursor: 'pointer', background: activeSection === 'revenue' ? 'rgba(232, 165, 16, 0.1)' : 'transparent' }}>Revenue</div>
                </nav>

                <div style={{ flex: 1 }}></div>
                <div style={{ padding: '12px 16px', borderTop: '0.5px solid var(--av-neutral-800)', fontSize: '11px', color: 'var(--av-cream-600)' }}>Last sync: just now</div>
            </div>

            {/* Main Content */}
            <div className="main" style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
                <div className="top-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div className="page-title" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--av-cream-100)' }}>
                        {activeSection === 'overview' ? 'Dashboard overview' : activeSection === 'users' ? 'User registrations' : 'Platform Activity'}
                    </div>
                    <div className="top-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="date-badge" style={{ fontSize: '12px', color: 'var(--av-cream-300)', background: 'var(--av-neutral-900)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '4px', padding: '5px 10px' }}>
                            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <select className="range-select" value={days} onChange={(e) => setDays(Number(e.target.value))} style={{ fontSize: '12px', border: '0.5px solid var(--av-neutral-800)', borderRadius: '4px', padding: '5px 10px', background: 'var(--av-neutral-900)', color: 'var(--av-cream-100)', cursor: 'pointer' }}>
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                    </div>
                </div>

                {activeSection === 'overview' && (
                    <>
                        <div className="section-title" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--av-cream-400)', marginBottom: '12px', letterSpacing: '0.02em' }}>Key metrics</div>
                        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
                            {[
                                { label: 'Total users', value: stats.metrics.total_users, delta: '↑ 12%' },
                                { label: 'Scripts generated', value: stats.metrics.total_scripts, delta: '↑ 18%' },
                                { label: 'Keyframes created', value: stats.metrics.total_keyframes, delta: '↑ 31%' },
                                { label: 'API spend (USD)', value: `$${stats.metrics.api_spend}`, delta: '↓ 4%', dn: true },
                            ].map((m, i) => (
                                <div key={i} className="metric-card" style={{ background: 'var(--av-neutral-900)', borderRadius: '6px', padding: '14px 16px', border: '0.5px solid var(--av-neutral-800)' }}>
                                    <div className="metric-label" style={{ fontSize: '11px', color: 'var(--av-cream-500)', marginBottom: '6px' }}>{m.label}</div>
                                    <div className="metric-value" style={{ fontSize: '22px', fontWeight: 500, color: 'var(--av-cream-100)', lineHeight: '1' }}>{m.value}</div>
                                    <div className="metric-delta" style={{ fontSize: '11px', marginTop: '5px', color: m.dn ? '#EF4444' : '#10B981' }}>{m.delta} vs prev period</div>
                                </div>
                            ))}
                        </div>

                        <div className="charts-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '16px' }}>
                                <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                                    <div>
                                        <div className="chart-title" style={{ fontSize: '13px', fontWeight: 500 }}>User registrations</div>
                                        <div className="chart-sub" style={{ fontSize: '11px', color: 'var(--av-cream-600)' }}>New signups per day</div>
                                    </div>
                                    <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '20px', background: 'rgba(29, 158, 117, 0.1)', color: TEAL }}>Daily</span>
                                </div>
                                <div style={{ height: '200px' }}><Bar options={chartOptions} data={regData} /></div>
                            </div>
                            <div className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '16px' }}>
                                <div className="chart-header" style={{ marginBottom: '14px' }}>
                                    <div className="chart-title" style={{ fontSize: '13px', fontWeight: 500 }}>User segments</div>
                                    <div className="chart-sub" style={{ fontSize: '11px', color: 'var(--av-cream-600)' }}>Distribution</div>
                                </div>
                                <div style={{ height: '180px' }}><Doughnut options={{ ...chartOptions, cutout: '65%' }} data={segData} /></div>
                            </div>
                        </div>

                        <div className="charts-row-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                            {[
                                { title: 'Scripts per day', data: scriptsData, type: 'line', pill: 'Content', col: AMBER },
                                { title: 'API consumption', data: tokensData, type: 'line', pill: 'AI', col: BLUE },
                                { title: 'Revenue by plan', data: revData, type: 'bar', pill: 'MRR', col: CORAL },
                            ].map((c, i) => (
                                <div key={i} className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '16px' }}>
                                    <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                                        <div className="chart-title" style={{ fontSize: '13px', fontWeight: 500 }}>{c.title}</div>
                                        <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '20px', background: `${c.col}20`, color: c.col }}>{c.pill}</span>
                                    </div>
                                    <div style={{ height: '140px' }}>
                                        {c.type === 'line' ? <Line options={chartOptions} data={c.data} /> : <Bar options={chartOptions} data={c.data} />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="charts-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '16px' }}>
                                <div className="chart-title" style={{ fontSize: '13px', fontWeight: 500, marginBottom: '14px' }}>Recent registrations</div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', color: 'var(--av-cream-600)', borderBottom: '0.5px solid var(--av-neutral-800)' }}>
                                            <th style={{ padding: '8px' }}>User</th>
                                            <th style={{ padding: '8px' }}>Segment</th>
                                            <th style={{ padding: '8px' }}>Plan</th>
                                            <th style={{ padding: '8px' }}>Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recent_users.map((u: any, i: number) => (
                                            <tr key={i} style={{ borderBottom: '0.5px solid var(--av-neutral-800)' }}>
                                                <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--av-neutral-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{u.initials}</span>
                                                    {u.name}
                                                </td>
                                                <td style={{ padding: '8px' }}><span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(29, 158, 117, 0.1)', color: TEAL }}>{u.segment}</span></td>
                                                <td style={{ padding: '8px' }}>{u.plan}</td>
                                                <td style={{ padding: '8px', color: 'var(--av-cream-600)', fontSize: '11px' }}>{new Date(u.registered).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '16px' }}>
                                <div className="chart-title" style={{ fontSize: '13px', fontWeight: 500, marginBottom: '14px' }}>Platform Activity</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        { label: 'Script generated', sub: 'Filmmaker · 3 scenes', time: '4 mins ago', col: AMBER },
                                        { label: 'Keyframe created', sub: 'FLUX 1.1 · 3.4s', time: '11 mins ago', col: TEAL },
                                        { label: 'New user signup', sub: 'Creator segment', time: '1 hr ago', col: BLUE },
                                    ].map((a, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid var(--av-neutral-800)' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `${a.col}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.col, fontWeight: 600, fontSize: '10px' }}>{a.label[0]}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '12px', fontWeight: 500 }}>{a.label}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--av-cream-600)' }}>{a.sub}</div>
                                            </div>
                                            <div style={{ fontSize: '10px', color: 'var(--av-cream-600)' }}>{a.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeSection === 'users' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                            <div className="metric-card" style={{ background: 'var(--av-neutral-900)', borderRadius: '6px', padding: '14px 16px', border: '0.5px solid var(--av-neutral-800)' }}>
                                <div className="metric-label" style={{ fontSize: '11px', color: 'var(--av-cream-500)', marginBottom: '6px' }}>Total Registered Users</div>
                                <div className="metric-value" style={{ fontSize: '22px', fontWeight: 500, color: 'var(--av-cream-100)', lineHeight: '1' }}>{stats.metrics.total_users}</div>
                                <div className="metric-delta" style={{ fontSize: '11px', marginTop: '5px', color: '#10B981' }}>Platform Wide</div>
                            </div>
                        </div>

                        <div className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '24px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '24px' }}>User Management</h2>
                            <div style={{ height: '300px', marginBottom: '32px' }}><Bar options={{ ...chartOptions, maintainAspectRatio: false }} data={regData} /></div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--av-cream-600)', borderBottom: '1px solid var(--av-neutral-800)' }}>
                                        <th style={{ padding: '12px' }}>Name</th>
                                        <th style={{ padding: '12px' }}>Segment</th>
                                        <th style={{ padding: '12px' }}>Plan</th>
                                        <th style={{ padding: '12px' }}>Registered At</th>
                                        <th style={{ padding: '12px' }}>Last Active</th>
                                        <th style={{ padding: '12px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recent_users.map((u: any, i: number) => (
                                        <tr key={i} style={{ borderBottom: '0.5px solid var(--av-neutral-800)' }}>
                                            <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--av-neutral-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>{u.initials}</span>
                                                {u.name}
                                            </td>
                                            <td style={{ padding: '12px' }}>{u.segment}</td>
                                            <td style={{ padding: '12px' }}><span style={{ padding: '2px 8px', borderRadius: '100px', background: 'rgba(55, 138, 221, 0.1)', color: BLUE, fontSize: '11px' }}>{u.plan}</span></td>
                                            <td style={{ padding: '12px', color: 'var(--av-cream-600)' }}>{new Date(u.registered).toLocaleString()}</td>
                                            <td style={{ padding: '12px', color: 'var(--av-cream-600)' }}>{u.last_active}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ color: u.status === 'Active' ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.status === 'Active' ? '#10B981' : '#EF4444' }}></div>
                                                    {u.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'content' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        <div className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '24px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '24px' }}>Content Production Trends</h2>
                            <div style={{ height: '240px' }}><Line options={chartOptions} data={scriptsData} /></div>
                        </div>

                        <div className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '24px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '24px' }}>Full Activity Stream</h2>
                            {[
                                { label: 'Script generated', sub: 'Sci-fi Short · Filmmaker', time: '4 mins ago', col: AMBER },
                                { label: 'Keyframe batch', sub: 'FLUX 1.1 · 8 frames', time: '11 mins ago', col: TEAL },
                                { label: 'New user signup', sub: 'Creator segment · Pro', time: '1 hr ago', col: BLUE },
                                { label: 'Export downloaded', sub: 'PDF Storyboard · Team', time: '3 hrs ago', col: CORAL },
                                { label: 'Asset generated', sub: 'Environment Map · AI', time: '5 hrs ago', col: PURPLE },
                            ].map((a, i) => (
                                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px 0', borderBottom: '0.5px solid var(--av-neutral-800)' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${a.col}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.col, fontWeight: 600, fontSize: '14px' }}>{a.label[0]}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{a.label}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--av-cream-600)' }}>{a.sub}</div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--av-cream-600)' }}>{a.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'ai' && (
                    <div className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '24px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '24px' }}>AI Resource Consumption</h2>
                        <div style={{ height: '300px', marginBottom: '32px' }}><Line options={chartOptions} data={tokensData} /></div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {[
                                { label: 'LLM (GPT-4o)', usage: '64%', cost: '$542' },
                                { label: 'Image (FLUX)', usage: '28%', cost: '$238' },
                                { label: 'Other APIs', usage: '8%', cost: '$67' },
                            ].map((api, i) => (
                                <div key={i} style={{ padding: '16px', background: 'var(--av-neutral-900)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--av-cream-600)' }}>{api.label}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 500, margin: '4px 0' }}>{api.usage}</div>
                                    <div style={{ fontSize: '11px', color: BLUE }}>{api.cost} this period</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'revenue' && (
                    <div className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '24px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '24px' }}>Revenue Overview</h2>
                        <div style={{ height: '300px', marginBottom: '32px' }}><Bar options={chartOptions} data={revData} /></div>

                        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <div style={{ padding: '16px', background: 'var(--av-neutral-900)', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--av-cream-600)' }}>Total MRR</div>
                                <div style={{ fontSize: '20px', fontWeight: 500 }}>$7,700</div>
                            </div>
                            <div style={{ padding: '16px', background: 'var(--av-neutral-900)', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--av-cream-600)' }}>Active Subscriptions</div>
                                <div style={{ fontSize: '20px', fontWeight: 500 }}>142</div>
                            </div>
                            <div style={{ padding: '16px', background: 'var(--av-neutral-900)', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--av-cream-600)' }}>Churn Rate</div>
                                <div style={{ fontSize: '20px', fontWeight: 500 }}>1.8%</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'pipeline' && (
                    <div className="chart-card" style={{ background: 'rgba(26, 24, 20, 0.4)', border: '0.5px solid var(--av-neutral-800)', borderRadius: '8px', padding: '24px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '24px' }}>Pipeline Health</h2>
                        <p style={{ color: 'var(--av-cream-400)', marginBottom: '16px' }}>All AI pipeline workers are currently operational.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Structure Parser', 'Character Creator', 'Shot Intelligence', 'Visual Generator'].map((worker, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--av-neutral-900)', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '14px' }}>{worker}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                                        <span style={{ fontSize: '12px', color: '#10B981' }}>Online</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardView;

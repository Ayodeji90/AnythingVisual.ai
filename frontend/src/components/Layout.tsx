import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout-root" style={{ position: 'relative', minHeight: '100vh' }}>
            <div className="grain-overlay" />
            <div className="amber-glow" />
            {children}
        </div>
    );
};

export default Layout;

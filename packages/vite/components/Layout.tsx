import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import './Layout.css';

function WalletButton() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    if (isConnected && address) {
        return (
            <button className="wallet-btn connected" onClick={() => disconnect()}>
                <div className="wallet-avatar">B4</div>
                <div className="wallet-info">
                    <span className="wallet-label">VERIFIED ACCOUNT</span>
                    <span className="wallet-address">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                </div>
            </button>
        );
    }

    return (
        <button className="wallet-btn" onClick={() => connect({ connector: injected() })}>
            <div className="wallet-avatar disconnected" />
            <div className="wallet-info">
                <span className="wallet-label">CONNECT WALLET</span>
                <span className="wallet-address">Not Connected</span>
            </div>
        </button>
    );
}

export function Layout() {
    return (
        <div className="app-container">
            <nav className="top-nav">
                <div className="nav-content">
                    <div className="nav-brand">
                        <span className="logo-badge">ZK</span>
                        <strong>VVM</strong>
                    </div>

                    <div className="nav-links">
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
                        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Dashboard</NavLink>
                        <NavLink to="/withdraw" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Withdraw</NavLink>
                    </div>

                    <div className="nav-actions">
                        <WalletButton />
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

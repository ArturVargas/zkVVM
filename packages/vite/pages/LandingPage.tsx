import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-container page-container">
            <div className="hero-section flex-center">
                <div className="announcement-pill">
                    Announcing our ZK-Compliant Payment Protocol. <a href="#" className="accent-text">Read more &rarr;</a>
                </div>

                <h1 className="hero-title">
                    <span className="text-gradient">Zero-Knowledge</span><br />
                    Virtual Machine
                </h1>

                <p className="hero-subtitle">
                    A stateless, privacy-focused virtual machine running within a smart contract<br />
                    "executor." Lock ETH into commitments and transfer them securely via off-chain<br />
                    zkVVM Notes.
                </p>

                <div className="hero-actions">
                    <button className="btn-primary btn-large" onClick={() => navigate('/dashboard')}>
                        Launch App &rarr;
                    </button>
                    <a href="#" className="btn-link">Read Mission &rarr;</a>
                </div>
            </div>

            <div className="features-grid">
                <div className="glass-panel feature-card">
                    <div className="feature-icon bg-green">&#128274;</div>
                    <h3>The Mint (Deposit)</h3>
                    <p>Lock capital securely on-chain. Generate locally-stored bearer notes.</p>
                </div>
                <div className="glass-panel feature-card">
                    <div className="feature-icon bg-cyan">&#9889;</div>
                    <h3>The Note (Handoff)</h3>
                    <p>Transfer value locally without revealing on-chain trails.</p>
                </div>
                <div className="glass-panel feature-card">
                    <div className="feature-icon bg-emerald">&#128271;</div>
                    <h3>The Spend (Withdraw)</h3>
                    <p>Redeem notes privately through ZK proof verification.</p>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useChemicals } from '../hooks/useChemicals';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

function UserProfile() {
    const { user, signOutUser } = useAuth();
    const navigate = useNavigate();
    const { chemicals } = useChemicals();
    const { recentlyViewed = [] } = useRecentlyViewed();

    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        customName: '',
        bio: ''
    });

    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`userProfile_${user.uid}`);
            if (saved) {
                setProfileData(JSON.parse(saved));
            }
        }
    }, [user]);

    const getLogbookCount = () => {
        try {
            const entries = JSON.parse(localStorage.getItem('chemicalLogbook') || '[]');
            return entries.length;
        } catch {
            return 0;
        }
    };

    const getRecentLogbookEntries = () => {
        try {
            const entries = JSON.parse(localStorage.getItem('chemicalLogbook') || '[]');
            return entries.slice(0, 3);
        } catch {
            return [];
        }
    };

    const handleSignOut = async () => {
        try {
            await signOutUser();
            navigate('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const handleSaveProfile = () => {
        if (user) {
            localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profileData));
            setIsEditing(false);
        }
    };

    if (!user) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Please sign in to view your profile.</h2>
            </div>
        );
    }

    const displayName = profileData.customName || user.displayName || "User";
    const logbookCount = getLogbookCount();
    const recentLogbook = getRecentLogbookEntries();

    return (
        <div className="user-profile-page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Left Column - Profile Card */}
                <div style={{ maxWidth: '400px', width: '100%' }}>
                    <div style={{
                        backgroundColor: 'var(--surface)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-light)',
                        padding: '2rem',
                        textAlign: 'center',
                        position: 'sticky',
                        top: '90px'
                    }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={displayName}
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '4px solid var(--primary-light)'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary)',
                                    color: '#fff',
                                    fontSize: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    border: '4px solid var(--primary-light)'
                                }}>
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Display Name"
                                    value={profileData.customName}
                                    onChange={(e) => setProfileData({ ...profileData, customName: e.target.value })}
                                />
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Bio (optional)"
                                    rows="3"
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                    <button onClick={handleSaveProfile} className="btn btn-primary btn-sm">Save</button>
                                    <button onClick={() => setIsEditing(false)} className="btn btn-outline-secondary btn-sm">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{displayName}</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{user.email}</p>
                                {profileData.bio && (
                                    <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                                        {profileData.bio}
                                    </p>
                                )}
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-outline-primary btn-sm mb-3"
                                    style={{ width: '100%' }}
                                >
                                    Edit Profile
                                </button>
                            </>
                        )}

                        <button
                            onClick={handleSignOut}
                            className="btn btn-outline-danger btn-sm"
                            style={{ width: '100%' }}
                        >
                            Sign Out
                        </button>

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Last Sign In:</span>
                                <span>{new Date(user.metadata.lastSignInTime).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Member Since:</span>
                                <span>{new Date(user.metadata.creationTime).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Stats & Activity */}
                <div style={{ flex: 1 }}>
                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{chemicals.length}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Total Chemicals</div>
                        </div>
                        <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{recentlyViewed.length}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Recently Viewed</div>
                        </div>
                        <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{logbookCount}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Logbook Entries</div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={() => navigate('/add-chemical')} className="btn btn-primary">
                                ➕ Add Chemical
                            </button>
                            <button onClick={() => navigate('/chemicals')} className="btn btn-outline-primary">
                                📋 Browse Chemicals
                            </button>
                            <button onClick={() => navigate('/logbook')} className="btn btn-outline-primary">
                                📝 New Logbook Entry
                            </button>
                        </div>
                    </div>

                    {/* Recently Viewed */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Recently Viewed Chemicals</h3>
                        <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                            {recentlyViewed && recentlyViewed.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {recentlyViewed.slice(0, 5).map((chem, idx) => (
                                        <Link
                                            key={idx}
                                            to={`/chemicals/${encodeURIComponent(chem.CAS || chem.id)}`}
                                            style={{
                                                padding: '1rem 1.5rem',
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                borderBottom: idx < recentlyViewed.length - 1 ? '1px solid var(--border-light)' : 'none',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'background-color var(--transition-fast)'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <span style={{ fontWeight: 500 }}>{chem["Chemical Name"] || chem.title}</span>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{chem.CAS}</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No recently viewed chemicals</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Logbook */}
                    {recentLogbook.length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Logbook Entries</h3>
                            <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                                {recentLogbook.map((entry, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '1rem 1.5rem',
                                            borderBottom: idx < recentLogbook.length - 1 ? '1px solid var(--border-light)' : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 500 }}>{entry.chemical}</span>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{new Date(entry.date).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{entry.quantity}</span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: 'var(--radius-full)',
                                                backgroundColor: entry.action === 'added' ? 'var(--success-light)' :
                                                    entry.action === 'disposed' ? 'var(--error-light)' : 'var(--warning-light)',
                                                color: entry.action === 'added' ? 'var(--success-dark)' :
                                                    entry.action === 'disposed' ? 'var(--error-dark)' : 'var(--warning-dark)',
                                                textTransform: 'capitalize'
                                            }}>
                                                {entry.action}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;

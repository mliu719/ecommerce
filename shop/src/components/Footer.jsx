export default function Footer() {
    return (
        <footer style={{
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #dee2e6',
            padding: '20px 0',
            marginTop: '40px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
            }}>
                {/* LEFT */}
                <div style={{
                    color: '#6c757d',
                    fontSize: '12px'
                }}>
                    © {new Date().getFullYear()} Shop. All rights reserved.
                </div>
                {/* CENTER */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    fontSize: '14px'
                }}>
                    <a href="#" style={linkStyle}>Shop</a>
                    <a href="#" style={linkStyle}>About</a>
                    <a href="#" style={linkStyle}>Careers</a>
                </div>

                {/* RIGHT */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap'
                }}>
                    <a href="#" style={linkStyle}>About Us</a>
                    <a href="#" style={linkStyle}>Contact</a>
                    <a href="#" style={linkStyle}>Privacy Policy</a>
                    <a href="#" style={linkStyle}>Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}

const linkStyle = {
    textDecoration: 'none',
    color: '#6c757d',
    fontSize: '14px'
};

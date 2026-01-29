import "./Footer.css";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer__inner">
                <div className="site-footer__muted">
                    © {new Date().getFullYear()} Shop. All rights reserved.
                </div>
                <div className="site-footer__links">

                    <a href="#" className="site-footer__link">Privacy Policy</a>
                    <a href="#" className="site-footer__link">Terms of Service</a>

                </div>

                <div className="site-footer__links">
                    <a href="#" className="site-footer__link">About Us</a>
                    <a href="#" className="site-footer__link">Contact</a>
                    <a href="#" className="site-footer__link">Careers</a>
                </div>
            </div>
        </footer>
    );
}

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <p>&copy; {currentYear} | Made by Andrew Kim</p>
        </footer>
    );
}

export default Footer;

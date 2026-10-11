
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import Button from "../components/common/Button";

export default function NotFound() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/", { replace: true });
        }
    };

    return (
        <main className="not-found-page">
            <div className="not-found-illustration">
                <SearchX size={64} strokeWidth={1.4} aria-hidden="true" />
            </div>

            <p className="not-found-code">ERROR 404</p>

            <h1 className="not-found-title">Page not found</h1>

            <p className="not-found-description">
                Sorry, we couldn't find the page you're looking for.
                It may have been moved or the URL may be incorrect.
            </p>

            <div className="not-found-actions">
                <Button variant="secondary" onClick={handleGoBack}>
                    <ArrowLeft size={17} aria-hidden="true" />
                    Go back
                </Button>

                <Link to="/" className="btn btn-primary">
                    <Home size={17} aria-hidden="true" />
                    Back to dashboard
                </Link>
            </div>
        </main>
    );
}

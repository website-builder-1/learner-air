
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="text-4xl font-display font-medium mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          We couldn't find the page you're looking for
        </p>
        <Button asChild className="bg-learner-500 hover:bg-learner-600">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

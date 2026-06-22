import { Component, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold" style={{ color: "#fff" }}>Something went wrong</h1>
          <p className="text-sm max-w-md" style={{ color: "#9ca3af" }}>
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #5b21b6, #7c3aed)" }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

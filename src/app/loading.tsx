import { Logo } from "@/components/shared/Logo"

function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
            </div>

            {/* Main content */}
            <div className="relative flex flex-col items-center gap-8">
                {/* Logo with animation */}
                <div className="animate-bounce-slow">
                    <Logo iconSize={80} textSize="text-3xl" className="drop-shadow-2xl" />
                </div>

                {/* Loading indicator */}
                <div className="flex items-center gap-3">
                    {/* Animated dots */}
                    <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce-dot animation-delay-0"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce-dot animation-delay-200"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce-dot animation-delay-400"></span>
                    </div>
                </div>

                {/* Loading text with fade animation */}
                <p className="text-sm text-muted-foreground animate-pulse">
                    Loading amazing content...
                </p>

                {/* Progress bar */}
                <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full animate-shimmer"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading
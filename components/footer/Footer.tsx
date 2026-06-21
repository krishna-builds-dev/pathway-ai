import Link from 'next/link';
import { PathwayLogo } from '../icon/Icons';

export default function Footer() {
    return (
        <footer className="bg-surface-container-highest border-t border-outline-variant">
            <div className="flex flex-col md:flex-row justify-between items-center px-margin py-8 md:py-stack-lg gap-4 md:gap-stack-md max-w-container-max mx-auto">
                {/* Logo & Copyright */}
                <div className="flex flex-col gap-2 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <PathwayLogo className="w-8 h-8" />
                        <div className="text-xl lg:text-h2-dashboard font-bold text-primary">Pathway AI</div>
                    </div>
                    <p className="text-xs lg:text-body-md text-on-surface-variant max-w-xs">
                        © {new Date().getFullYear()} Pathway AI
                    </p>
                </div>

                {/* Legal Links */}
                <div className="flex flex-wrap justify-center gap-4 lg:gap-stack-md">
                    <Link
                        className="text-xs lg:text-label-caps text-on-surface-variant hover:text-primary transition-colors"
                        href="/privacy-policy"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        className="text-xs lg:text-label-caps text-on-surface-variant hover:text-primary transition-colors"
                        href="/terms-of-service"
                    >
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
}
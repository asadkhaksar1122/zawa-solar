"use client";

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

// Simple heuristic VPN/proxy detection using org/ISP string from ipapi.co
export default function VpnWarning() {
    const { settings } = useSettings();
    const isVpnProtected = true;

    const [open, setOpen] = useState(false);
    const [checking, setChecking] = useState(false);
    const [info, setInfo] = useState<{ ip?: string; org?: string } | null>(null);

    const detectVpn = async () => {
        try {
            setChecking(true);
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            const ip = data.ip as string | undefined;
            const org = (data.org || data.org_name || '') as string;

            setInfo({ ip, org });

            const lowerOrg = (org || '').toLowerCase();
            // keywords commonly present in VPN/proxy AS names
            const vpnKeywords = ['vpn', 'proxy', 'virtual', 'private network', 'vps', 'tunneling', 'hosting', 'cloudflare', 'aws', 'amazon', 'google', 'digitalocean', 'linode', 'ovh', 'hetzner'];

            const suspected = vpnKeywords.some(k => lowerOrg.includes(k));

            setChecking(false);

            if (isVpnProtected && suspected) {
                setOpen(true);
            }
        } catch (e) {
            setChecking(false);
            setInfo(null);
        }
    };

    useEffect(() => {
        if (!isVpnProtected) return;
        detectVpn();
        // run once on mount when vpn protection enabled
    }, [isVpnProtected]);

    if (!isVpnProtected) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">VPN / Proxy Detected</DialogTitle>
                    <DialogDescription>
                        We detected that you may be connected through a VPN or proxy. Please disable your VPN and click Refresh.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {checking ? 'Checking connection...' : `Public IP: ${info?.ip ?? 'unknown'} — ISP/Org: ${info?.org ?? 'unknown'}`}
                        </AlertDescription>
                    </Alert>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                    <Button onClick={async () => { await detectVpn(); setOpen(true); }}>Refresh</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

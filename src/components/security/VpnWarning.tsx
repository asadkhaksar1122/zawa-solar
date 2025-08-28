"use client";

import { useCallback, useEffect, useState } from 'react';
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

type IpInfo = { ip?: string; org?: string; asn?: string };

export default function VpnWarning() {
    const { settings } = useSettings();
    // Use your app setting if you have one; otherwise default to true
    const isVpnProtected = true;

    const [open, setOpen] = useState(false);
    const [checking, setChecking] = useState(false);
    const [info, setInfo] = useState<IpInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    const detectVpn = useCallback(async (): Promise<boolean> => {
        setChecking(true);
        setError(null);

        try {
            let data: any = null;
            let fetchError: Error | null = null;

            // Try primary API
            try {
                const res = await fetch('https://ipapi.co/json/', {
                    cache: 'no-store',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (res.ok) {
                    data = await res.json();
                } else {
                    throw new Error(`API responded with ${res.status}`);
                }
            } catch (e) {
                console.warn('Primary API failed, trying fallback:', e);
                fetchError = e as Error;
            }

            // Fallback to alternative API if primary fails
            if (!data) {
                try {
                    const fallbackRes = await fetch('https://api.ipify.org?format=json');
                    const ipData = await fallbackRes.json();

                    // Get detailed info using the IP
                    const detailRes = await fetch(`https://ipwho.is/${ipData.ip}`);
                    const detailData = await detailRes.json();

                    data = {
                        ip: detailData.ip,
                        org: detailData.connection?.org || detailData.connection?.isp || '',
                        asn: detailData.connection?.asn || '',
                        country: detailData.country,
                        city: detailData.city
                    };
                } catch (e) {
                    console.warn('Fallback API also failed:', e);

                    // Last resort: try ipinfo.io
                    try {
                        const lastRes = await fetch('https://ipinfo.io/json');
                        const lastData = await lastRes.json();
                        data = {
                            ip: lastData.ip,
                            org: lastData.org || '',
                            asn: lastData.asn || '',
                            country: lastData.country,
                            city: lastData.city
                        };
                    } catch (finalError) {
                        console.error('All API attempts failed:', finalError);
                        throw fetchError || finalError;
                    }
                }
            }

            const ip = data.ip as string | undefined;
            const org = (data.org || data.org_name || data.asn_org || '') as string;
            const asn = (data.asn || data.asn_number || '') as string;

            setInfo({ ip, org, asn });

            const lowerOrg = String(org || '').toLowerCase();
            const lowerAsn = String(asn || '').toLowerCase();

            // Expanded list of VPN/hosting keywords
            const vpnKeywords = [
                'vpn', 'proxy', 'tunnel', 'tunneling',
                'vps', 'virtual private', 'datacenter', 'data center',
                'hosting', 'colocation', 'colo', 'server',
                'cloudflare', 'warp', 'digitalocean', 'linode', 'ovh', 'hetzner',
                'vultr', 'contabo', 'leaseweb', 'worldstream',
                'amazon', 'aws', 'azure', 'google cloud', 'gcp',
                'alibaba', 'oracle cloud', 'ibm cloud',
                'scaleway', 'upcloud', 'kamatera', 'ionos',
                'rackspace', 'liquidweb', 'hostinger',
                'b.v.', 'gmbh', 'llc', 'inc.', 'ltd', 'limited',
                'as49981', // WorldStream's ASN
            ];

            // Check both org name and ASN
            const suspected = vpnKeywords.some(k =>
                lowerOrg.includes(k) || lowerAsn.includes(k)
            );

            // Log for debugging
            console.log('VPN Detection:', {
                ip,
                org,
                asn,
                lowerOrg,
                suspected,
                isVpnProtected
            });

            // Only update modal state if VPN protection is enabled
            if (isVpnProtected) {
                setOpen(suspected);
            }

            return suspected;
        } catch (e) {
            console.error('VPN detection error:', e);

            const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';

            // Check if it's a network error
            if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                setError('Unable to verify your connection. Please try again.');
            }

            setInfo(null);

            // Don't close modal on error - assume VPN might be blocking the check
            if (isVpnProtected) {
                setOpen(true); // Keep modal open on error
            }

            return true; // Assume VPN on error
        } finally {
            setChecking(false);
        }
    }, [isVpnProtected]);

    // Check on initial mount with retry logic
    useEffect(() => {
        if (!isVpnProtected) {
            setOpen(false);
            return;
        }

        // Initial check with retry
        const checkWithRetry = async (retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    await detectVpn();
                    break; // Success, exit loop
                } catch (e) {
                    console.log(`Attempt ${i + 1} failed, retrying...`);
                    if (i === retries - 1) {
                        // Final attempt failed
                        setError('Unable to verify connection after multiple attempts.');
                        setOpen(true); // Show modal on persistent failure
                    } else {
                        // Wait before retry
                        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                    }
                }
            }
        };

        checkWithRetry();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVpnProtected]);

    // Handle refresh button click
    const handleRefresh = async () => {
        await detectVpn();
    };

    if (!isVpnProtected) return null;

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                // Prevent closing the modal by any means other than successful VPN disconnect
                if (!newOpen && open) {
                    return; // Prevent closing
                }
                setOpen(newOpen);
            }}
        >
            <DialogContent
                className="sm:max-w-md"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        {error ? 'Connection Check Failed' : 'VPN / Proxy Detected'}
                    </DialogTitle>
                    <DialogDescription>
                        {checking
                            ? 'Checking your connection...'
                            : error
                                ? 'We could not verify your connection. This might be due to network issues or VPN blocking.'
                                : 'We detected that you may be connected through a VPN or proxy. Please disable your VPN and click Refresh to continue.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {checking
                                ? 'Verifying connection...'
                                : error
                                    ? error
                                    : (
                                        <div className="space-y-1">
                                            <div><strong>IP Address:</strong> {info?.ip ?? 'unknown'}</div>
                                            <div><strong>ISP/Organization:</strong> {info?.org ?? 'unknown'}</div>
                                            {info?.asn && (
                                                <div><strong>ASN:</strong> {info.asn}</div>
                                            )}
                                        </div>
                                    )}
                        </AlertDescription>
                    </Alert>

                    <div className="text-sm text-muted-foreground">
                        <p className="font-semibold mb-1">To continue:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Disconnect your VPN or proxy</li>
                            <li>Click the Refresh button below</li>
                            <li>Wait for the connection check to complete</li>
                        </ol>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        onClick={handleRefresh}
                        disabled={checking}
                        className="w-full"
                    >
                        {checking ? 'Checking Connection...' : 'Refresh'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
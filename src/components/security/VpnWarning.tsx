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

            // Try primary API with VPN detection
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
                        city: detailData.city,
                        // ipwho.is provides security info
                        security: detailData.security
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

            // Check if API already detected VPN (ipwho.is provides this)
            if (data.security?.vpn === true || data.security?.proxy === true) {
                console.log('VPN detected by API security check');
                if (isVpnProtected) {
                    setOpen(true);
                }
                return true;
            }

            // Known legitimate ISP patterns to exclude
            const legitimateISPPatterns = [
                'comcast', 'verizon', 'at&t', 'att-', 'spectrum', 'charter',
                'cox ', 'cox-', 'time warner', 'centurylink', 'frontier',
                'windstream', 'mediacom', 'optimum', 'suddenlink',
                'virgin media', 'bt group', 'sky broadband', 'talktalk',
                'vodafone', 'orange', 'telefonica', 'deutsche telekom',
                'rogers', 'bell canada', 'telus', 'shaw',
                'telstra', 'optus', 'tpg telecom',
                'airtel', 'jio', 'bsnl', 'mtnl',
                'china telecom', 'china unicom', 'china mobile',
                'ntt', 'kddi', 'softbank',
                'kt corporation', 'sk broadband', 'lg u+',
                'singtel', 'starhub', 'm1',
                'pldt', 'globe telecom',
                'residential', 'broadband', 'cable', 'dsl', 'fiber',
                'fios', 'xfinity', 'u-verse'
            ];

            // Check if it's a known legitimate ISP
            const isLegitimateISP = legitimateISPPatterns.some(pattern =>
                lowerOrg.includes(pattern)
            );

            if (isLegitimateISP) {
                console.log('Legitimate ISP detected:', org);
                setOpen(false);
                return false;
            }

            // Specific VPN/Hosting provider keywords (more targeted)
            const definiteVpnKeywords = [
                // VPN Services
                'nordvpn', 'expressvpn', 'surfshark', 'cyberghost',
                'private internet access', 'pia-', 'ipvanish', 'vyprvpn',
                'protonvpn', 'mullvad', 'windscribe', 'tunnelbear',
                'hotspot shield', 'hide.me', 'purevpn', 'zenmate',
                'vpn service', 'vpn provider', 'virtual private network',

                // Proxy Services
                'proxy service', 'proxy provider', 'socks5', 'shadowsocks',
                'tor exit', 'anonymizer', 'hide my',

                // Cloud/Hosting Providers (definitive)
                'amazon web services', 'amazon technologies', 'aws-',
                'microsoft azure', 'azure-', 'google cloud', 'gcp-',
                'digitalocean', 'linode', 'vultr', 'ovhcloud', 'ovh sas',
                'hetzner online', 'contabo', 'scaleway', 'upcloud',
                'alibaba cloud', 'oracle cloud', 'ibm cloud',
                'cloudflare warp', 'cloudflare, inc',

                // Datacenter indicators
                'datacenter', 'data center', 'data-center',
                'colocation', 'dedicated server', 'virtual server',
                'vps provider', 'hosting provider', 'cloud hosting',
                'server hosting', 'web hosting'
            ];

            // Check for multiple indicators (more reliable)
            const vpnIndicators = [
                // Strong indicators
                definiteVpnKeywords.some(k => lowerOrg.includes(k)),
                lowerOrg.includes('vpn') && !lowerOrg.includes('mvpn'), // Exclude MVPN (managed VPN for enterprises)
                lowerOrg.includes('proxy'),
                lowerOrg.includes('tunnel') && !lowerOrg.includes('split'), // Exclude split tunneling references

                // Medium indicators (need combination)
                lowerOrg.includes('hosting'),
                lowerOrg.includes('server') && !lowerOrg.includes('server room'),
                lowerOrg.includes('cloud'),
                lowerOrg.includes('vps'),

                // Weak indicators (only count if combined with others)
                lowerOrg.includes('technologies') && lowerOrg.includes('inc'),
                lowerOrg.includes('services') && lowerOrg.includes('llc'),
            ];

            // Count strong indicators (first 4) and medium/weak indicators
            const strongIndicatorCount = vpnIndicators.slice(0, 4).filter(Boolean).length;
            const mediumIndicatorCount = vpnIndicators.slice(4, 8).filter(Boolean).length;
            const weakIndicatorCount = vpnIndicators.slice(8).filter(Boolean).length;

            // Determine if VPN based on indicator combination
            const suspected =
                strongIndicatorCount >= 1 || // Any strong indicator
                mediumIndicatorCount >= 2 || // Multiple medium indicators
                (mediumIndicatorCount >= 1 && weakIndicatorCount >= 1); // Combination

            // Special ASN checks for known VPN/hosting ASNs
            const knownVpnAsns = [
                'as13335', // Cloudflare
                'as16509', // Amazon
                'as15169', // Google
                'as8075',  // Microsoft
                'as14061', // DigitalOcean
                'as63949', // Linode
                'as20473', // Vultr
                'as16276', // OVH
                'as24940', // Hetzner
                'as51167', // Contabo
            ];

            const isKnownVpnAsn = knownVpnAsns.some(vpnAsn =>
                lowerAsn.includes(vpnAsn)
            );

            const finalSuspected = suspected || isKnownVpnAsn;

            // Log for debugging
            console.log('VPN Detection:', {
                ip,
                org,
                asn,
                isLegitimateISP,
                strongIndicatorCount,
                mediumIndicatorCount,
                isKnownVpnAsn,
                suspected: finalSuspected
            });

            // Only update modal state if VPN protection is enabled
            if (isVpnProtected) {
                setOpen(finalSuspected);
            }

            return finalSuspected;
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

            // Don't show modal on error for regular connections
            // Only show if we have reason to believe it's a VPN blocking the check
            if (isVpnProtected && errorMessage.includes('blocked')) {
                setOpen(true);
            } else {
                setOpen(false); // Don't show modal on general errors
            }

            return false; // Don't assume VPN on error
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
        const checkWithRetry = async (retries = 2) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const isVpn = await detectVpn();
                    if (!isVpn) {
                        // Not a VPN, no need to retry
                        break;
                    }
                    break; // Success, exit loop
                } catch (e) {
                    console.log(`Attempt ${i + 1} failed, retrying...`);
                    if (i === retries - 1) {
                        // Final attempt failed - don't show modal
                        setError('Unable to verify connection after multiple attempts.');
                        setOpen(false); // Don't show modal on persistent failure
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
                                ? 'We could not verify your connection. This might be due to network issues.'
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
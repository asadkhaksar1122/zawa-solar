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

type IpInfo = { ip?: string; org?: string; asn?: string; country?: string };

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
            let vpnDetected = false;
            let ipData: any = null;

            // Method 1: Try VPN detection API (most reliable)
            try {
                const vpnCheckRes = await fetch('https://vpnapi.io/api/?key=demo', {
                    cache: 'no-store',
                });

                if (vpnCheckRes.ok) {
                    const vpnData = await vpnCheckRes.json();
                    console.log('VPN API Check:', vpnData);

                    // Check VPN/Proxy/Tor detection
                    if (vpnData.security) {
                        vpnDetected = vpnData.security.vpn ||
                            vpnData.security.proxy ||
                            vpnData.security.tor ||
                            vpnData.security.relay;

                        ipData = {
                            ip: vpnData.ip,
                            org: vpnData.network?.autonomous_system_organization || '',
                            asn: vpnData.network?.autonomous_system_number || '',
                            country: vpnData.location?.country || ''
                        };

                        if (vpnDetected) {
                            console.log('VPN detected by vpnapi.io');
                            setInfo(ipData);
                            setOpen(isVpnProtected);
                            return true;
                        }
                    }
                }
            } catch (e) {
                console.warn('VPN API check failed:', e);
            }

            // Method 2: Check with ipwho.is (has security info)
            try {
                const ipWhoRes = await fetch('https://ipwho.is/', {
                    cache: 'no-store',
                });

                if (ipWhoRes.ok) {
                    const ipWhoData = await ipWhoRes.json();
                    console.log('IPWho Check:', ipWhoData);

                    // Check security flags
                    if (ipWhoData.security) {
                        vpnDetected = ipWhoData.security.vpn || ipWhoData.security.proxy;

                        if (!ipData) {
                            ipData = {
                                ip: ipWhoData.ip,
                                org: ipWhoData.connection?.org || ipWhoData.connection?.isp || '',
                                asn: ipWhoData.connection?.asn || '',
                                country: ipWhoData.country || ''
                            };
                        }

                        if (vpnDetected) {
                            console.log('VPN detected by ipwho.is security check');
                            setInfo(ipData);
                            setOpen(isVpnProtected);
                            return true;
                        }
                    }
                }
            } catch (e) {
                console.warn('IPWho check failed:', e);
            }

            // Method 3: Get IP info from multiple sources and analyze
            if (!ipData) {
                try {
                    const res = await fetch('https://ipapi.co/json/', {
                        cache: 'no-store',
                        mode: 'cors',
                        headers: {
                            'Accept': 'application/json',
                        }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        ipData = {
                            ip: data.ip,
                            org: data.org || '',
                            asn: data.asn || '',
                            country: data.country_name || ''
                        };
                        console.log('IPAPI data:', data);
                    }
                } catch (e) {
                    console.warn('IPAPI failed:', e);
                }
            }

            // Fallback: ipinfo.io
            if (!ipData) {
                try {
                    const res = await fetch('https://ipinfo.io/json');
                    const data = await res.json();
                    ipData = {
                        ip: data.ip,
                        org: data.org || '',
                        asn: data.asn || '',
                        country: data.country || ''
                    };
                    console.log('IPInfo data:', data);
                } catch (e) {
                    console.warn('IPInfo failed:', e);
                }
            }

            // If we still don't have data, error out
            if (!ipData) {
                throw new Error('Unable to fetch IP information');
            }

            setInfo(ipData);

            const org = String(ipData.org || '').toLowerCase();
            const asn = String(ipData.asn || '').toLowerCase();

            // Method 4: Pattern matching on organization/ASN

            // Known VPN providers (comprehensive list)
            const knownVpnProviders = [
                // Popular VPN Services
                'nordvpn', 'nord vpn', 'tefincom',
                'expressvpn', 'express vpn', 'express technologies',
                'surfshark', 'surf shark',
                'cyberghost', 'cyber ghost',
                'private internet', 'pia-', 'london trust media',
                'ipvanish', 'ip vanish', 'mudhook', 'stackpath',
                'vyprvpn', 'vypr vpn', 'golden frog',
                'protonvpn', 'proton vpn', 'proton technologies',
                'mullvad', 'windscribe', 'tunnelbear', 'tunnel bear',
                'hotspot shield', 'anchor free', 'pango', 'aura',
                'hide.me', 'hideme', 'evpn',
                'purevpn', 'pure vpn', 'gaditek',
                'zenmate', 'zen mate',
                'ivacy', 'privatevpn', 'private vpn',
                'atlas vpn', 'atlasvpn',
                'cryptostorm', 'crypto storm',
                'perfect privacy', 'airvpn', 'air vpn',
                'trust.zone', 'trustzone',
                'vpn unlimited', 'keepsolid',
                'ghostpath', 'torguard', 'tor guard',
                'safervpn', 'safer vpn',
                'strongvpn', 'strong vpn', 'strong technology',
                'liquidvpn', 'liquid vpn',
                'vpn.ac', 'vpnac', 'netsec',
                'ironsocket', 'iron socket',
                'blackvpn', 'black vpn',
                'earthvpn', 'earth vpn',
                'celo vpn', 'celovpn',
                'freedom vpn', 'freedomvpn',
                'opera vpn', 'operavpn',
                'betternet', 'better net',
                'speedify', 'connectify',
                'keenow', 'keen ow',
                'seed4.me', 'seed4me',
                'myprivate', 'my private',
                'zoog', 'zoogvpn',
                'astrill', 'rusvpn', 'rus vpn',
                'fastestvpn', 'fastest vpn',
                'ultra vpn', 'ultravpn',
                'touch vpn', 'touchvpn',
                'browsec', 'kalium network',

                // VPN related terms
                'vpn service', 'vpn provider', 'virtual private',
                'secure connection', 'encrypted tunnel',
                'anonymizer', 'anonymous proxy',
                'socks5', 'shadowsocks', 'v2ray', 'wireguard',
                'openvpn', 'open vpn', 'softether',

                // Known hosting providers used by VPNs
                'm247', 'datacamp', 'leaseweb', 'creanova',
                'global layer', 'globallayer',
                'quadranet', 'psychz', 'choopa', 'vultr',
                'kamatera', 'hostkey', 'hosthatch',
                'packet exchange', 'packetexchange',
                'serverius', 'worldstream', 'world stream',
                'privatelayer', 'private layer',
                'libertyvps', 'liberty vps',
                'xtom', 'xhost', 'hosthatch',
                'nocix', 'datacenter luxembourg',
                'tzulo', 'feral hosting', 'feralhosting',
                'buyvm', 'frantech',
            ];

            // Cloud/Hosting providers (definitive)
            const hostingProviders = [
                // Major cloud providers
                'amazon', 'aws', 'ec2', 'amazon web services', 'amazon technologies',
                'microsoft azure', 'azure', 'microsoft corporation',
                'google cloud', 'google llc', 'gcp',
                'digitalocean', 'digital ocean', 'do-',
                'linode', 'akamai',
                'vultr holdings', 'vultr.com', 'choopa, llc', 'choopa.com',
                'ovh', 'ovhcloud', 'ovh sas', 'ovh hosting',
                'hetzner', 'hetzner online',
                'contabo', 'contabo gmbh',
                'scaleway', 'online sas', 'online.net',
                'upcloud', 'upcloud ltd',
                'alibaba', 'aliyun', 'alibaba cloud',
                'oracle cloud', 'oracle corporation',
                'ibm cloud', 'softlayer',
                'cloudflare', 'cloudflare warp',
                'ramnode', 'ram node',
                'bandwagon', 'bandwagonhost',
                'nexeon', 'nexeon technologies',
                'virmach', 'virtual machine',
                'racknerd', 'rack nerd',
                'ionos', '1&1', '1and1',
                'godaddy', 'go daddy',
                'namecheap', 'name cheap',
                'hostinger', 'hosting services',

                // Datacenter indicators
                'data center', 'datacenter', 'datacentre',
                'colocation', 'colo provider',
                'dedicated server', 'virtual server',
                'vps', 'virtual private server',
                'hosting', 'server farm',
                'cloud infrastructure', 'cloud services',
                'content delivery network', 'cdn provider',
            ];

            // ASN numbers of known VPN/hosting providers
            const vpnHostingASNs = [
                'as13335', // Cloudflare
                'as16509', // Amazon
                'as15169', // Google
                'as8075',  // Microsoft
                'as14061', // DigitalOcean
                'as63949', // Linode
                'as20473', // Vultr/Choopa
                'as16276', // OVH
                'as24940', // Hetzner
                'as51167', // Contabo
                'as197540', // Neterra
                'as9009',  // M247
                'as201011', // Core-Backbone
                'as136787', // TEFINCOM (NordVPN)
                'as212238', // CDLAN (NordVPN)
                'as43350', // NForce
                'as60068', // CDN77
                'as204196', // Abelohost
                'as51396', // Privatelayer
                'as40676', // Psychz
                'as36352', // ColoCrossing
                'as53667', // FranTech
                'as8100',  // QuadraNet
                'as46664', // VolumeDrive
                'as394380', // Leaseweb
                'as60781', // Leaseweb Netherlands
                'as28753', // Leaseweb Germany
                'as59253', // Leaseweb Asia
                'as49981', // WorldStream
                'as58305', // WorldStream International
            ];

            // Check if it matches VPN patterns
            const isKnownVPN = knownVpnProviders.some(vpn => org.includes(vpn));
            const isHosting = hostingProviders.some(host => org.includes(host));
            const isVPNASN = vpnHostingASNs.some(vpnAsn => asn.includes(vpnAsn.toLowerCase()));

            // Check for residential ISP patterns (to exclude false positives)
            const residentialPatterns = [
                // US ISPs
                'comcast', 'xfinity', 'verizon fios', 'verizon wireless',
                'at&t internet', 'att-', 'spectrum', 'charter communications',
                'cox communications', 'cox business', 'time warner cable',
                'centurylink', 'frontier communications', 'windstream',
                'mediacom', 'optimum', 'cablevision', 'suddenlink',
                'wow!', 'wide open west', 'rcn', 'atlantic broadband',
                'armstrong', 'service electric',

                // International ISPs
                'virgin media', 'bt group', 'british telecom', 'sky broadband',
                'talktalk', 'ee limited', 'plusnet',
                'vodafone', 'orange', 'telefonica', 'deutsche telekom',
                'swisscom', 'proximus', 'kpn', 'ziggo',
                'rogers', 'bell canada', 'telus', 'shaw',
                'telstra', 'optus', 'tpg telecom',
                'singtel', 'starhub', 'm1 limited',
                'ntt', 'kddi', 'softbank', 'rakuten',
                'china telecom', 'china unicom', 'china mobile',
                'airtel', 'reliance jio', 'bsnl', 'mtnl',
                'korea telecom', 'sk broadband', 'lg u+',

                // Residential indicators
                'residential', 'broadband', 'cable', 'dsl', 'fiber',
                'fttc', 'ftth', 'fttp', 'docsis',
                'home internet', 'consumer internet',
            ];

            const isResidential = residentialPatterns.some(pattern =>
                org.includes(pattern)
            );

            // Only exclude if clearly residential AND not matching VPN patterns
            if (isResidential && !isKnownVPN && !isHosting && !isVPNASN) {
                console.log('Residential ISP detected (not VPN):', org);
                setOpen(false);
                return false;
            }

            // Determine if VPN/Proxy
            vpnDetected = isKnownVPN || isHosting || isVPNASN;

            console.log('VPN Detection Result:', {
                ip: ipData.ip,
                org: ipData.org,
                asn: ipData.asn,
                isKnownVPN,
                isHosting,
                isVPNASN,
                isResidential,
                vpnDetected
            });

            if (isVpnProtected) {
                setOpen(vpnDetected);
            }

            return vpnDetected;
        } catch (e) {
            console.error('VPN detection error:', e);

            // On error, be conservative - don't show modal
            setError('Unable to verify your connection. Please try again.');
            setInfo(null);
            setOpen(false);
            return false;
        } finally {
            setChecking(false);
        }
    }, [isVpnProtected]);

    // Check on initial mount
    useEffect(() => {
        if (!isVpnProtected) {
            setOpen(false);
            return;
        }

        // Run detection immediately
        detectVpn();
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
                                : 'We detected that you are connected through a VPN or proxy service. Please disable your VPN/proxy and click Refresh to continue.'}
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
                                            {info?.country && (
                                                <div><strong>Country:</strong> {info.country}</div>
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
import { z } from 'zod';

export interface Carrier {
  id: string;
  name: string;
  code: string;
  trackingUrlTemplate?: string;
  logo?: string;
}

export const predefinedCarriers: Carrier[] = [
  {
    id: 'apc',
    name: 'APC Postal Logistics',
    code: 'APC',
  },
  {
    id: 'asendia',
    name: 'Asendia',
    code: 'ASENDIA',
  },
  {
    id: 'australia-post',
    name: 'Australia Post',
    code: 'AUSPOST',
  },
  {
    id: 'canada-post',
    name: 'Canada Post',
    code: 'CANADAPOST',
  },
  {
    id: 'dhl',
    name: 'DHL',
    code: 'DHL',
    trackingUrlTemplate: 'https://www.dhl.com/en/express/tracking.html?AWB={tracking_number}'
  },
  {
    id: 'epost-global',
    name: 'ePost Global',
    code: 'EPOST',
  },
  {
    id: 'estafeta',
    name: 'Estafeta',
    code: 'ESTAFETA',
  },
  {
    id: 'fedex',
    name: 'FedEx',
    code: 'FEDEX',
    trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?trknbr={tracking_number}'
  },
  {
    id: 'intelcom',
    name: 'Intelcom',
    code: 'INTELCOM',
  },
  {
    id: 'japan-post',
    name: 'Japan Post',
    code: 'JAPANPOST',
  },
  {
    id: 'packquet-express',
    name: 'PackquetExpress',
    code: 'PACKQUET',
  },
  {
    id: 'tforce',
    name: 'TForce',
    code: 'TFORCE',
  },
  {
    id: 'uniuni',
    name: 'UniUni',
    code: 'UNIUNI',
  },
  {
    id: 'ups',
    name: 'UPS',
    code: 'UPS',
    trackingUrlTemplate: 'https://www.ups.com/track?tracknum={tracking_number}'
  },
  {
    id: 'ups-mail-innovations',
    name: 'UPS Mail Innovations',
    code: 'UPSMI',
  },
  {
    id: 'usps',
    name: 'USPS',
    code: 'USPS',
    trackingUrlTemplate: 'https://tools.usps.com/go/TrackConfirmAction?tLabels={tracking_number}'
  }
].sort((a, b) => a.name.localeCompare(b.name));

export const carrierSchema = z.object({
  name: z.string().min(1, "Carrier name is required"),
  code: z.string().min(1, "Carrier code is required").toUpperCase(),
});
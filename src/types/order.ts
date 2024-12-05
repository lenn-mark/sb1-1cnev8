import { BuyerAddress } from './shipment';

export interface OrderPlatform {
  id: string;
  name: string;
  icon?: string;
}

export interface OrderDetails {
  orderId: string;
  platform: OrderPlatform;
  shippingNumber?: string;
  buyer: {
    name: string;
    phoneNumber: string;
    address: BuyerAddress;
  };
}

export const orderPlatforms: OrderPlatform[] = [
  { id: 'shopify', name: 'Shopify' },
  { id: 'amazon', name: 'Amazon' },
  { id: 'ebay', name: 'eBay' },
  { id: 'woocommerce', name: 'WooCommerce' },
  { id: 'etsy', name: 'Etsy' },
  { id: 'other', name: 'Other' }
];
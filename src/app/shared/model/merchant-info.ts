export interface MerchantInfo {
  merchantId: string;
  merchantIdInPayPal: string;
  permissionsGranted: boolean;
  accountStatus: string;
  consentStatus: boolean;
  productIntentID: string;
  isEmailConfirmed: boolean;
}

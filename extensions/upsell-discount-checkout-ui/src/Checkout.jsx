//@ts-check

/**
 * @typedef {import("../../../lib/types").UpsellOfferConfiguration} UpsellOfferConfiguration
 */

import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useAppMetafields,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();

  const appMetafields = useAppMetafields({
    type: 'shop',
  });

  /**
   * @type {UpsellOfferConfiguration}
   */
  const offers = appMetafields
    .filter((metafield) => metafield.metafield.key === 'offers')
    .map((metafield) => JSON.parse(metafield.metafield.value.toString()))
    .pop() ?? [];

  return (
    <Banner title="upsell-discount-checkout-ui">
        {JSON.stringify(offers)}
    </Banner>
  );
}
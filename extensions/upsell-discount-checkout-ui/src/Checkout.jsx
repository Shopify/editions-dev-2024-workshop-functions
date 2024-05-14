//@ts-check

/**
 * Note: This extension is for workshop functionality demonstration purposes only.
 * It omits some best practices around loading state, translation, and error handling.
 */

/**
 * @typedef {import("../../../lib/types").UpsellOfferConfiguration} UpsellOfferConfiguration
 * 
 * @typedef {Object} VariantPrice
 * @property {number} amount
 * 
 * @typedef {Object} VariantImage
 * @property {string} url
 * 
 * @typedef {Object} VariantResult
 * @property {string} id
 * @property {string} title
 * @property {VariantImage} image
 * @property {VariantPrice} price
 * 
 * @typedef {Object} QueryResult
 * @property {VariantResult[]} offeredProducts
 * 
 * @typedef {Object} QueryData
 * @property {QueryResult} data
 * 
 * @typedef {Object} UpsellOfferExtended
 * @property {VariantResult} offeredVariant
 * @property {string} imageUrl
 * @property {string} renderPrice
 * 
 * @typedef {UpsellOfferConfiguration & UpsellOfferExtended} UpsellOffer
 */

import {
  Banner,
  useApi,
  reactExtension,
  useAppMetafields,
  BlockStack,
  Divider,
  Heading,
  InlineLayout,
  Image,
  Text,
  Button,
  useApplyCartLinesChange,
  useSubtotalAmount,
  useCartLines,
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';
import React from 'react'

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const [offerConfiguration, setOfferConfiguration] = useState(/** @type {UpsellOfferConfiguration[] | undefined} */ ([])); 
  const [offers, setOffers] = useState(/** @type {UpsellOffer[] | undefined} */ ([]));
  const [showError, setShowError] = useState(false);

  const { query, i18n } = useApi();
  const applyCartLinesChange = useApplyCartLinesChange();
  const subtotal = useSubtotalAmount();
  const cartLines = useCartLines();
  const appMetafields = useAppMetafields();

  const defaultImage = 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081';

  // Filter offers based on the subtotal and if the product is already in the cart
  useEffect(() => {
    if (!appMetafields || appMetafields.length === 0 || !subtotal || !cartLines || cartLines.length === 0) {
      return;
    }

    /**
     * @type {UpsellOfferConfiguration[]}
     */
    const allOffers = appMetafields
        .filter((metafield) => metafield.metafield.key === 'offers')
        .map((metafield) => JSON.parse(metafield.metafield.value.toString()))
        .pop() ?? [];

    setOfferConfiguration(allOffers.filter((/** @type {UpsellOfferConfiguration} */ offer) => (
        subtotal.amount > offer.total &&
        !cartLines.find((line) => line.merchandise.id === offer.offered && line.attributes.find((attr) => attr.key === '_is-upsell')
    ))));

  }, [appMetafields, cartLines, subtotal]);

  // When offers update, fetch the product data
  useEffect(() => {
    if (!offerConfiguration || offerConfiguration.length === 0) {
      setOffers([]);
      return;
    }

    query(
      `fragment VariantFields on ProductVariant {
        id
        title
        image {
          url
        }
        price {
          amount
        }
      }
      
      query($offeredProducts: [ID!]!) {
        offeredProducts: nodes(ids: $offeredProducts) {
          ... VariantFields
        }
      }`,
      {
        variables: {
          offeredProducts: offerConfiguration.map((offer) => offer.offered),
        },
      },
    )
    .then(({data}) => {
      if (data) {
        const queryResult = /** @type {QueryResult} */(data);
        setOffers(offerConfiguration.map((offer, index) => {
          const offeredVariant = queryResult.offeredProducts[index];
          return {
            ...offer,
            offeredVariant,
            renderPrice: i18n.formatCurrency(offeredVariant.price.amount),
            imageUrl: offeredVariant.image?.url ?? defaultImage,
          }
      }));
      }
    })
    .catch((error) => console.error(error))
  }, [offerConfiguration]);

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>Upsell offers</Heading>
      {offers && offers.map((offer, index) => (
        <BlockStack spacing="loose" key={index}>
          <InlineLayout
            spacing="base"
            columns={[64, "fill", "auto"]}
            blockAlignment="center"
          >
            <Image
              border="base"
              borderWidth="base"
              borderRadius="loose"
              source={offer.imageUrl}
              accessibilityDescription={offer.offeredVariant.title}
              aspectRatio={1}
            />
            <BlockStack spacing="none">
              <Text size="medium" emphasis="bold">
                {offer.offeredVariant.title}
              </Text>
              <Text appearance="subdued">{offer.renderPrice}</Text>
            </BlockStack>
            <Button
              kind="secondary"
              accessibilityLabel={`Add ${offer.offeredVariant.title} to cart`}
              onPress={async () => {
                // Add the offered product
                const result = await applyCartLinesChange({
                  type: "addCartLine",
                  merchandiseId: offer.offeredVariant.id,
                  quantity: 1,
                  attributes: [
                    {
                      key: "_is-upsell",
                      value: "true"
                    }
                  ]
                });
                const error = result.type === "error" ? result.message : null;
                if (error) {
                  setShowError(true);
                  console.error(error);
                }
              }}
            >
              Add
            </Button>
          </InlineLayout>
        </BlockStack>
      ))}
      {showError && (
        <Banner status="critical">
          There was an issue adding this product. Please try again.
        </Banner>
      )}
    </BlockStack>
  );
}
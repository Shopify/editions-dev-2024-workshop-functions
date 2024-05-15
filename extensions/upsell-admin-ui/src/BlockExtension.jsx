//@ts-check

/**
 * Note: This extension is for workshop functionality demonstration purposes only.
 * It omits some best practices around loading state, translation, and error handling.
 */

/**
 * @typedef {import("../../../lib/types").UpsellOfferConfiguration} UpsellOfferConfiguration
 * 
 * @typedef {Object} VariantFields
 * @property {string} id
 * @property {string} title
 * 
 * @typedef {Object} VariantNodes
 * @property {VariantFields[]} nodes
 * 
 * @typedef {Object} ProductFields
 * @property {string} productType
 * @property {VariantNodes} variants
 * 
 * @typedef {Object} ProductResult
 * @property {ProductFields} product
 * 
 * @typedef {Object} ProductQueryData
 * @property {ProductResult} data
 * 
 * @typedef {Object} UpsellMetafield
 * @property {string} value
 * 
 * @typedef {Object} ShopFields
 * @property {string} id
 * @property {UpsellMetafield} upsellConfig
 * 
 * @typedef {Object} ShopResult
 * @property {ShopFields} shop
 * 
 * @typedef {Object} ShopQueryData
 * @property {ShopResult} data
 */

import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  Text,
  Form,
  Divider,
  Box,
  InlineStack,
} from '@shopify/ui-extensions-react/admin';
import { TextField } from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';
import React from 'react'

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-details.block.render';

export default reactExtension(TARGET, () => <App />);

/**
 * 
 * @param {string} id 
 * @returns {Promise<ProductQueryData>}
 */
async function getProduct(id) {
  const res = await fetch('shopify:admin/api/graphql.json', {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query GetProduct($id: ID!) {
          product(id: $id) {
            productType
            variants(first: 10) {
              nodes {
                id
                title
              }
            }
          }
        }
      `,
      variables: {id},
    }),
  });
  return res.json();
}

/***
 * @returns {Promise<ShopQueryData>}
 */
async function getShop() {
  const res = await fetch('shopify:admin/api/graphql.json', {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query GetShop {
          shop {
            id
            upsellConfig: metafield(namespace: "upsell-offers", key: "offers") {
              value
            }
          }
        }
      `,
    }),
  });
  return res.json();
}

async function saveConfig(shopId, offers) {
  const res = await fetch('shopify:admin/api/graphql.json', {
    method: 'POST',
    body: JSON.stringify({
      query: `
        mutation SaveMetafield($shopId: ID!, $value: String!) {
          metafieldsSet(metafields: {
            ownerId: $shopId,
            namespace: "upsell-offers",
            key: "offers",
            type: "json"
            value: $value
          }) {
            metafields {
              id
            }
            userErrors {
              message
              field
            }
          }
        }
      `,
      variables: {
        shopId,
        value: JSON.stringify(offers),
      }
    }),
  });
  return res.json();
}

function App() {
  const {i18n, data} = useApi(TARGET);
  const [product, setProduct] = useState(/** @type {ProductFields | undefined} */ (undefined));
  const [shop, setShop] = useState(/** @type {string | undefined} */ (undefined));
  const [offers, setOffers] = useState(/** @type {UpsellOfferConfiguration[] | undefined} */ ([]));

  useEffect(() => {
    getShop().then(({data}) => {
      setShop(data.shop.id);
      if (data.shop.upsellConfig) {      
        setOffers(JSON.parse(data.shop.upsellConfig.value));
      }
    });
  }, []);

  useEffect(() => {
    const productId = data.selected?.[0]?.id;
    getProduct(productId).then(({data}) => setProduct(data.product));
  }, [data]);

  if (!product || product.productType !== 'accessories') {
    return null;
  }

  const getDefaultTotal = (variant) => {
    const existing = offers && offers.find((offer) => offer.offered === variant.id);
    return existing ? existing.total.toString() : undefined
  }

  const handleTotalChange = (variant, value) => {
    const existing = offers && offers.find((offer) => offer.offered === variant.id);
    if (existing) {
      existing.total = parseFloat(value);
      setOffers([...offers ?? []]);
    } else {
      setOffers([
        ...offers ?? [],
        {
          offered: variant.id,
          total: parseFloat(value),
          discount: 0,
          quantity: 1,
        }
      ]);
    }
  }

  const getDefaultDiscount = (variant) => {
    const existing = offers && offers.find((offer) => offer.offered === variant.id);
    return existing ? existing.discount.toString() : undefined
  }

  const handleDiscountChange = (variant, value) => {
    const existing = offers && offers.find((offer) => offer.offered === variant.id);
    if (existing) {
      existing.discount = parseFloat(value);
      setOffers([...offers ?? []]);
    } else {
      setOffers([
        ...offers ?? [],
        {
          offered: variant.id,
          total: 0,
          discount: parseFloat(value),
          quantity: 1,
        }
      ]);
    }
  }

  /**
   * Note that this form will currently overwrite all existing
   * upsell offers from the shop. But it works for our demo.
   */
  const onSubmit = async () => {
    const result = await saveConfig(shop, offers);
    if (result.data.metafieldsSet.userErrors.length > 0) {
      console.error(result.data.metafieldsSet.userErrors);
    }
  }

  return (
    <AdminBlock title="Upsell configuration">
      <Form onSubmit={onSubmit} onReset={() => {}}>
        <BlockStack>
          <InlineStack inlineSize="100%" blockAlignment="center" gap="large">
            <Box inlineSize="50%">
              <Text fontWeight='bold'>Accessory</Text>
            </Box>
            <Box inlineSize="25%">
              <Text fontWeight='bold'>Offered at subtotal</Text>
            </Box>
            <Box inlineSize="25%">
              <Text fontWeight='bold'>Discount percentage</Text>
            </Box>
          </InlineStack>
          {product.variants.nodes.map((variant, index) => (
            <>
              {index > 0 && <Divider />}
              <InlineStack inlineSize="100%" blockAlignment="center" gap="large">
                <Box inlineSize="50%">
                  <Text>{variant.title}</Text>
                </Box>
                <Box inlineSize="25%">
                  <TextField
                    label=""
                    value={getDefaultTotal(variant)}
                    onChange={(value) => handleTotalChange(variant, value)}
                  />
                </Box>
                <Box inlineSize="25%">
                  <TextField
                    label=""
                    value={getDefaultDiscount(variant)}
                    onChange={(value) => handleDiscountChange(variant, value)}
                  />
                </Box>
              </InlineStack>
            </> 
          ))}
        </BlockStack>
      </Form>
    </AdminBlock>
  );
}
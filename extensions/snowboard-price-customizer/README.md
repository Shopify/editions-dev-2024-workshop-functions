# Snowboard price customizer function

This cart transform will update pricing based on cart line attributes. This is most easily tested by adding some custom liquid to your product template via the online store editor:


```liquid
{% if product.type == 'snowboard' %}

{%- assign product_form_id = 'product-form-' | append: section.id -%}
<div class="product-form__input product-form__input--dropdown">
  <label class="form__label" for="stiffness">Stiffness</label>
  <div class="select">
    <select required class="required select__select" id="stiffness" name="properties[Stiffness]" form="{{ product_form_id }}">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
    </select>
  </div>
</div>

{%- assign product_form_id = 'product-form-' | append: section.id -%}
<div class="product-form__input product-form__input--dropdown">
  <label class="form__label" for="stiffness">Size</label>
  <div class="select">
    <select required class="required select__select" id="size" name="properties[Size]" form="{{ product_form_id }}">
        <option value="148">148</option>
        <option value="157">157</option>
        <option value="157W">157W</option>
        <option value="160">160</option>
        <option value="160W">160W</option>
        <option value="163W">163W</option>
    </select>
  </div>
</div>

{%- assign product_form_id = 'product-form-' | append: section.id -%}
<div class="product-form__input product-form__input--text">
  <label class="form__label" for="sidewall">Sidewall Text</label>
  <div class="field">
    <input class="field__input" id="sidewall" type="text" name="properties[Sidewall Text]" form="{{ product_form_id }}">
  </div>
</div>

{% endif %}
```
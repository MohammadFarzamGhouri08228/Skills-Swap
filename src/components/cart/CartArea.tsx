

import Link from 'next/link'
import React from 'react'

export default function CartArea() {
  return (
    <>
      <div className="shopping-cart section-padding">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 wow fadeIn">

              <table className="table shopping-summery responsive-table woocommerce-cart-form">
                <thead>
                  <tr className="main-hading">
                    <th>Products</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                    <td>
                      <Link href="/course-details" className="pthumb">
                        <img src="assets/img/courses/1.jpg" alt="img" />
                      </Link>

                      <div className="product-name">
                        <Link href="/course-details">
                          Financial Security Thinking
                        </Link>
                      </div>
                    </td>

                    <td className="price" data-title="Price"><span>$80.00 </span></td>

                    <td className="qty" data-title="Qty">
                      <div className="input-group">
                        <div className="button minus">
                          <button type="button" className="btn btn-primary btn-number" disabled data-type="minus" data-field="quant[1]">
                            <i className="ti-minus"></i>
                          </button>
                        </div>
                        <input type="text" name="quant[1]" className="input-number" data-min="1" data-max="100" defaultValue="1" />
                        <div className="button plus">
                          <button type="button" className="btn btn-primary btn-number" data-type="plus" data-field="quant[1]">
                            <i className="ti-plus"></i>
                          </button>
                        </div>
                      </div>

                    </td>

                    <td className="total-amount"><span>$220.88</span></td>
                    <td className="action"><a href="#"><i className="ti-trash remove-icon"></i></a></td>
                  </tr>

                  <tr>
                    <td>
                      <Link href="/course-details" className="pthumb">
                        <img src="assets/img/courses/2.jpg" alt="img" />
                      </Link>

                      <div className="product-name">
                        <Link href="/course-details">
                          Financial Security Thinking
                        </Link>
                      </div>
                    </td>

                    <td className="price" data-title="Price"><span>$80.00 </span></td>

                    <td className="qty" data-title="Qty">
                      <div className="input-group">
                        <div className="button minus">
                          <button type="button" className="btn btn-primary btn-number" disabled data-type="minus" data-field="quant[2]">
                            <i className="ti-minus"></i>
                          </button>
                        </div>
                        <input type="text" name="quant[2]" className="input-number" data-min="1" data-max="100" defaultValue="2" />
                        <div className="button plus">
                          <button type="button" className="btn btn-primary btn-number" data-type="plus" data-field="quant[2]">
                            <i className="ti-plus"></i>
                          </button>
                        </div>
                      </div>

                    </td>

                    <td className="total-amount"><span>$100.88</span></td>
                    <td className="action"><a href="#"><i className="ti-trash remove-icon"></i></a></td>
                  </tr>

                  <tr>
                    <td>
                      <Link href="/course-details" className="pthumb">
                        <img src="assets/img/courses/3.jpg" alt="img" />
                      </Link>

                      <div className="product-name">
                        <Link href="/course-details">
                          Financial Security Thinking
                        </Link>
                      </div>
                    </td>

                    <td className="price" data-title="Price"><span>$80.00 </span></td>

                    <td className="qty" data-title="Qty">
                      <div className="input-group">
                        <div className="button minus">
                          <button type="button" className="btn btn-primary btn-number" disabled data-type="minus" data-field="quant[4]">
                            <i className="ti-minus"></i>
                          </button>
                        </div>
                        <input type="text" name="quant[4]" className="input-number" data-min="1" data-max="100" defaultValue="4" />
                        <div className="button plus">
                          <button type="button" className="btn btn-primary btn-number" data-type="plus" data-field="quant[4]">
                            <i className="ti-plus"></i>
                          </button>
                        </div>
                      </div>

                    </td>

                    <td className="total-amount"><span>$150.00</span></td>
                    <td className="action"><a href="#"><i className="ti-trash remove-icon"></i></a></td>
                  </tr>

                  <tr>
                    <td colSpan={6} className="actions">
                      <div className="bottom-cart">
                        <div className="coupon">
                          <input type="text" name="coupon_code" className="input-text" id="coupon_code" defaultValue="" placeholder="Coupon code" /> <button type="submit" className="button" name="apply_coupon" defaultValue="Apply coupon">Apply coupon</button>
                        </div>
                        <a href="#" className="btn_border">Update Cart</a>
                      </div>

                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-xl-4 wow fadeIn">
              <div className="cart-collaterals">
                <h2>Cart totals</h2>

                <div className="shop_table shop_table_responsive">
                  <div className="cart-subtotal">
                    <div className="title">Subtotal</div>
                    <div data-title="Subtotal">
                      <span className="woocommerce-Price-amount amount"><bdi>50.00<span className="woocommerce-Price-currencySymbol">$</span></bdi></span>
                    </div>
                  </div>

                  <div className="woocommerce-shipping-totals shipping">
                    <div className="title">Shipping</div>
                    <div data-title="Shipping">
                      <p className="woocommerce-shipping-destination">
                        Shipping to <strong>Afghanistan</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="order-total">
                    <div className="title">Total</div>
                    <div data-title="Total"><strong><span className="woocommerce-Price-amount amount"><bdi>350.00<span className="woocommerce-Price-currencySymbol">$</span></bdi></span></strong> </div>
                  </div>

                  <div className="wc-proceed-to-checkout">
                    <Link href="/checkout" className="bg_btn bt">
                      Proceed to checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

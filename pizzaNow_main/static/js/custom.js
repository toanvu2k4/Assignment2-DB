$(document).ready(function () {
  $(".add_to_cart").on("click", function (e) {
    e.preventDefault();

    food_id = $(this).attr("data-id");
    url = $(this).attr("data-url");

    $.ajax({
      type: "GET",
      url: url,
      success: function (response) {
        console.log(response);
        if (response.status == "login_required") {
          swal(response.message, "", "info").then(function () {
            window.location = "/login";
          });
        } else if (response.status == "Failed") {
          swal(response.message, "", "error");
        } else {
          $("#cart_counter").html(response.cart_counter["cart_count"]);
          $("#qty-" + food_id).html(response.qty);

          // subtotal, tax and grand total
          applyCartAmounts(
            response.cart_amount["subtotal"],
            response.cart_amount["tax_dict"],
            response.cart_amount["grand_total"]
          );
        }
      },
    });
  });

  // place the cart item quantity on load
  $(".item_qty").each(function () {
    var the_id = $(this).attr("id");
    var qty = $(this).attr("data-qty");
    $("#" + the_id).html(qty);
  });

  // decrease cart
  $(".decrease_cart").on("click", function (e) {
    e.preventDefault();

    food_id = $(this).attr("data-id");
    url = $(this).attr("data-url");
    cart_id = $(this).attr("id");

    $.ajax({
      type: "GET",
      url: url,
      success: function (response) {
        console.log(response);
        if (response.status == "login_required") {
          swal(response.message, "", "info").then(function () {
            window.location = "/login";
          });
        } else if (response.status == "Failed") {
          swal(response.message, "", "error");
        } else {
          $("#cart_counter").html(response.cart_counter["cart_count"]);
          $("#qty-" + food_id).html(response.qty);

          applyCartAmounts(
            response.cart_amount["subtotal"],
            response.cart_amount["tax_dict"],
            response.cart_amount["grand_total"]
          );

          if (window.location.pathname == "/cart/") {
            removeCartItem(response.qty, cart_id);
            checkEmptyCart();
          }
        }
      },
    });
  });

  // DELETE CART ITEM
  $(".delete_cart").on("click", function (e) {
    e.preventDefault();

    cart_id = $(this).attr("data-id");
    url = $(this).attr("data-url");

    $.ajax({
      type: "GET",
      url: url,
      success: function (response) {
        console.log(response);
        if (response.status == "Failed") {
          swal(response.message, "", "error");
        } else {
          $("#cart_counter").html(response.cart_counter["cart_count"]);
          swal(response.status, response.message, "success");

          applyCartAmounts(
            response.cart_amount["subtotal"],
            response.cart_amount["tax_dict"],
            response.cart_amount["grand_total"]
          );

          removeCartItem(0, cart_id);
          checkEmptyCart();
        }
      },
    });
  });

  // delete the cart element if the qty is 0
  function removeCartItem(cartItemQty, cart_id) {
    if (cartItemQty <= 0) {
      // remove the cart item element
      document.getElementById("cart-item-" + cart_id).remove();
    }
  }

  // Check if the cart is empty
  function checkEmptyCart() {
    var cart_counter = document.getElementById("cart_counter").innerHTML;
    if (cart_counter == 0) {
      document.getElementById("empty-cart").style.display = "block";
    }
  }

  // apply cart amounts
  function applyCartAmounts(subtotal, tax_dict, grand_total) {
    if (window.location.pathname == "/cart/") {
      $("#subtotal").html(subtotal);
      $("#total").html(grand_total);

      console.log(tax_dict);
      for (key1 in tax_dict) {
        console.log(tax_dict[key1]);
        for (key2 in tax_dict[key1]) {
          // console.log(tax_dict[key1][key2])
          $("#tax-" + key1).html(tax_dict[key1][key2]);
        }
      }
    }
  }
});

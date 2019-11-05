









//Cookies

    function setCookie(cname) {
        var cvalue = "1";
        var exdays = "10000";
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

        console.log('setCookie(cname)');
    }

    function checkCookie(cname) {
        var username = getCookie(cname);
        if (username == '1') {
            console.log('cookie is here');
            return 1;
        } else {
            console.log('cookie is not here');
            return 0;
        }

        console.log('checkCookie(cname)');
    }

    function getCookie(name) {
        var cookie = document.cookie;
        var prefix = name + "=";
        var begin = cookie.indexOf("; " + prefix);
        if (begin == -1) {
            begin = cookie.indexOf(prefix);
            if (begin !== 0) return 0;
        } else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = cookie.length;
            }
        }

        console.log('getCookie(name)');

        return unescape(cookie.substring(begin + prefix.length, end));
    }

    function deleteCookie(name) {

        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        console.log('deleteCookie(name)');

    }

//Atrributes & URL

    function checkForAttr(attr) {
        if (typeof attr !== typeof undefined && attr !== false) {
            var result = 1;
        } else {
            var result = 0;
        }
        return result;

        console.log('checkForAttr(attr); result: ' + result);

    }

    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }

        console.log('getUrlParameter(sParam); result:' + sParameterName[1] === undefined ? true : sParameterName[1]);

    };

//Price & Numbers

    function priceToNumber(price) {
        var number = Number(price.replace(/[^0-9\-]+/g, "")) * 100;

        console.log('priceToNumber(price); result:' + number);

        return number;
    }

    function textToNumber(number) {
        var number = Number(number.replace(/[^0-9\.-]+/g, ""));

        console.log('textToNumber(number); result:' + number);

        return number;
    }

    function numberToPrice(number) {
        var currency = '$';
        var realPrice = (number / 100).toFixed(2);
        var price = currency + " " + realPrice;

        console.log('numberToPrice(number); result:' + price);

        return price;
    }

//Shopify Products

    Shopify.queue = [];

    Shopify.moveAlong = function () {
        // If we still have requests in the queue, let's process the next one.
        if (Shopify.queue.length) {
            var request = Shopify.queue.shift();
            Shopify.addItem(request.variantId, request.quantity, request.properties, Shopify.moveAlong);
            updateCartIcon();
        }
        // If the queue is empty, we will redirect to the cart page.
        else {
            //$('#add').removeAttr('disabled');
            updateCartIcon();
        }
        console.log('Shopify.moveAlong = function()');

    };

    Shopify.updateAlong = function () {
        // If we still have requests in the queue, let's process the next one.
        if (Shopify.queue.length) {
            var request = Shopify.queue.shift();
            Shopify.changeItem(request.variantId, request.quantity, Shopify.updateAlong);
            // console.log("wow");
            updateCartIcon();
        } else {
            updateCartIcon();
            // console.log("nothing to see here");
        }


        console.log('Shopify.updateAlong = function()');

    };

    Shopify.removeAlong = function () {
        // If we still have requests in the queue, let's process the next one.
        if (Shopify.queue.length) {
            var request = Shopify.queue.shift();
            Shopify.removeItem(request.variantId, Shopify.updateAlong);
        } else {
            updateCartIcon();
        }

        console.log('Shopify.removeAlong = function()');


    };

    function updateCartTotal() {
        setTimeout(function () {
            jQuery.getJSON('/cart.js', function (cart) {
                for (var i = 0; i < cart.items.length; i++) {
                    var item = cart.items[i];
                    var elem = $('.product-' + item.id + ' .money');
                    elem.html(Shopify.formatMoney(item.price * item.quantity));
                    $('.cart__subtotal').html(Shopify.formatMoney(cart.total_price));
                }
                ;
                updateCartIcon();
            });

        }, 300);

        console.log('updateCartTotal()');

    };


    Shopify.addItem = function (id, qty, properties) {
        var params = {
            quantity: qty,
            id: id
        };
        if (properties != false) {
            params.properties = properties;
        }
        $.ajax({
            type: 'POST',
            url: '/cart/add.js',
            dataType: 'json',
            data: params,
            async: false,
            success: function () {
                if (Shopify.queue.length < 1) {
                    updateCartIcon();
                }
            },
            error: function () {
                $('.add-to-cart').text(addToCartError);
            }
        });
        //  $('.cartdrawer').addClass('toggle-cart');
        console.log('Shopify.addItem = function(id, qty, properties)');
        if (window.location.href.indexOf('sample') <= 0 && $(window).width() > 768) {
            if (qty > 0 && $(window).width() > 1400) {
                $('.cartdrawer').addClass('toggle-cart');
                $('.site-header').addClass('not-transparent');
            }
        }
    }


    function removeItem(id) {
        push_to_queue(id, 0);
        Shopify.updateAlong();
        updateCartIcon();
    }

    function push_to_queue(variantID, quantity, properties) {
        if (typeof Shopify.queue == "undefined") {
            Shopify.queue = [];
        }

        Shopify.queue.push({
            variantId: variantID,
            quantity: quantity,
            properties: properties
        });
    }

    function clearCart() {
        Shopify.clear(function () {
            console.log('Cart cleared');
        });

        console.log('clearCart()');
        updateCartIcon();
    }

    function callback() {
        //window.location.href = "/cart";
        console.log('callback()');
    }

    function updateCartIcon() {
        setTimeout(function () {
            jQuery.getJSON('/cart.js', function (cart) {
                var qty = 0;
                for (var i = 0; i < cart.items.length; i++) {
                    qty = qty + cart.items[i].quantity;

                }
                ;
                if (qty > 0) {

                    $('#cartDrawer .cart-number').text(qty);
                    $('#cartDrawer .cart-number').removeClass('hide');
                } else {
                    $('#cartDrawer .cart-number').addClass('hide');
                }
            });
            console.log('updateCartIcon()');

        }, 300)
    }

    //form validation

    function checkCheckbox(elem) {

        if (!elem.is(':checked')) {
            elem.parents('.item').removeClass('success').addClass('error');
            console.log(invalid + ' invalid');
            return 1;

        } else {
            elem.parents('.item').addClass('success').removeClass('error');
            return 0;

        }

        console.log('checkCheckbox(elem)');
    }

    function checkEmail(elem) {

        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        var val = elem.val();

        if (!emailReg.test(val) || val == '') {

            elem.removeClass('success').addClass('error');

            return 1;

        } else {

            elem.addClass('success').removeClass('error');

            return 0;

        }
        console.log('checkEmail(elem)');

    }

    function checkPattern(elem) {

        if (elem.is(":invalid")) {

            elem.removeClass('success').addClass('error');

            return 1;
        } else {

            elem.addClass('success').removeClass('error');

            return 0;
        }

        console.log('checkPattern(elem)');
    }

    function checkTextInputs(elem) {

        var val = elem.val().replace(/ /g, '');

        if (val == undefined || val == 'undefined' || val.length == 0) {


            elem.removeClass('success').addClass('error');
            return 1;
        } else {

            elem.addClass('success').removeClass('error');

            return 0;

        }

        console.log('checkTextInputs(elem)');
    }

    function checkRequired(elem) {


        var parent = elem.parents('form');

        parent.find('input[required]:not([type="checkbox"]):not([type="email"]):not([pattern]):visible').each(function () {

            checkTextInputs($(this));

        })

        parent.find('input[type="checkbox"][required]:visible').each(function () {

            checkCheckbox($(this));
        })

        parent.find('input[type="email"][required]:visible').each(function () {

            checkEmail($(this));

        })

        parent.find('input[pattern][required]:visible').each(function () {

            checkPattern($(this));

        })

        invalid = parent.find('.error').length;

        console.log(invalid + ' invalid');
        if (invalid > 0) {

            if (invalid == 0) {
                $('.add-to-cart')
                    .text(addToCartText)
                    .removeClass('disabled');
            } else {
                $('.add-to-cart')
                    .text(addToCartError)
                    .addClass('disabled');
            }

            parent.find('.errors-wrapper,  .errors-wrapper .empty-fields').removeClass('hide');

            console.log('Empty fields: ' + invalid);

            parent.find('.error[required][pattern]').change(function () {
                console.log(invalid + ' invalid');

                checkPattern($(this));
                invalid = $(this).parents('form').find('.error').length;


                if (invalid == 0) {
                    $('.add-to-cart')
                        .text(addToCartText)
                        .removeClass('disabled');
                } else {
                    $('.add-to-cart')
                        .text(addToCartError)
                        .addClass('disabled');
                }
                console.log(invalid);

            })

            parent.find('.error[required][type="email"]').change(function () {
                console.log('email changed');
                checkEmail($(this));
                invalid = $(this).parents('form').find('.error').length;


                if (invalid == 0) {
                    $('.add-to-cart')
                        .text(addToCartText)
                        .removeClass('disabled');
                } else {
                    $('.add-to-cart')
                        .text(addToCartError)
                        .addClass('disabled');
                }
                console.log(invalid);

            })

            parent.find('.error[required][type="checkbox"]').change(function () {
                console.log('checkbox changed');
                checkCheckbox($(this));
                invalid = $(this).parents('form').find('.error').length;


                if (invalid == 0) {
                    $('.add-to-cart')
                        .text(addToCartText)
                        .removeClass('disabled');
                } else {
                    $('.add-to-cart')
                        .text(addToCartError)
                        .addClass('disabled');
                }
                console.log(invalid);

            })

            parent.find('.error[required]:not([type="checkbox"]):not([type="email"]):not([pattern]):visible').change(function () {
                console.log('inputText changed');
                checkTextInputs($(this));
                invalid = $(this).parents('form').find('.error').length;


                if (invalid == 0) {
                    $('.add-to-cart')
                        .text(addToCartText)
                        .removeClass('disabled');
                } else {
                    $('.add-to-cart')
                        .text(addToCartError)
                        .addClass('disabled');
                }

                console.log(invalid);

            })

        }

        return invalid;


        console.log('checkRequired(elem)');
    }

    //preventing input number to surpass the min and max values

    $('input[type="number"]').bind('input', function () {


        if ($(this).val() > Number($(this).attr('max'))) {
            $(this).val($(this).attr('max'));
        } else if ($(this).val() < Number($(this).attr('min'))) {
            $(this).val($(this).attr('min'));
        }

        console.log("$('input[type='number']').bind('input', function(){}");
    })

    //element effects

    function fadeEffects(hideElem, showElem) {

        if (hideElem.length > 0) {
            hideElem.fadeOut(300);

            setTimeout(function () {
                if (showElem.length > 0) {
                    showElem.fadeIn(300);
                }
            }, 300)
        } else {
            showElem.fadeIn(300);
        }
        console.log('fadeEffects(hideElem, showElem)');

    }

    function slideEffects(hideElem, showElem) {
        if (hideElem.length > 0) {
            hideElem.slideUp(300);
        }

        showElem.slideDown(300);
    }

    function slideItems(hideElem, showElem) {
        if (hideElem.length > 0) {
            hideElem.hide();
        }

        showElem.show();
    }

    function smoothLoad() {
        //requires css body.loading: opacity: 0;
        $('body').removeClass('loading');

        window.onbeforeunload = function () {


            $('body').addClass('loading');


        }


        console.log('smoothLoad()');
    }

    //overflow Functions

    var usedHideScroll = 0;
    var scrollValue = 0;

    function hideScroll() {
        $('html, body').addClass('no-overflow').css('top', -scrollValue).css('position', 'fixed');
        usedHideScroll = 1;
    }

    function showScroll() {
        $('html, body').css('position', 'inherit').removeClass('no-overflow').css('top', 0);
        usedHideScroll = 0;
    }

    function transparentHeader() {

        console.log('usedHideScroll: ' + usedHideScroll);

        if (usedHideScroll == 0) {

            if ($(document).scrollTop() > 60) {

                $('.site-header').removeClass('transparent');

            } else {

                $('.site-header').addClass('transparent');

            }

            $(window).scroll(function () {

                console.log('$(window).scroll(function()) inside transparentHeader(); usedHideScroll: ' + usedHideScroll);


                if (usedHideScroll == 0) {

                    if ($(document).scrollTop() > 60) {

                        $('.site-header').removeClass('transparent');

                    } else {

                        $('.site-header').addClass('transparent');

                    }

                }

            })


            console.log('transparentHeader()');
        }
    }

    //date functions

    function compareToToday(dateText) {
// date is dd.mm.yyyy
        var inputDate = dateText.split(".");
        var today = new Date();
        inputDate = new Date(inputDate[2], inputDate[1] - 1, inputDate[0], 0, 0, 0, 0);
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);

        console.log('compareToToday(dateText); result: ' + inputDate < today);

        return inputDate < today;
        //inputDate < today, if true, result is 'False'
    };

    function compareDates(date1, date2) {
// date is dd.mm.yyyy
        var inputDate1 = date1.split(".");
        var inputDate2 = date2.split(".");
        inputDate1 = new Date(inputDate1[2], inputDate1[1] - 1, inputDate1[0], 0, 0, 0, 0);
        inputDate2 = new Date(inputDate2[2], inputDate2[1] - 1, inputDate2[0], 0, 0, 0, 0);

        console.log('compareDates(date1, date2); result: ' + inputDate1 < inputDate2);


        return inputDate1 < inputDate2;
        //date1 < date2, if true, result is 'False'
    };

//distance between dates

    function daysDistance(firstDate, secondDate) {

        var startDay = new Date(firstDate);
        var endDay = new Date(secondDate);
        var millisecondsPerDay = 1000 * 60 * 60 * 24;

        var millisBetween = startDay.getTime() - endDay.getTime();
        var days = millisBetween / millisecondsPerDay;

        // Round down.
        return Math.abs(Math.floor(days));

        console.log('daysDistance(firstDate,secondDate); result: ' + Math.abs(Math.floor(days)));

    }

    //other functions

    function stringToMath(string) {

        console.log('stringToMath(string); result: ' + eval(string));

        return eval(string);
    }

    function copyToClipboard(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).val()).select();
        document.execCommand("copy");
        $temp.remove();

        console.log('copyToClipboard(element)');

    }

    function scrollToDiv(element) {
        var headerHeight = 0;

        if ($('.site-header').css('position') == 'fixed' || $('.site-header__mobile-nav').css('position') == 'fixed') {
            headerHeight = $('.site-header').outerHeight();
            console.log('has Fixed');
        }
        console.log('scrollin');
        $('html, body').animate({
                scrollTop: element.offset().top - headerHeight
            },
            300);

        console.log(element.offset().top);

        console.log('scrollToDiv(element)');

    }

    //custom modal

    function customModalShow(cookie, modal) {
        if (cookie == 'cookie') {

            if (checkCookie(modal.attr('class').replace(/\s/g, '')) == 1) {
                return 'opened';
            } else {
                setCookie(modal.attr('class').replace(/\s/g, ''));

//         hideScroll();

                fadeEffects('', modal);

                $('.modal__close').click(function () {
                    closeModal(modal);
                })
                console.log('customModalShow(cookie), cookie: ' + cookie + 'opened: opening');

                return 'opening';
            }

        } else {

            $('#tawkchat-container').css('opacity', 0).css('pointer-events', 'none');
            $('.fixed-header').addClass('modal-open');

//       hideScroll();

            fadeEffects('', modal);

            setTimeout(function () {
                $('.modal__text-content').css('padding-bottom', $('.product-descriptions:visible').outerHeight());

            }, 300);


            $('.modal__close').click(function () {
                closeModal(modal);
            })

            $('.modal__close--overlay').click(function () {
                closeModal(modal);
            })

            $(document).one("keyup", function (e) {
                if (e.key === "Escape") {
                    closeModal(modal);
                }
            })
            console.log('customModalShow(cookie), cookie: ' + cookie + 'opened: opening');

            return 'opening';


        }

    }

    function closeModal(elem) {
        fadeEffects(elem, '');
        showScroll();

        $('#tawkchat-container').css('opacity', 1).css('pointer-events', 'auto');
        $('.fixed-header').removeClass('modal-open');
    }

    


function sameHeight(obj, child) {
    obj.css('height', 'auto');
    var maxHeight = 0;
    obj.each(function () {
        if ($(this).outerHeight() > maxHeight) {
            maxHeight = $(this).outerHeight();
            console.log('bigger height: ' + maxHeight + '---' + $(this).outerHeight())
        } else {
            console.log('height not bigger: ' + maxHeight + '---' + $(this).outerHeight())

        }

    })
    obj.css('height', maxHeight);

    obj.each(function () {
        var diff = ($(this).height() - $(this).find(child).outerHeight()) / 2;

        $(this).find(child).css('top', diff);
    })

}




//on ready functions

$(document).ready(function () {
    var $toggleFormBtn = $('.Link[data-action="toggle-recover-form"]');

    toggleForms($('.Link--forgot'), $('#recover_customer_password'), $('#customer_login'));

    toggleForms($('.Link--login'), $('#customer_login'), $('#recover_customer_password'));

    function toggleForms($trigger, $formToShow, $formToHide) {
        $trigger.on('click', function (event) {
            event.preventDefault();

            $formToShow.css({
                display: 'block'
            });

            setTimeout(function () {
                $formToShow.css({
                    visibility: 'inherit',
                    opacity: 1,
                    transform: 'matrix(1, 0, 0, 1, 0, 0)'
                });

                $formToHide.css({
                    visibility: 'hidden',
                    opacity: 0,
                    transform: 'matrix(1, 0, 0, 1, 0, 20)'
                });
            }, 10);

            $formToHide.css({
                display: 'none'
            });
        });
    }

    if ($(window).width() > 768) {
        $('.shopify-section-cart-template select').each(function () {
            $(this).attr({
                nameI: $(this).attr('name'),
            })
                .removeAttr('name');

        })
    } else {
        $('.shopify-section-cart-template input').each(function () {
            $(this).attr({
                nameI: $(this).attr('name'),
            })
                .removeAttr('name');

        })
    }

    $(window).resize(function () {
        if ($(window).width() > 768) {
            $('.shopify-section-cart-template select').each(function () {
                $(this).attr({
                    nameI: $(this).attr('name'),
                })
                    .removeAttr('name');

            })

            $('.shopify-section-cart-template input').each(function () {
                $(this).attr({
                    name: $(this).attr('nameI'),
                })
                    .removeAttr('nameI');

            })

        } else {
            $('.shopify-section-cart-template input').each(function () {
                $(this).attr({
                    nameI: $(this).attr('name'),
                })
                    .removeAttr('name');

            })

            $('.shopify-section-cart-template select').each(function () {
                $(this).attr({
                    name: $(this).attr('nameI'),
                })
                    .removeAttr('nameI');

            })

        }
    })

    $('a[href="#expandmenu"]').click(function () {
        console.log($(this).text());
        if ($(this).text() == "..more") {
            $(this).text('..less');
        } else {
            $(this).text('..more');
        }
        $('.mobile-nav-2').toggleClass('hide');
    })
    $('.js-toggle-submenu').click(function () {
        $(this).toggleClass('is-active');
    })


    $(".hamburger-nav-11").click(function () {
        $(this).toggleClass('mobile-nav--close').toggleClass('mobile-nav--open');

        $('.navigation11').toggleClass('nav-closed');


    })


    //qty input function


    $('.frequency_label').text($(this).text().replace('Deliver Every', 'repeat this order'));


    $('.close-cart').click(function () {
        $('.cartdrawer').removeClass('toggle-cart');
        $('.site-header').removeClass('not-transparent');

    })

    $('#cartDrawer').click(function () {
        if (!$('.cartdrawer').hasClass('toggle-cart') && $('.js-mobile-nav-toggle').hasClass('mobile-nav--close')) {
            $('.js-mobile-nav-toggle').trigger('click');
        }
        if (!$('.cartdrawer').hasClass('toggle-cart')) {
            $('.site-header').addClass('not-transparent');
        } else {
            $('.site-header').removeClass('not-transparent');
        }
        $('.cartdrawer').toggleClass('toggle-cart');

    })

    smoothLoad();


    //transparentHeader();

    //smooth scroll if interlan link

    $('a').click(function (e) {
        if ($(this).attr('href').indexOf('#') == 0 && $(this).attr('href').length > 1 && $($(this).attr('href')).length > 0) {
            e.preventDefault();
            $('html, body').animate({
                    scrollTop: $($(this).attr('href')).offset().top
                },
                300);
            return false;
        }


    })


    $('.input__number-holder .qty').click(function () {
        var input = $(this).parents('.input__number-holder').find('input');
        var val = Number(input.val());
        console.log('value before add: ' + val);
        if ($(this).hasClass('minus')) {

            //removing from qty

            if (val > 1) {
                input.val(val - 1);
            } else if (checkForAttr(input.attr('min')) == 1) {
                input.val(input.attr('min'));
            } else {
                input.val(0);
            }
        } else {
            // adding to qty

            if (checkForAttr(input.attr('max')) == 1) {
                var max = input.attr('max');
                console.log('max: ' + max);
                if (input.val() < max) {
                    input.val(val + 1);
                    console.log('changed to: ' + val + ' + ' + 1);
                }
            } else {
                input.val(val + 1);
                console.log('changed to: ' + val + ' + ' + 1);
            }
        }
    })


    Number.prototype.formatMoney = function (c, d, t) {
        var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };


    $('.DynamicAddToCart').click(function () {
        var id = $(this).parents('.DynamicAddToCartHolder').data('id');

        if ($(this).parents('.DynamicAddToCartHolder').find('input').val().length > 0 && $(this).parents('.DynamicAddToCartHolder').find('input').val() > 0) {
            var qty = $(this).parents('.DynamicAddToCartHolder').find('input').val();

            push_to_queue(id, qty);
            Shopify.moveAlong();

            if (Shopify.queue.length == 0) {
                $(this).parents('.DynamicAddToCartHolder').prepend('<div class="cart-success width-100 margin-vertical-md"><i class="fa fa-check"></i> ' + $(this).parents('.DynamicAddToCartHolder').data('title') + ' successfully added to cart</div>');
            }
        }
    })


    $('.modal__text-content').scroll(function () {
        if (($(this).find(".rte").offset().top - $(this).find('.rte').offsetParent().offset().top) < 0) {
            $(this).find('.product-descriptions').addClass('fixed');
        } else {
            $(this).find('.product-descriptions').removeClass('fixed');
        }

    })

})




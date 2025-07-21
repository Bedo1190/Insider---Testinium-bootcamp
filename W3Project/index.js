(async function () {
  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

  const loadStyle = (href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  loadStyle('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
  loadStyle('https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css');
  loadStyle('https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css');

  await loadScript('https://code.jquery.com/jquery-3.6.0.min.js');
  await loadScript('https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.umd.js');
  await loadScript('https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js');

  setTimeout(() => {
    (($) => {
      'use strict';

      const API_URL = 'https://fakestoreapi.com/products';
      const selectors = {
        appendLocation: '#productList',
        cart: '#cartModalContent',
        carousel: '#carousel',
      };

      const classes = {
        productCard: 'product-card',
        addToCart: 'add-to-cart-btn',
        showDetails: 'show-details-btn',
        cartItem: 'cart-item',
      };

      const self = {};

      let allProducts = [];
      let productStart = 0;
      const productLimit = 5;
      let isProductLoading = false;

      self.init = () => {
        self.reset();
        self.buildCSS();
        self.injectHTML();
        self.loadPlugins();
        self.fetchProducts();
        self.setEvents();
        self.loadCartFromStorage();
      };

      self.reset = () => {
        $('.custom-style').remove();
        $('#productList, #cartModal, #carousel, #loadMoreBtn, #loading, #clearCart, #searchInput').remove();
        $(document).off('.eventListener');
      };

      self.injectHTML = () => {
        $('body').append(`
          <div id="navbar">
            <ul>
              <li><input id="searchInput" placeholder="Search..." style="padding: 8px; border-radius: 1em; border:none;" /></li>
              <li><i class="fa-solid fa-cart-shopping" id="cartIcon"></i></li>
              <li><i class="fa-solid fa-heart"></i></li>
            </ul>
          </div>
          <div class="carousel-wrapper"><div id="carousel"></div></div>
          <div id="productList"></div>
          <button id="loadMoreBtn">Load More Products</button>
          <div id="loading" style="display:none;">Loading...</div>

          <div id="cartModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; border-radius:10px; padding:20px; z-index:1000; min-width:300px; box-shadow: 0 0 10px rgba(0,0,0,0.2); flex-direction:column;">
            <h2>Cart</h2>
            <div id="cartModalContent" style="display:flex; flex-wrap:wrap; gap:10px;"></div>
            <button id="clearCart">Clear Cart</button>
            <button id="closeModal">Close</button>
          </div>
        `);
      };

      self.buildCSS = () => {
        const style = `
          <style class="custom-style">
            body {
              font-family: 'Poppins', sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin-top:0;
              background-color:white;
            }
            #productList {
              width:100%;
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
              padding: 20px;
              justify-content:space-around;
            }
            .${classes.productCard} {
              width: 200px;
              border: 1px solid #ccc;
              border-radius: 10px;
              overflow: hidden;
              padding: 10px;
              background-color: white;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              transition: transform 0.3s;
              position: relative;
            }
            .${classes.productCard}:hover {
              transform: scale(1.03);
            }
            .${classes.productCard} img {
              width: 100%;
              height: 150px;
              object-fit: contain;
            }
            .${classes.addToCart}, .${classes.showDetails} {
              padding: 8px 10px;
              background-color: #00916E;
              color: white;
              border: none;
              margin-top: 10px;
              border-radius: 5px;
              cursor: pointer;
              display: inline-block;
            }
            .${classes.addToCart}:hover, .${classes.showDetails}:hover {
              background-color: #006f51;
            }
            .${classes.cartItem} {
              width: 150px;
              border: 1px solid #666;
              padding: 8px;
              border-radius: 5px;
              background-color: #f7f7f7;
            }
            #loadMoreBtn {
              padding: 10px 20px;
              background-color: #00916E;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              margin-bottom: 20px;
            }
            #loadMoreBtn:hover {
              background-color: #006f51;
            }
            #loading {
              margin-top: 10px;
              color: #666;
            }
            .heart-icon {
              position: absolute;
              top: 10px;
              right: 10px;
              font-size: 20px;
              cursor: pointer;
              z-index: 2;
              transition: color 0.2s;
            }
            #navbar{
              width:100vw;
              display:flex;
              justify-content:flex-end;
              background-color: #00916E;
            }
            ul{
              display:flex;
              list-style:none;
              align-items:center;
              justify-content:flex-end;
              gap: 20px;
            }
            li{
              margin-right:20px;
              text-align:center;
              font-size: 2em;
            }

            .carousel .slide-user {
              padding: 10px;
              background: white;
              border-radius: 10px;
              margin: 0 10px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content:center;
              gap: 5px;
            }

            .slide-user img {
              width: 80px;
              border-radius: 50%;
            }

            .slick-prev,
            .slick-next {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              z-index: 10;
              background: #00916E;
              color: white;
              border: none;
              height: 30px;
              width: 30px;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 10px;
              border-radius: 50%;
              cursor: pointer;
            }

            .slick-prev { left: 0; }
            .slick-next { right: 0; }

            .slick-prev:before, .slick-next:before {
              content: "";
            }
            .carousel-wrapper {
              position: relative;
              max-width: 100%;
              margin: 40px auto;
            }
          </style>
        `;
        $('head').append(style);
      };

      self.loadPlugins = () => {
        if (typeof Fancybox === 'undefined') {
          console.warn('Fancybox plugin is not loaded.');
        }
        if (typeof $.fn.slick === 'undefined') {
          console.warn('Slick carousel is not loaded.');
        }
      };

      self.fetchProducts = () => {
        $.ajax({
          url: API_URL,
          method: 'GET',
          success: (products) => {
            allProducts = products;
            self.buildCarousel(products);
            self.renderNextProducts();
          },
          error: () => {
            alert('Ürünler yüklenemedi.');
          }
        });
      };

      self.renderNextProducts = () => {
        if (isProductLoading) return;
        isProductLoading = true;
        $('#loading').show();

        const nextChunk = allProducts.slice(productStart, productStart + productLimit);
        nextChunk.forEach(product => {
          const $card = self.buildProductCard(product);
          $(selectors.appendLocation).append($card.hide().fadeIn(300));
        });

        productStart += productLimit;
        $('#loading').hide();
        isProductLoading = false;

        if (productStart >= allProducts.length) {
          $('#loadMoreBtn').hide();
        }
      };

      self.buildProductCard = (product) => {
        const $card = $(`
          <div class="${classes.productCard}" data-id="${product.id}">
            <i class="fa-regular fa-heart heart-icon"></i>
            <img src="${product.image}" alt="${product.title}" />
            <h4>${product.title}</h4>
            <p>${product.price} $</p>
            <button class="${classes.addToCart}">Add to Cart</button>
            <a href="${product.image}" data-fancybox data-caption="${product.description}">
              <button class="${classes.showDetails}">Details</button>
            </a>
          </div>
        `);
        return $card;
      };

      self.setEvents = () => {
        $(document).on('click.eventListener', `.${classes.addToCart}`, function () {
          const $productCard = $(this).closest(`.${classes.productCard}`);
          const id = $productCard.data('id');
          const title = $productCard.find('h4').text();
          const price = $productCard.find('p').text();
          const img = $productCard.find('img').attr('src');

          const $item = $(`
            <div class="${classes.cartItem}" data-id="${id}">
              <img src="${img}" width="50" height="50"/>
              <p>${title}</p>
              <span>${price}</span>
            </div>
          `).hide().slideDown(200);

          $(selectors.cart).append($item);
          self.saveToStorage(id, title, price, img);
        });

        $(document).on('click', '#clearCart', () => {
          $(selectors.cart).empty();
          localStorage.removeItem('cartItems');
        });

        $(document).on('click', '#loadMoreBtn', () => {
          self.renderNextProducts();
        });

        $(document).on('input', '#searchInput', function () {
          clearTimeout(window._searchTimer);
          const query = $(this).val().toLowerCase();

          window._searchTimer = setTimeout(() => {
            $('#productList').empty();
            productStart = 0;

            const filtered = !query
              ? allProducts
              : allProducts.filter(p => p.title.toLowerCase().includes(query));

            filtered.slice(0, productLimit).forEach(product => {
              const $card = self.buildProductCard(product);
              $(selectors.appendLocation).append($card.hide().fadeIn(300));
            });

            productStart = productLimit;

            if (productStart >= filtered.length) {
              $('#loadMoreBtn').hide();
            } else {
              $('#loadMoreBtn').show().off().on('click', () => {
                const nextChunk = filtered.slice(productStart, productStart + productLimit);
                nextChunk.forEach(product => {
                  const $card = self.buildProductCard(product);
                  $(selectors.appendLocation).append($card.hide().fadeIn(300));
                });
                productStart += productLimit;

                if (productStart >= filtered.length) {
                  $('#loadMoreBtn').hide();
                }
              });
            }
          }, 400);
        });

        $(document).on('click', '.heart-icon', function () {
          const $icon = $(this);
          const isLiked = $icon.hasClass('fa-solid');
          if (isLiked) {
            $icon.removeClass('fa-solid').addClass('fa-regular').css('color', '');
          } else {
            $icon.removeClass('fa-regular').addClass('fa-solid').css('color', 'red');
          }
        });

        $(document).on('mouseenter', 'li', function () {
          $(this).css({
            transform: 'scale(1.1)',
            color: '#f0f0f0',
            transition: 'transform 0.2s ease'
          });
        }).on('mouseleave', 'li', function () {
          $(this).css({
            transform: 'scale(1)',
            color: '',
          });
        });

        $(document).on('click', '#cartIcon', () => {
          $('#cartModal').fadeIn(200);
        });

        $(document).on('click', '#closeModal', () => {
          $('#cartModal').fadeOut(200);
        });
      };

      self.saveToStorage = (id, title, price, img) => {
        const current = JSON.parse(localStorage.getItem('cartItems')) || [];
        current.push({ id, title, price, img });
        localStorage.setItem('cartItems', JSON.stringify(current));
      };

      self.loadCartFromStorage = () => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        items.forEach((item) => {
          const $item = $(`
            <div class="${classes.cartItem}" data-id="${item.id}">
              <img src="${item.img}" width="50" height="50"/>
              <p>${item.title}</p>
              <span>${item.price}</span>
            </div>
          `);
          $(selectors.cart).append($item);
        });
      };

      self.buildCarousel = (products) => {
        const $carousel = $(selectors.carousel);
        products.slice(0, 5).forEach(p => {
          const $slide = $(`<div class=" slide-user">
              <img src="${p.image}" alt="${p.title}" style="height:10em;"/>
              <h3>${p.title}<h3/>
            </div>`);
          $carousel.append($slide);
        });
        $carousel.slick?.({
          slidesToShow: 3,
          autoplay: true,
          autoplaySpeed: 1500,
          prevArrow: '<button class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
          nextArrow: '<button class="slick-next"><i class="fas fa-chevron-right"></i></button>',
          responsive: [
            {
              breakpoint: 500,
              settings: {
                slidesToShow: 1
              }
            }
          ]
        });
      };

      $(document).ready(self.init);
    })(jQuery);
  }, 100);
})();

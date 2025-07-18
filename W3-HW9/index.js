    function showSkeletonCards(count = 5) {
      $('.card-container').empty();
      for (let i = 0; i < count; i++) {
        $('.card-container').append('<div class="skeleton-card"></div>');
      }
    }

    function fetchUsers() {
      const totalUsers = 10; 
      showSkeletonCards(5);

      $.ajax({
        url: `https://randomuser.me/api/?results=${totalUsers}`,
        dataType: 'json',
        success: function(data) {
          $('.card-container').empty();
          if ($('.slider').hasClass('slick-initialized')) {
            $('.slider').slick('unslick');
          }
          $('.slider').empty();

          data.results.slice(0,5).forEach(user => {
            const card = $(`
              <div class="user-card">
                <div class="basic">
                  <a href="${user.picture.large}" data-fancybox="gallery" data-caption="${user.name.first} ${user.name.last} - ${user.email} <br> phone: ${user.phone} <br> country: ${user.location.country} <br> city: ${user.location.city} <br> postcode: ${user.location.postcode}">
                    <img src="${user.picture.medium}" alt="User">
                  </a>
                  <h4>${user.name.first} ${user.name.last}</h4>
                  <p>${user.email}</p>
                </div>
                <div class="details">
                  <p><strong>Phone:</strong> ${user.phone}</p>
                  <p><strong>Country:</strong> ${user.location.country}</p>
                  <p><strong>City:</strong> ${user.location.city}</p>
                  <p><strong>Post Code:</strong> ${user.location.postcode}</p>
                </div>
              </div>
            `);

            $('.card-container').append(card);
            card.slideDown(400).fadeTo(400, 1);

            card.hover(function () {
              $(this).toggleClass('hovered');
            });

            card.on('click', function () {
              $('.user-card').not(this).removeClass('expanded');
              $(this).toggleClass('expanded');
            });
          });

          data.results.slice(5,10).forEach(user => {
            const slide = $(`
              <div class="slide-user">
                <img src="${user.picture.thumbnail}" />
                <p>${user.name.first}</p>
              </div>
            `);
            $('.slider').append(slide);
          });

          $('.slider').slick({
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
        }
      });
    }

    $(document).ready(function () {
      $('.btn-load').on('click', function () {
        $(this).addClass('shake');
        setTimeout(() => $(this).removeClass('shake'), 500);
        fetchUsers();
      });

      fetchUsers();
    });

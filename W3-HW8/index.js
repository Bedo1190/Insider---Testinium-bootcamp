  let start = 0;
  const limit = 5;
  let isLoading = false;

  function loadPosts() {
    if (isLoading) return;
    isLoading = true;
    $("#loading").show();
    $("#error").text("");

    $.get(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
      .done(function(posts) {
        posts.forEach(post => {
          $("#postContainer").append(`
            <div class="card">
              <img src="https://placehold.co/400x200/?text=Post+${post.id}" alt="placeholder image">
              <div class="card-body">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
              </div>
            </div>
          `);
        });
        start += limit;
      })
      .fail(function() {
        $("#error").text("Posts can not be loaded please try again later.");
      })
      .always(function() {
        $("#loading").hide();
        isLoading = false;
      });
  }

  $(document).ready(function() {
    loadPosts();

    $(window).on("scroll", function() {
      if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
        loadPosts();
      }
    });

    $(document).on("mouseenter", ".card", function () {
      const $card = $(this);
      $card.css("transform", "translateY(-5px)");
      $card.css("box-shadow", "0 8px 16px rgba(0,0,0,0.2)");

      const timeoutId = setTimeout(() => {
        if ($card.find(".read-more-btn").length === 0) {
          $card.find(".card-body").append(`
            <button class="read-more-btn">Read More >></button>
          `);
        }
      }, 1000); 

      $card.data("hoverTimeout", timeoutId);
    });

    $(document).on("mouseleave", ".card", function () {
      const $card = $(this);
      $card.css("transform", "translateY(0)");
      $card.css("box-shadow", "0 4px 8px rgba(0,0,0,0.1)");

      clearTimeout($card.data("hoverTimeout")); 
      $card.find(".read-more-btn").remove(); 
    });
    $(window).on("scroll", function () {
    if ($(this).scrollTop() > 200) {
        $("#goTop-btn").fadeIn();
    } else {
        $("#goTop-btn").fadeOut();
    }
    });

    $("#goTop-btn").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    });

  });

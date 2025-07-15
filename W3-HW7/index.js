    let studentData = JSON.parse(localStorage.getItem("students")) || [
      { name: "Ali", class: "10A" },
      { name: "Ayşe", class: "9B" },
      { name: "Mehmet", class: "11C" }
    ];

    function saveToLocalStorage() {
      localStorage.setItem("students", JSON.stringify(studentData));
    }

    function renderCards(filter = "") {
      const container = $('#cardContainer').empty();
      studentData.forEach((s, idx) => {
        const fullString = (s.name + " " + s.class).toLowerCase();
        if (fullString.includes(filter.toLowerCase())) {
          const $card = $(`
            <div class="student-card" data-index="${idx}">
              <button class="delete-btn" title="Sil"><i class="fa-solid fa-trash"></i></button>
              <h3>${s.name}</h3>
              <p>Sınıf: ${s.class}</p>
            </div>
          `);
          container.append($card);
        }
      });
    }

    $('#addStudentBtn').click(() => {
      const name = $('#nameInput').val().trim();
      const number = $('#classNumber').val();
      const letter = $('#classLetter').val();
      if (!name || !number || !letter) return;
      const cls = `${number}${letter.toUpperCase()}`;
      studentData.push({ name, class: cls });
      saveToLocalStorage();
      renderCards($('#searchInput').val());
      $('#nameInput').val('');
      $('#classNumber').val('');
      $('#classLetter').val('');
    });

    $('#cardContainer').on('click', '.delete-btn', function(e) {
      e.stopPropagation();
      const idx = $(this).closest('.student-card').data('index');
      studentData.splice(idx, 1);
      saveToLocalStorage();
      renderCards($('#searchInput').val());
    });

    $('#cardContainer').on('click', '.student-card', function() {
      $(this).toggleClass('clicked');
    });

    $('#cardContainer').on('mouseenter', '.student-card', function () {
      $(this).css({
        "box-shadow": "0 6px 12px rgba(0,0,0,0.15)",
        "transform": "scale(1.02)"
      });
    });

    $('#cardContainer').on('mouseleave', '.student-card', function () {
      $(this).css({
        "box-shadow": "0 2px 6px rgba(0,0,0,0.08)",
        "transform": "scale(1)"
      });
    });

    $('#searchInput').on('input', function () {
      const query = $(this).val();
      renderCards(query);
    });

    renderCards();

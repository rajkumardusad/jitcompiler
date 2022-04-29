$(document).ready(function () {
  // Toggle navigation menu
  $(".menu-icon").click(function () {
    $(".sm-nav-menu").toggle();
    if ($(".sm-nav-menu").css("display") == "block") {
      $(this).removeClass("fa-bars");
      $(this).addClass("fa-times");
    } else {
      $(this).removeClass("fa-times");
      $(this).addClass("fa-bars");
    }
  });

  // Select theme
  $(".theme").click(function () {
    if (('theme' in localStorage)) {
      // Remove theme icon
      $(".theme-icon").removeClass((localStorage.theme == 'light' ? 'fa-moon' : 'fa-sun'));
      // Set theme
      localStorage.theme = (localStorage.theme == 'light' ? 'dark' : 'light');
    } else {
      // Set dark theme
      localStorage.theme = 'dark';
    }

    if (localStorage.theme == "dark") {
      // Add theme class
      document.documentElement.classList.add("dark");
      if (typeof editor !== 'undefined') {
        editor.setTheme('ace/theme/monokai');
      }
      $("meta[name='theme-color']").attr("content", "#ffffff");
    } else {
      // Remove theme class
      document.documentElement.classList.remove("dark");
      if (typeof editor !== 'undefined') {
        editor.setTheme('ace/theme/chrome');
        $("meta[name='theme-color']").attr("content", "#171717");
      }
    }
    // Change theme icon
    $(".theme-icon").addClass((localStorage.theme == 'light' ? 'fa-moon' : 'fa-sun'));
  });

  // Show dropdown menu
  $(".dropdown-menu-icon").click(function () {
    if ($(this).children(".dropdown-menu-container").css("display") == "none") {
      $(this).children(".dropdown-menu-container").css("display", "block");
    }
  });

  // Hide dropdown menu
  $(".close-dropdown-menu").click(function (e) {
    e.stopPropagation();
    if ($(this).parent(".dropdown-menu-container").css("display") != "none") {
      $(this).parent(".dropdown-menu-container").css("display", "none");
    }
  });
});

// Set default theme
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
  // Change theme icon
  $(".theme-icon").removeClass("fa-moon");
  $(".theme-icon").addClass("fa-sun");
  if (typeof editor !== 'undefined') {
    editor.setTheme('ace/theme/monokai');
  }
  $("meta[name='theme-color']").attr("content", "#171717");
  // Set dark theme
  localStorage.theme = 'dark';
} else {
  document.documentElement.classList.remove('dark');
  // Change theme icon
  $(".theme-icon").removeClass("fa-sun");
  $(".theme-icon").addClass("fa-moon");
  if (typeof editor !== 'undefined') {
    editor.setTheme('ace/theme/chrome');
  }
  // Set default theme
  localStorage.theme = 'light';
  $("meta[name='theme-color']").attr("content", "#ffffff");
}

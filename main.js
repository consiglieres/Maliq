// Slooth scrolling and active link highlighting
$(document).ready(function () {
	const headerOffset = 80;

	$('a.navlink[href^="#"]').click(function (e) {
		if (this.hash !== "") {
			e.preventDefault();

			const hash = this.hash;

			$("html, body").animate(
				{
					scrollTop: $(hash).offset().top - headerOffset,
				},
				800,
			);

			// Обновляем URL
			if (history.pushState) {
				history.pushState(null, null, hash);
			} else {
				window.location.hash = hash;
			}
		}
	});

	$(window).scroll(function () {
		const scrollPos = $(document).scrollTop() + headerOffset;

		$("section[id]").each(function () {
			const sectionTop = $(this).offset().top;
			const sectionBottom = sectionTop + $(this).outerHeight();

			// Если секция в зоне видимости
			if (scrollPos >= sectionTop - 100 && scrollPos <= sectionBottom) {
				const id = $(this).attr("id");

				$(".navlink").removeClass("active");

				$('a[href="#' + id + '"]').addClass("active");
			}
		});
	});

	setTimeout(function () {
		$(window).trigger("scroll");
	}, 100);
});

// visible menu
$(document).ready(function () {
	$(".button-list").on("click", function () {
		$(this).next(".paint-menu").slideToggle(200);
	});
});

// Currency conversion between RUB and USD

$(document).ready(function () {
	const exchangeRate = 70; // Курс 70 руб за 1 доллар

	// Функция форматирования чисел
	function formatNumber(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}

	// Функция конвертации цены
	function convertPrice(priceRub, toCurrency) {
		if (toCurrency === "usd") {
			// Конвертируем в доллары
			const priceUsd = priceRub / exchangeRate;
			// Округляем до 2 знаков после запятой
			return Math.round(priceUsd * 100) / 100;
		} else {
			// Возвращаем рубли
			return priceRub;
		}
	}

	// Функция обновления отображения цен
	function updatePrices(currency) {
		// Обновляем текст кнопок валют
		$(".currency-btn").removeClass("active");
		$(`.currency-btn[data-currency="${currency}"]`).addClass("active");

		// Обновляем старые цены
		$(".old-price").each(function () {
			const priceRub = parseInt($(this).data("price-rub"));
			const convertedPrice = convertPrice(priceRub, currency);
			const oldPriceText = $(this).find("s");

			if (currency === "usd") {
				oldPriceText.text("$" + formatNumber(convertedPrice.toFixed(2)));
			} else {
				oldPriceText.text(formatNumber(convertedPrice) + " ₽");
			}
		});

		// Обновляем текущие цены
		$(".current-price").each(function () {
			const priceRub = parseInt($(this).data("price-rub"));
			const convertedPrice = convertPrice(priceRub, currency);

			if (currency === "usd") {
				$(this).text("$" + formatNumber(convertedPrice.toFixed(2)));
			} else {
				$(this).text(formatNumber(convertedPrice) + " ₽");
			}
		});
	}

	// Обработчик клика на кнопки валют
	$(".currency-btn").click(function () {
		const currency = $(this).data("currency");
		updatePrices(currency);

		// Сохраняем выбранную валюту в localStorage
		localStorage.setItem("preferredCurrency", currency);
	});

	// Загружаем сохраненную валюту или устанавливаем рубли по умолчанию
	const savedCurrency = localStorage.getItem("preferredCurrency") || "rub";
	updatePrices(savedCurrency);

	// Инициализируем активную кнопку
	$(`.currency-btn[data-currency="${savedCurrency}"]`).addClass("active");
});

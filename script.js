Number.prototype.toHHMMSS = function () {
	var sec_num = parseInt(this, 10)
	var hours = Math.floor(sec_num / 3600)
	var minutes = Math.floor(sec_num / 60) % 60
	var seconds = sec_num % 60

	return [hours, minutes, seconds]
		.map(v => v < 10 ? "0" + v : v)
		.filter((v, i) => v !== "00" || i > 0)
		.join(":")
}

$(window).on("load", function () {
	$("#input").on("change keyup paste", input_TextChanged);
	$("#select").on("change", selection_Changed);
	$("#select").on("mousedown", "option",
		function (e) {
			e.preventDefault();
			this.parentElement.focus();
			this.selected = !this.selected;
			$("#select").trigger("change");
			return false;
		}
	);
});

function input_TextChanged(e) {
	var input = $(this).val().split(/\r?\n/);
	var lastLine = null;
	var $select = $("#select");
	$select.empty();
	for (var line of input) {
		var lineSplit = line.split(' ', 2);

		if (lineSplit.length == 2) {
			var timestamp = 0;
			timestamp = lineSplit[0].split(':').reduce((acc, time) => (60 * acc) + +time);

			if (lastLine != null && timestamp - lastLine[0] > 0) {
				var duration = (timestamp - lastLine[0]).toHHMMSS();
				$select.append($("<option/>", { text: duration + " " + lastLine[1], selected: true }));
			}
			lastLine = [timestamp, lineSplit[1]];
		}
	}

	if (lastLine != null) {
		$select.append($("<option/>", { text: "XX:XX:XX " + " " + lastLine[1], selected: true }));
	}
	$("#select").trigger("change");
}

function selection_Changed() {
	var output = [];
	var totalTimespan = 0;
	for (var item of this) {
		if (item.selected) {
			output.push(totalTimespan.toHHMMSS() + " " + item.value.split(" ", 2)[1]);
			totalTimespan += item.value.split(" ", 1)[0].split(':').reduce((acc, time) => (60 * acc) + +time);
		}
	}
	$("#output").val(output.join('\n'));
}
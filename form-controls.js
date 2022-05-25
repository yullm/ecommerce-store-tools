function createSelectControl(controlName, options) {
  let control = $("<select/>", {
    name: controlName,
    id: controlName,
    class: "selection-control",
  });

  for (let i = 0; i < options.length; i++) {
    let option = $("<option/>", {
      value: options[i].value,
      label: options[i].label,
    });
    option.text(options[i].label);
    control.append(option);
  }

  return control;
}

function createMultiButtonControl(controlName, options) {
  let control = $("<div/>", {
    id: controlName + "-control",
    class: "multi-button-control",
  });
  let valueInput = $("<input/>", {
    type: "hidden",
    name: controlName,
    id: controlName,
    class: "selection-control",
  });
  control.append(valueInput);

  //set the size options to that of our recieved data
  for (let i = 0; i < options.length; i++) {
    let optionButton = $("<div/>", {
      class: "selection-control selection-button",
    });
    if (options[i].id) optionButton.attr("id", options[i].id);
    if (options[i].class) optionButton.addClass(options[i].class);
    if (!options[i].label) options[i].label = options[i].value;
    optionButton.html(options[i].label);
    control.append(optionButton);
    if (i === 0) {
      valueInput.val(options[i].value);
      optionButton.addClass("selected");
    }
    optionButton.on("click", function () {
      valueInput.val(options[i].value).change();
      //control.change();
      control.find(".selection-button").removeClass("selected");
      optionButton.addClass("selected");
    });
  }
  return control;
}

function createMultiButtonControlImage(controlName, options) {
  let control = $("<div/>", {
    id: controlName + "-control",
    class: "multi-button-control",
  });
  let valueInput = $("<input/>", {
    type: "hidden",
    name: controlName,
    id: controlName,
    class: "selection-control",
  });
  control.append(valueInput);

  //set the size options to that of our recieved data
  for (let i = 0; i < options.length; i++) {
    let optionButton = $("<div/>", {
      class: "selection-control selection-button",
    });
    if (options[i].id) optionButton.attr("id", options[i].id);
    if (options[i].class) optionButton.addClass(options[i].class);
    if (!options[i].label) options[i].label = options[i].value;
    optionButton.html(`<img src="${options[i].image}">`);
    control.append(optionButton);
    if (i === 0) {
      valueInput.val(options[i].value);
      optionButton.addClass("selected");
    }
    optionButton.on("click", function () {
      valueInput.val(options[i].value).change();
      //control.change();
      control.find(".selection-button").removeClass("selected");
      optionButton.addClass("selected");
    });
  }
  return control;
}

function createColourControl(controlName, colours, displayLabel = "Colour:") {
  /* colour object schema example 
    {
        label: "Blue",
        value: "blue",
        background: "/wp-content/uploads/2020/12/kuddly-hoodie-blue-icon.jpg",
        soldOut: true,
        color: '#ccc'
    } */
  let displayRow = $("<div/>");
  let colourDisplay = $("<div/>", { class: "colour-display" });
  displayRow.append(colourDisplay);
  let colourControl = $("<div/>", {
    id: controlName + "-control",
    class: "colour-control",
  });
  let input = $("<input/>", {
    type: "hidden",
    id: controlName,
    name: controlName,
  });
  colourControl.append(input);
  for (let i in colours) {
    let colourWrapper = $("<div/>", { class: "colour-wrapper" });
    let colourButton = $("<div/>", { class: "colour-button" });
    colourButton.css({
      "background-color": colours[i].color,
    });
    if (colours[i].background) {
      colourButton.css({
        "background-image": "url('" + colours[i].background + "')",
      });
    }

    let colourLabel = $("<div/>", { class: "colour-label" }).text(
      colours[i].label
    );

    if (colours[i].soldOut == true) {
      colourButton.append($("<div>Sold Out</div>"));
    } else {
      colourButton.on("click", () => {
        input.val(colours[i].value).change();
        //colourControl.change();
        colourControl.find(".selected").removeClass("selected");
        colourButton.addClass("selected");
        colourWrapper.addClass("selected");
        let label = colours[i].hasOwnProperty(`${cartLanguage}-label`)
          ? colours[i][`${cartLanguage}-label`]
          : colours[i].label;
        colourDisplay.html(`${displayLabel} <span>${label}</span>`);
      });
    }

    colourWrapper.append(colourButton, colourLabel);
    colourControl.append(colourWrapper);

    if (i == 0) {
      input.val(colours[i].value);
      colourButton.addClass("selected");
      colourWrapper.addClass("selected");
      let label = colours[i].hasOwnProperty(`${cartLanguage}-label`)
        ? colours[i][`${cartLanguage}-label`]
        : colours[i].label;
      colourDisplay.html(`${displayLabel} <span>${label}</span>`);
    }

    let overlay = $("<div/>", { class: "colour-overlay" }).html(
      '<i class="fas fa-check"></i>'
    );
    colourWrapper.append(overlay);
  }

  return {
    colourControl: colourControl,
    display: displayRow,
  };
}

//Adds shoe sizes to select increasing by half sizes between two values
function populateShoeSizeControl(control, startingValue, endValue) {
  let promptText =
    typeof "cartLanguage" !== "undefined" && cartLanguage == "de"
      ? "Größe auswählen:"
      : "Select Size:";
  let prompt = $(`<option value="" disabled selected>${promptText}</option>`);
  control.append(prompt);

  if (Array.isArray(startingValue)) {
    let valueArrayCounter = 0;
    startingValue.forEach((element) => {
      let option = $("<option/>", {
        value: endValue[valueArrayCounter++],
        label: element,
      });
      option.text(element);
      control.append(option);
    });
  } else {
    let currentValue = parseFloat(startingValue);
    while (currentValue <= endValue) {
      let option = $("<option/>", {
        value: currentValue.toString().replace(".", "-"),
        label: currentValue,
      });
      option.text(currentValue);
      control.append(option);
      currentValue += 0.5;
    }
  }
}

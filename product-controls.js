"use strict";

var productInfo;

$.getJSON("https://loww.co/products/kuddly/product-info.json", (data) => {
  productInfo = data;
});

//change options object
function createProductControl(productID, suffix, callback, override) {
  //return object with different components of control and one variable that has it all together as one
  if (productInfo == undefined) {
    $.getJSON(
      "https://loww.co/products/kuddly/product-info.json",
      function (data) {
        productInfo = data;
        return callback(distribute());
      }
    );
  } else return callback(distribute());

  function distribute() {
    if (productInfo.hasOwnProperty(productID.toString())) {
      let product = productInfo[productID.toString()];
      if (product.hasOwnProperty("control-type")) {
        switch (product["control-type"].toLowerCase()) {
          case "hoodie":
            return createHoodieControl(product, suffix, override);
            break;
          case "blanket-base":
            return createBaseBlanketControl(product, suffix);
            break;
          case "slides":
            return createSlidesControl(product, suffix);
            break;
          case "pillow":
            return createPillowControl(product, suffix);
            break;
          case "pillowcase":
            return createPillowcaseControl(product, suffix);
            break;
          default:
            return undefined;
        }
      }
    }
  }
}

function createHoodieControl(product, suffix, override) {
  let colourSet =
    override != undefined && override.hasOwnProperty("colours")
      ? override.colours
      : product.colours;
  let label = cartLanguage != "de" ? "Colour:" : "Farbe:";

  let colourControls = createColourControl(
    product["input-prefix"] + "-" + suffix,
    colourSet,
    label
  );

  let displayRow = $("<div/>", { class: "selection-row" });
  displayRow.append(colourControls.display);

  let controlRow = $("<div/>", { class: "selection-row" });
  controlRow.append(colourControls.colourControl);

  let wrapper = $("<div/>", {
    id: product["control-prefix"] + "-control-" + suffix,
    class: product["control-prefix"] + "-control-wrapper",
  });
  wrapper.addClass("product-control-wrapper");
  wrapper.append(displayRow, controlRow);

  return {
    display: colourControls.display,
    control: colourControls.colourControl,
    element: wrapper,
  };
}

function createBaseBlanketControl(product, suffix) {
  let label = cartLanguage != "de" ? "Colour:" : "Farbe:";
  let colourControls = createColourControl(
    product["input-prefix"] + "-" + suffix,
    product.colours,
    label
  );

  let displayRow = $("<div/>", { class: "selection-row" });
  displayRow.append(colourControls.display);

  let controlRow = $("<div/>", { class: "selection-row" });
  controlRow.append(colourControls.colourControl);

  let wrapper = $("<div/>", {
    id: product["control-prefix"] + "-control-" + suffix,
    class: product["control-prefix"] + "-control-wrapper",
  });
  wrapper.addClass("product-control-wrapper");
  wrapper.append(displayRow, controlRow);

  return {
    display: colourControls.display,
    control: colourControls.colourControl,
    element: wrapper,
  };
}

function createSlidesControl(product, suffix) {
  let wrapper = $("<div/>", {
    id: product["control-prefix"] + "-control-" + suffix,
    class: product["control-prefix"] + "-control-wrapper",
  });
  wrapper.addClass("product-control-wrapper");

  let controlRow = $("<div/>", {
    class:
      "selection-row " +
      product["control-prefix"] +
      "-control-section-container",
  });
  wrapper.append(controlRow);

  let sizeSection = $("<div/>", {
    class:
      product["control-prefix"] +
      "-size-section " +
      product["control-prefix"] +
      "-control-section",
  });
  let colourSection = $("<div/>", {
    class:
      product["control-prefix"] +
      "-colour-section " +
      product["control-prefix"] +
      "-control-section",
  });
  controlRow.append(sizeSection, colourSection);

  //size

  let sizeLabelText = cartLanguage != "de" ? "Size:" : "Größe:";

  let sizeDisplayRow = $("<div/>", {
    class: "selection-row " + product["control-prefix"] + "-size-display-row",
  });
  let sizeLabel = $(`<div class="size-display">${sizeLabelText}</div>`);
  sizeDisplayRow.append(sizeLabel);

  let sizeControlRow = $("<div/>", {
    class: "selection-row " + product["control-prefix"] + "-size-control-row",
  });
  let sizeControl = $("<select/>", {
    id: product["size-prefix"] + "-" + suffix,
    name: product["size-prefix"] + "-" + suffix,
    class: "selection-control " + product["size-prefix"] + "-control",
    required: "",
  });
  if (cartLanguage == "de") {
    populateShoeSizeControl(
      sizeControl,
      product["de-min-size"] ? product["de-min-size"] : product["min-size"],
      product["de-max-size"] ? product["de-max-size"] : product["max-size"]
    );
  } else {
    populateShoeSizeControl(
      sizeControl,
      product["min-size"],
      product["max-size"]
    );
  }

  sizeControlRow.append(sizeControl);

  sizeControl.on("change", function () {
    sizeLabel.text(
      `${sizeLabelText} ` + sizeControl.val().toString().replace("-", ".")
    );
  });

  sizeSection.append(sizeDisplayRow, sizeControlRow);

  //colour

  let colourLabel = cartLanguage != "de" ? "Colour:" : "Farbe:";

  let colourControls = createColourControl(
    product["colour-prefix"] + "-" + suffix,
    product.colours,
    colourLabel
  );

  let colourDisplayRow = $("<div/>", {
    class: "selection-row " + product["control-prefix"] + "-colour-display-row",
  });
  colourDisplayRow.append(colourControls.display);

  let colourControlRow = $("<div/>", {
    class: "selection-row " + product["control-prefix"] + "-colour-control-row",
  });
  colourControlRow.append(colourControls.colourControl);

  colourSection.append(colourDisplayRow, colourControlRow);

  //size adjust

  var colourInput = colourControls.colourControl.find("input");
  colourInput.on("change", function () {
    let colourObj =
      product.colours[
        product.colours.findIndex((c) => c.value == $(this).val())
      ];

    $(sizeControl)
      .find("option")
      .each(function () {
        if (Number.parseFloat($(this).val())) $(this).removeAttr("disabled");
      });
    if (cartLanguage == "de") {
      if (colourObj.hasOwnProperty("de-max-size")) {
        if (
          sizeControl.val() &&
          parseFloat(sizeControl.val().replace("-", ".")) >
            Number.parseFloat(colourObj["de-max-size"])
        ) {
          sizeControl.val("");
          sizeLabel.text("Size:");
        }
        $(sizeControl)
          .find("option")
          .each(function () {
            if (
              parseFloat($(this).val().replace("-", ".")) >
              Number.parseFloat(colourObj["de-max-size"])
            )
              $(this).attr("disabled", "");
          });
      } else if (colourObj.hasOwnProperty("max-size")) {
        if (
          sizeControl.val() &&
          parseFloat(sizeControl.val().replace("-", ".")) >
            Number.parseFloat(colourObj["max-size"])
        ) {
          sizeControl.val("");
          sizeLabel.text("Size:");
        }
        $(sizeControl)
          .find("option")
          .each(function () {
            if (
              parseFloat($(this).val().replace("-", ".")) >
              Number.parseFloat(colourObj["max-size"])
            )
              $(this).attr("disabled", "");
          });
      }
    } else {
      if (colourObj.hasOwnProperty("max-size")) {
        if (
          sizeControl.val() &&
          parseFloat(sizeControl.val().replace("-", ".")) >
            Number.parseFloat(colourObj["max-size"])
        ) {
          sizeControl.val("");
          sizeLabel.text("Size:");
        }
        $(sizeControl)
          .find("option")
          .each(function () {
            if (
              parseFloat($(this).val().replace("-", ".")) >
              Number.parseFloat(colourObj["max-size"])
            )
              $(this).attr("disabled", "");
          });
      }
    }
  });

  return {
    element: wrapper,
  };
}

function createPillowControl(product, suffix) {
  let wrapper = $("<div/>", {
    id: product["control-prefix"] + "-control-" + suffix,
    class: product["control-prefix"] + "-control-wrapper",
  });
  wrapper.addClass("product-control-wrapper");

  let control = createMultiButtonControl(
    product["input-prefix"] + "-" + suffix,
    product.sizes
  );
  wrapper.append(control);

  return {
    element: wrapper,
  };
}

function createPillowcaseControl(product, suffix) {
  let wrapper = $("<div/>", {
    id: product["control-prefix"] + "-control-" + suffix,
    class: product["control-prefix"] + "-control-wrapper",
  });
  wrapper.addClass("product-control-wrapper");

  let sizeRow = $("<div/>", { class: "selection-row" });
  let sizeControl = createMultiButtonControl(
    product["size-prefix"] + "-" + suffix,
    product.sizes
  );
  sizeRow.append(sizeControl);

  let colourControls = createColourControl(
    product["colour-prefix"] + "-" + suffix,
    product.colours
  );

  let colourDisplayRow = $("<div/>", { class: "selection-row" });
  colourDisplayRow.append(colourControls.display);

  let colourControlRow = $("<div/>", { class: "selection-row" });
  colourControlRow.append(colourControls.colourControl);

  wrapper.append(sizeRow, colourDisplayRow, colourControlRow);

  return {
    element: wrapper,
  };
}

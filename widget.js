let widget;
let widgetData;

$(()=>{
    loadCSS();
    createWidget();
    $.getJSON("./widget/dataset.json",(json)=>{
        widgetData = json;
    });
});

function loadCSS(){
    $("head").append('<link href="' + 'https://loww.co/recent-purchase-widget/widget.css' + '" rel="stylesheet" type="text/css" />');
}

function createWidget(){
    widget = $('<div/>',{id:'recent-purchase-widget'});
    widget.data('isDown', true);

    let imageWrapper = $('<div/>', {id:'recent-purchase-image-wrapper'});
    let image = $('<img/>', {id:'recent-purchase-image', src:'widget/widget.jpg'});
    imageWrapper.append(image);
    
    let contentWrapper = $('<div/>',{id:'recent-purchase-content-wrapper'});

    let firstRow = $(`<div id="widget-row-1" class="widget-row"><span id="widget-name"></span> ${inText()} <span id="widget-city"></span> ${boughtText()}</div>`);
    let secondRow = $(`<div id="widget-row-2" class="widget-row"><span id="widget-product"></span>, <span id="widget-price"></span></div>`);
    let thirdRow = $(`<div id="widget-row-3" class="widget-row">${voucherText()}: <span id="widget-voucher"></span></div>`);
    let fourthRow = $(`${timeText()}`);

    contentWrapper.append(firstRow,secondRow,thirdRow,fourthRow);

    let closeWrapper = $('<div/>',{id:'recent-purchase-close-wrapper'});
    let closeBut = $('<i/>',{class:'fas fa-times'});
    closeWrapper.append(closeBut);

    closeBut.on('click',()=>{
        clearTimeout(widget.data('timeout'));
        widgetTimeout();
    });

    widget.append(imageWrapper,contentWrapper,closeWrapper);

    $('body').append(widget);
    widget.data('timeout', setTimeout(widgetTimeout, 5000));

    function inText(){
        let text = "in";
        switch(cartLanguage){
            case "de":
                text = "aus";
                break;
        }
        return text;
    }

    function boughtText(){
        let text = "just bought";
        switch(cartLanguage){
            case "de":
                text = "kaufte gerade";
                break;
        }
        return text;
    }

    function voucherText(){
        let text = "using voucher";
        switch(cartLanguage){
            case "de":
                text = "mit dem Gutschein";
                break;
        }
        return text;
    }

    function timeText(){
        let text = '<div id="widget-row-4" class="widget-row"><span id="widget-time"></span> min. ago.</div>';
        switch(cartLanguage){
            case "de":
                text = `<div id="widget-row-4" class="widget-row">Vor <span id="widget-time"></span> Minuten ...</div>`;
                break;
        }
        return text;
    }
}

function widgetTimeout(){
    if(widget.data('isDown') === true){
        fillInWidget();
        widget.data('isDown',false);
        widget.animate({
            bottom: '20px'
        },250,()=>{            
            widget.data('timeout', setTimeout(widgetTimeout,  Math.floor(Math.random() * (10000 - 5000) + 5000) ));
        });
    }else{
        widget.data('isDown',true);
        widget.animate({
            bottom: '-100px'
        },250,()=>{            
            widget.data('timeout', setTimeout(widgetTimeout, Math.floor(Math.random() * (10000 - 5000) + 5000) ));
        });
    }
}

function fillInWidget(){
    if(widgetData == undefined){
        $.getJSON("./widget/dataset.json",(json)=>{
            widgetData = json;
            populate();
        });
    }else populate();

    function populate(){
        $('#widget-name').text(getRandomDataValue('people'));
        $('#widget-city').text(getRandomDataValue('cities'));

        let product = getRandomDataValue('items');
        $('#widget-product').text(product.name);
        switch(cartLanguage){
            case 'de':
                $('#widget-price').text(`${product.price} €`);
                break;
            default:
                $('#widget-price').text('£'+product.price);
        }
        $('#widget-voucher').text(product.voucher);

        $('#widget-time').text(Math.floor(Math.random() * 2) + 1);
    }
}

function getRandomDataValue(key){
    return widgetData[key][Math.floor(Math.random() * widgetData[key].length)];
}
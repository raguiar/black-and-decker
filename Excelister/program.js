﻿
function doTheWork() {
    
    // change button look to say it has started working   
    document.getElementById("botao").classList.remove("btn-default");
    document.getElementById("botao").classList.add("btn-info");
    document.getElementById("botao").value = ".. Em execução ..";
    
    // read config.xlsx
    configure();
    
    // process data according to configuration
    process(getData());
    
    // inform the user that work has finished
    document.getElementById("botao").style.visibility = "hidden";
    document.getElementById("mensagem").style.visibility = "visible";
}




function configure() {
    
    if (typeof require !== 'undefined') XLSX = require('xlsx');
    FS = require('fs');
    PATH = require('path');
    PROC = require('process');
    
    var cfgFileName = PATH.join(PATH.dirname(PROC.execPath), 'config.xlsx');
    
    workbook = XLSX.readFile(cfgFileName);
    
    sheets = workbook.SheetNames;
    
    sheet1 = workbook.Sheets[sheets[0]]
    
    sourceFolder = sheet1.B1.v;
    sourceFilename = sheet1.B2.v;
    outputFolder = sheet1.B3.v;
    outputFilename = sheet1.B4.v;
    
    sheetAsArray = XLSX.utils.sheet_to_row_object_array(sheet1);
    
    columnDefs = [];
    for (var i = 5; i <= sheetAsArray.length + 1; i++) {
        columnDefs.push({ colName: sheet1 ['A' + i].v, cellAddress: sheet1 ['B' + i].v });
    }
    
}


function getData() {
    
    // identificar de onde se vai ler a chave no filename
    var keyStartPos = sourceFilename.length;
    
    var data = [];
    
    // adicionar a linha com os nomes das colunas
    var colNames = [];
    columnDefs.forEach(
        function (colDef) {
            colNames.push(colDef.colName);
        }
    );
    data.push(colNames);
    
    // adicionar os valores de cada ficheiro
    FS.readdirSync(sourceFolder).forEach(
        function (file) {
            
            var stats = FS.statSync(PATH.join(sourceFolder, file));
            if (file.indexOf("~$") != 0 && !stats.isDirectory()) {
                
                var key = file.substring(keyStartPos, file.indexOf('.xlsx'));
                var fich = XLSX.readFile(PATH.join(sourceFolder, file));
                
                var dataRow = [];
                
                columnDefs.forEach(
                    function (colDef) {
                        if (colDef.cellAddress.toUpperCase() === 'Key'.toUpperCase())
                            dataRow.push(key);
                        else
                            dataRow.push(fich.Sheets[fich.SheetNames[0]][colDef.cellAddress].v);
                    }
                );
                data.push(dataRow);
            }
        }
    )
    return data;
}


function process(data) {
    
    var ws_name = "SheetJS";
    
    // Inicializar workbook
    var wb = {}
    wb.Sheets = {};
    wb.Props = {};
    wb.SSF = {};
    wb.SheetNames = [];
    
    /* create worksheet: */
    var ws = {}
    
    /* the range object is used to keep track of the range of the sheet */
    var range = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } };
    
    /* Iterate through each element in the structure */
    for (var R = 0; R != data.length; ++R) {
        if (range.e.r < R) range.e.r = R;
        for (var C = 0; C != data[R].length; ++C) {
            if (range.e.c < C) range.e.c = C;
            
            /* create cell object: .v is the actual data */
            var cell = { v: data[R][C] };
            if (cell.v == null) continue;
            
            /* create the correct cell reference */
            var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
            
            /* determine the cell type */
            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else cell.t = 's';
            
            /* add to structure */
            ws[cell_ref] = cell;
        }
    }
    ws['!ref'] = XLSX.utils.encode_range(range);
    
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    
    // escrever workbook resultado
    var dtNow = new Date();
    var suffix = '' + dtNow.getFullYear() + '' + pad(dtNow.getUTCMonth(), 2) + '' + pad(dtNow.getDate(), 2) + '_' + pad(dtNow.getHours(), 2) + pad(dtNow.getMinutes(), 2) + pad(dtNow.getSeconds(), 2);
    
    XLSX.writeFile(wb, PATH.join(outputFolder, outputFilename + suffix + '.xlsx'));
}




function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}




function setPic() {
    // Atempts at getting NASA Picture of the Day (for App background): couldn't make it work, the response seems to be empty...
    
    /* WITH NAJAX
    NAJAX = require('najax');
    
    var url = "https://api.nasa.gov/planetary/apod?concept_tags=True&api_key=hnFbMEfBoKWSqZTDdrMc9i6j9yQUA7N6climameT";
    NAJAX(url, function (html) { alert('oi' ); });
    */
    
    
    /* WITH JQUERY    
    alert(url);
    
    $.ajax({
        url: url,
        success: handleResult,
        error: handleResult
    });
    
    function handleResult(result) {
    if (result.media_type == "video") {
        $("#apod_img_id").css("display", "none");
        $("#apod_vid_id").attr("src", result.url);
    }
    else {
        $("#apod_vid_id").css("display", "none");
        $("#apod_img_id").attr("src", result.url);
    }
    $("#reqObject").text(url);
    $("#returnObject").text(JSON.stringify(result, null, 4));
    $("#apod_explaination").text(result.explanation);
    $("#apod_title").text(result.title);
     * */

}


/* 
 * ALSO TRIED WITH APODJS
function callback(err, data) {
    alert(err);
    alert(data);
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = data;
}
*/

